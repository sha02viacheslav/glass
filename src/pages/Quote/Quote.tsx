import './quote.css'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import moment from 'moment'
import { trackPromise } from 'react-promise-tracker'
import { useNavigate, useParams } from 'react-router-dom'
import expand from '@glass/assets/icons/expand.png'
import flag from '@glass/assets/icons/uk-flag.png'
import up from '@glass/assets/icons/up.png'
import close from '@glass/assets/icons/x.png'
import { BeforeAfter } from '@glass/components/BeforeAfter'
import { ConfirmDialog } from '@glass/components/ConfirmDialog'
import { LocationSelection } from '@glass/components/quotePage/LocationSelection'
import { PaymentMethod } from '@glass/components/quotePage/PaymentMethod'
import { TimeSelection } from '@glass/components/quotePage/TimeSelection'
import { BOOKING_DATE_FORMAT, EMPTY_OFFER, PHONE_NUMBER } from '@glass/constants'
import { OrderState, PaymentOptionEnum, PaymentStatus, QuoteAction, QuoteStep } from '@glass/enums'
import { useCalcPriceSummary } from '@glass/hooks/useCalcPriceSummary'
import { Address, Offer, OptionalOrderLine, PaymentOptionDto, Quote, TimeSlot } from '@glass/models'
import { addOptionalProductService } from '@glass/services/apis/add-optional-product.service'
import { beginPaymentAssistService } from '@glass/services/apis/begin-payment-assist.service'
import { getQuoteService } from '@glass/services/apis/get-quote.service'
import { preApprovePaymentService } from '@glass/services/apis/pre-approve-payment.service'
import { removeOptionalProductService } from '@glass/services/apis/remove-optional-product.service'
import { requestAvailabilityService } from '@glass/services/apis/request-availability.service'
import { sendBookingService } from '@glass/services/apis/send-booking.service'
import { updateDeliveryAddressService } from '@glass/services/apis/update-delivery-address.service'
import { formatAddress } from '@glass/utils/format-address/format-address.util'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

export type QuoteProps = {
  quoteCount?: boolean
}

export const QuotePage: React.FC<QuoteProps> = ({ quoteCount = true }) => {
  const { id } = useParams()
  const showButtons = false
  const [quoteDetails, setQuoteDetails] = useState<Quote | undefined>(undefined)
  const [snapValue, setSnapValue] = useState<QuoteStep>(QuoteStep.PAYMENT)
  const [acceptBtn, setAcceptBtn] = useState<QuoteAction>(QuoteAction.GO_TIMESLOT)
  const [timeSlot, setTimeSlot] = useState<TimeSlot | undefined>(undefined)
  const [quoteInfoOpen, setInfoOpen] = useState<boolean>(true)
  const [deliveryAddress, setDeliveryAddress] = useState<Address | undefined>(undefined)
  const [paymentOption, setPaymentOption] = useState<PaymentOptionDto>({
    p_option: PaymentOptionEnum.NONE,
    detail: QuoteAction.NONE,
  })
  const [declinePopup, setDeclinePopup] = useState(false)
  const [declineReason, setDeclineReason] = useState<number>(0)
  const [isBlink, setIsBlink] = useState(false)
  const declineRef = useRef<HTMLInputElement>(null)
  const [tempLicenseNum, setTempLicense] = useState('')
  const navigate = useNavigate()
  const [offersDetails, setOffersDetails] = useState<Offer[]>([EMPTY_OFFER])
  const [optionalOrderLines, setOptionalOrderLines] = useState<OptionalOrderLine[]>([])
  const [PAData, setPAData] = useState<(string | undefined)[]>([])
  const [PAUrl, setPAUrl] = useState<string>('')
  const [warningMsg, setWarningMsg] = useState<string>('')
  const [showBookingMsg, setShowBookingMsg] = useState<boolean>(false)
  const [showRequestAvailabilityMsg, setShowRequestAvailabilityMsg] = useState<boolean>(false)
  const [showConfirmBooking, setShowConfirmBooking] = useState<boolean>(false)
  const [editBooking, setEditBooing] = useState<boolean>(false)

  const { totalPrice, totalUnitPrice } = useCalcPriceSummary(quoteDetails)

  const timeSlotIsChanged = useMemo<boolean>(() => {
    if (!timeSlot) return false
    if (!timeSlot.isFull) {
      return timeSlot.booking_date !== quoteDetails?.booking_date && timeSlot.time_slot !== quoteDetails?.time_slot
    } else {
      return (
        timeSlot.booking_date !== quoteDetails?.request_booking_date &&
        timeSlot.time_slot !== quoteDetails?.request_time_slot
      )
    }
  }, [timeSlot, quoteDetails])

  const deliveryAddressIsChanged = useMemo<boolean>(() => {
    return !!deliveryAddress && formatAddress(deliveryAddress) !== formatAddress(quoteDetails?.delivery_address)
  }, [deliveryAddress, quoteDetails])

  const getQuote = () => {
    if (id) {
      trackPromise(
        getQuoteService(id, quoteCount).then((res) => {
          if (res.success) {
            setQuoteDetails(res.data)
          }
        }),
      )
    }
  }

  const handleSnapChange = (action: QuoteAction) => {
    switch (action) {
      case QuoteAction.GO_TIMESLOT: {
        setSnapValue(QuoteStep.TIMESLOT)
        const dom = document.getElementById('2')
        if (dom) dom.scrollIntoView({ behavior: 'smooth' })
        return
      }
      case QuoteAction.GO_PAYMENT: {
        setSnapValue(QuoteStep.PAYMENT)
        const dom = document.getElementById('1')
        if (dom) dom.scrollIntoView({ behavior: 'smooth' })
        return
      }
      case QuoteAction.CONFIRM_BOOKING: {
        handleConfirmBookingChange()
        return
      }
      case QuoteAction.CONTINUE_PA:
      case QuoteAction.CHECK_ELIGIBILITY: {
        confirmPA()
      }
    }
  }

  const confirmPA = () => {
    let first: string
    let second: string
    let post: string
    let addr: string
    if (PAData.length === 0) {
      first = quoteDetails?.customer_f_name || ''
      second = quoteDetails?.customer_s_name || ''
      post = quoteDetails?.delivery_address?.postcode || ''
      addr = formatAddress(quoteDetails?.delivery_address, false)
    } else {
      first = PAData[0] || ''
      second = PAData[1] || ''
      post = PAData[3] || ''
      addr = PAData[4] || ''
    }

    preApprovePaymentService({
      f_name: first,
      s_name: second,
      addr1: addr,
      postcode: post,
    }).then((res) => {
      if (res.success) {
        if (res.data.approved) {
          PABegin()
        }
      }
    })
  }

  const PABegin = () => {
    // create payment API call
    if (id) {
      beginPaymentAssistService(id).then((res) => {
        if (res.success) {
          window.open(res.data.url, '_blank', 'noreferrer')
          setPAUrl(res.data.url)
        }
      })
    }
  }

  const sendBookingData = () => {
    if (id && quoteDetails) {
      const promises: Promise<void>[] = []

      if (timeSlot) {
        promises.push(
          new Promise((resolve) =>
            sendBookingService(id, timeSlot.booking_date, timeSlot.time_slot).then(() => {
              resolve()
            }),
          ),
        )
      }
      if (deliveryAddress && formatAddress(deliveryAddress) !== formatAddress(quoteDetails.delivery_address)) {
        promises.push(
          new Promise((resolve) =>
            updateDeliveryAddressService({
              customer_id: quoteDetails.customer_id,
              address_id: quoteDetails.delivery_address.address_id,
              line_1: deliveryAddress.line_1,
              line_2: deliveryAddress.line_2,
              postcode: deliveryAddress.postcode,
              latitude: deliveryAddress.latitude,
              longitude: deliveryAddress.longitude,
              town_or_city: deliveryAddress.town_or_city,
              county: deliveryAddress.county,
              country: deliveryAddress.country,
            }).then(() => {
              resolve()
            }),
          ),
        )
      }

      trackPromise(
        Promise.all(promises).finally(() => {
          getQuote()
          setShowBookingMsg(true)
          setEditBooing(false)
        }),
      )
    }
  }

  const handleConfirmBookingChange = () => {
    if (!timeSlot) {
      setWarningMsg('Select a time for the repair!')
      return
    }
    if (!deliveryAddress && !quoteDetails?.delivery_address) {
      setWarningMsg('Select a delivery address for the repair!')
      return
    }
    setShowConfirmBooking(true)
  }

  const handleCancelBookingChange = () => {
    initTimeSlot()
    setEditBooing(false)
  }

  const sendRequestAvailability = () => {
    if (id && quoteDetails) {
      const promises: Promise<void>[] = []

      if (timeSlot) {
        promises.push(
          new Promise((resolve) =>
            requestAvailabilityService(id, timeSlot.booking_date, timeSlot.time_slot).then(() => {
              resolve()
            }),
          ),
        )
      }
      if (deliveryAddress && formatAddress(deliveryAddress) !== formatAddress(quoteDetails.delivery_address)) {
        promises.push(
          new Promise((resolve) =>
            updateDeliveryAddressService({
              customer_id: quoteDetails.customer_id,
              address_id: quoteDetails.delivery_address.address_id,
              line_1: deliveryAddress.line_1,
              line_2: deliveryAddress.line_2,
              postcode: deliveryAddress.postcode,
              latitude: deliveryAddress.latitude,
              longitude: deliveryAddress.longitude,
              town_or_city: deliveryAddress.town_or_city,
              county: deliveryAddress.county,
              country: deliveryAddress.country,
            }).then(() => {
              resolve()
            }),
          ),
        )
      }

      trackPromise(
        Promise.all(promises).finally(() => {
          getQuote()
          setShowRequestAvailabilityMsg(true)
          setEditBooing(false)
        }),
      )
    }
  }

  const handleRequestAvailability = () => {
    if (!timeSlot) {
      setWarningMsg('Select a time for the repair!')
      return
    }
    if (!deliveryAddress && !quoteDetails?.delivery_address) {
      setWarningMsg('Select a delivery address for the repair!')
      return
    }
    sendRequestAvailability()
  }

  function handleDecline() {
    setDeclinePopup(true)
  }

  const selectDeclineReason = (option: number) => {
    setDeclineReason(option)
  }

  const PADataToParent = (data: (string | undefined)[]) => {
    setPAData(data)
  }

  const backToCustomer = () => {
    const licenseReg = quoteDetails?.registration_number.replace(' ', '')
    sessionStorage.setItem('quoteInfo', JSON.stringify({ fe_token: id, ...quoteDetails }))
    navigate('/customer/edit/' + licenseReg)
  }

  const timeSlotToParent = (data: TimeSlot) => {
    setTimeSlot(data)
    setWarningMsg('')
  }

  const deliveryAddressToParent = (data: Address | undefined) => {
    setDeliveryAddress(data)
  }

  const paymentOptionToParent = (pOption: PaymentOptionDto) => {
    setPaymentOption(pOption)
  }

  const payAssistToParent = () => {
    confirmPA()
  }

  const handleCheckOptionalOrderLine = (orderLineId: number, optionalLineId: number, checked: boolean) => {
    if (!id) return
    if (checked) {
      addOptionalProductService(id, optionalLineId).then((res) => {
        if (res.success) {
          getQuote()
        }
      })
    } else {
      removeOptionalProductService(id, orderLineId, optionalLineId).then((res) => {
        if (res.success) {
          getQuote()
        }
      })
    }
  }

  const initTimeSlot = () => {
    if (quoteDetails?.booking_date) {
      setTimeSlot({
        booking_date: quoteDetails.booking_date,
        time_slot: quoteDetails.time_slot,
        isFull: false,
      })
    } else if (quoteDetails?.request_booking_date) {
      setTimeSlot({
        booking_date: quoteDetails.request_booking_date,
        time_slot: quoteDetails.request_time_slot,
        isFull: true,
      })
    } else {
      setTimeSlot(undefined)
    }
  }

  useEffect(() => {
    // Get Quote Data
    if (id) {
      getQuote()
    }

    // scroll to top on page load
    const topSelector = document.getElementById('1')
    if (topSelector !== null) {
      topSelector.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    if (quoteDetails) {
      const optionalOrderLines = quoteDetails.optional_order_lines || []
      if (quoteDetails.order_state === OrderState.OPEN) {
        if (quoteDetails.order_lines?.length)
          setOffersDetails(
            quoteDetails.order_lines.filter(
              (item) => optionalOrderLines.findIndex((x) => x.order_line_id === item.order_line_id) < 0,
            ),
          )
        setOptionalOrderLines(optionalOrderLines)
      } else {
        if (quoteDetails.order_lines?.length) setOffersDetails(quoteDetails.order_lines)
        setOptionalOrderLines([])
      }

      if (quoteDetails.order_state == OrderState.CONFIRM && quoteDetails.booking_date) {
        setIsBlink(true)
      }
      setTempLicense(formatLicenseNumber(quoteDetails.registration_number))
      initTimeSlot()
    }
  }, [quoteDetails])

  useEffect(() => {
    // change between accept and next buttons names and styling
    const acceptSelector = document.getElementById('accept-btn')
    if (
      (!!timeSlot &&
        (timeSlot.booking_date !== quoteDetails?.booking_date || timeSlot.time_slot !== quoteDetails?.time_slot)) ||
      (!!deliveryAddress && formatAddress(deliveryAddress) !== formatAddress(quoteDetails?.delivery_address))
    ) {
      setAcceptBtn(QuoteAction.CONFIRM_BOOKING)
      acceptSelector?.classList.add('quote-accept')
    } else if (snapValue === QuoteStep.PAYMENT) {
      setAcceptBtn(QuoteAction.GO_TIMESLOT)
      acceptSelector?.classList.remove('quote-accept')
    } else if (snapValue === QuoteStep.TIMESLOT) {
      if (quoteDetails?.invoice_data?.payment_state !== PaymentStatus.PAID) {
        if (paymentOption.p_option === PaymentOptionEnum.FOUR_MONTH) {
          setAcceptBtn(paymentOption.detail)
        } else {
          setAcceptBtn(QuoteAction.GO_PAYMENT)
        }
      } else {
        if (
          timeSlot?.booking_date !== quoteDetails?.booking_date ||
          timeSlot?.time_slot !== quoteDetails?.time_slot ||
          formatAddress(deliveryAddress) !== formatAddress(quoteDetails.delivery_address)
        ) {
          setAcceptBtn(QuoteAction.CONFIRM_BOOKING)
        } else {
          setAcceptBtn(QuoteAction.NONE)
        }
      }

      acceptSelector?.classList.add('quote-accept')
    }
  }, [snapValue, timeSlot, paymentOption, quoteDetails?.invoice_data])

  return (
    <div className='my-4 my-md-5'>
      {declinePopup && (
        <div className='popup-background'>
          <div className='popup-container'>
            <div className='popup-close-container'>
              <img className='popup-close' src={close} alt='' onClick={() => setDeclinePopup(false)} />
            </div>
            <div className='popup-decline-container'>
              <div>Reason for declining</div>
              <div
                className={declineReason === 1 ? 'popup-decline-reason-act' : 'popup-decline-reason'}
                onClick={() => selectDeclineReason(1)}
              >
                1. Too expensive
              </div>
              <div
                className={declineReason === 2 ? 'popup-decline-reason-act' : 'popup-decline-reason'}
                onClick={() => selectDeclineReason(2)}
              >
                2. Job already done
              </div>
              <input type='text' ref={declineRef} placeholder='3. Other' />
            </div>
            <div className='popup-btn-container'>
              {/* needs a function to take back */}
              <button className='btn btn-purple-outline mb-3' onClick={() => setDeclinePopup(false)}>
                Close
              </button>
              <button className='btn btn-purple-radius mb-3' onClick={() => setDeclinePopup(false)}>
                Take back decline
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='center'>
        {quoteInfoOpen && (
          <div className='quote-info-main'>
            <div className='client-info-container'>
              {isBlink && (
                <Tooltip disableFocusListener title='Booking confirmed'>
                  <div className='client-info-blink'>-</div>
                </Tooltip>
              )}
              <div className='info-container'>
                <div id='scroll-to-top'>
                  <div className='yellow-box' key={tempLicenseNum}>
                    <div className='blue-box'>
                      <img className='flag' src={flag} alt='' />
                      <div className='gb'>UK</div>
                    </div>
                    <input className='license-input' type='text' defaultValue={tempLicenseNum} placeholder='NU71 REG' />
                  </div>
                  <div className='client-info'>
                    {quoteDetails?.customer_f_name} {quoteDetails?.customer_s_name}
                  </div>
                  <div className='client-info'>
                    <b>Billing address:</b> {formatAddress(quoteDetails?.invoice_address)}
                  </div>
                  <div className='client-info'>
                    <b>Email:</b> {quoteDetails?.customer_email}
                  </div>
                  <div className='client-info'>
                    <b>Phone number:</b> {quoteDetails?.customer_phone}
                  </div>
                  <div className='client-info'>
                    <b>Make:</b> {quoteDetails?.make}
                  </div>
                  <div className='client-info'>
                    <b>Model:</b> {quoteDetails?.model}
                  </div>
                </div>
              </div>
              <div className='edit-btn-container'>
                <button className='edit-btn' onClick={backToCustomer}>
                  EDIT
                </button>
              </div>
            </div>
            <div className='quote-info-bottom'>
              <div className='compact-bottom-row'>
                <span className='quote-selected-windows'>
                  <b>Selected windows:</b>{' '}
                </span>
                {!!quoteDetails &&
                  quoteDetails.glass_location.map((element) => (
                    <span key={element} className='client-windows'>
                      {element}
                    </span>
                  ))}
              </div>
              <img
                onClick={() => setInfoOpen(false)}
                src={up}
                alt=''
                style={{ width: '17px' }}
                className='client-up-icon'
              />
            </div>
          </div>
        )}
        {!quoteInfoOpen && (
          <div className='quote-info-compact'>
            {isBlink && (
              <Tooltip disableFocusListener title='Booking confirmed'>
                <div className='client-info-blink'>-</div>
              </Tooltip>
            )}
            <div className='client-info-compact'>
              <div className='yellow-box' key={tempLicenseNum}>
                <div className='blue-box'>
                  <img className='flag' src={flag} alt='' />
                  <div className='gb'>UK</div>
                </div>
                <input className='license-input' type='text' defaultValue={tempLicenseNum} placeholder='NU71 REG' />
              </div>
              <div className='client-info'>
                {quoteDetails?.customer_f_name} {quoteDetails?.customer_s_name}
              </div>
              <div className='compact-bottom-row'>
                {!!quoteDetails &&
                  quoteDetails.glass_location.map((element) => (
                    <span key={element} className='client-windows'>
                      {element}
                    </span>
                  ))}
              </div>
            </div>
            <img onClick={() => setInfoOpen(true)} className='client-info-icon' src={expand} alt='' />
          </div>
        )}
      </div>
      {!quoteDetails?.is_published && (
        <div className='center'>
          <h2 className='thank-you-header'>Thank you!</h2>
          <h1 className='extra-info'>We are preparing the quote...</h1>
          <img className='working-gif' src='https://media.tenor.com/6rG_OghPUKYAAAAM/so-busy-working.gif' alt='' />
        </div>
      )}

      <div className='true-top' id='1'>
        -
      </div>

      <div className='center'>
        <div className='scroll-container'>
          {/* select offer / payment method */}
          <div id='offer' className='mt-5'>
            {!!quoteDetails && (
              <PaymentMethod
                offerDetails={quoteDetails.is_published ? offersDetails : [EMPTY_OFFER]}
                optionalOrderLines={quoteDetails.is_published ? optionalOrderLines : []}
                quoteDetails={{
                  ...quoteDetails,
                  c_address: formatAddress(quoteDetails?.delivery_address, false),
                  c_postalcode: quoteDetails?.delivery_address?.postcode || '',
                }}
                qid={id}
                totalPrice={quoteDetails.is_published ? totalPrice : 0}
                totalUnitPrice={quoteDetails.is_published ? totalUnitPrice : 0}
                payAssist={payAssistToParent}
                refetchQuote={getQuote}
                PADataToParent={PADataToParent}
                PAUrl={PAUrl}
                method={paymentOptionToParent}
                onCheckOptionalOrderLine={handleCheckOptionalOrderLine}
              />
            )}
          </div>

          <div className='quote-scroll-target' id='2'>
            -
          </div>

          {!!quoteDetails && (
            <div className='quote-card'>
              {(!!quoteDetails?.booking_date || !!quoteDetails?.request_booking_date) && !editBooking ? (
                <div className='booking-info p-4'>
                  {!!quoteDetails?.booking_date && (
                    <>
                      <h1 className='mb-4'>You are booked in!</h1>
                      <div className='booking-address mb-4'>
                        <div>
                          {moment(quoteDetails?.booking_date)
                            .add(quoteDetails.time_slot.split('_')?.[0], 'hours')
                            .format('dddd, DD MMMM')}
                        </div>
                        <div>
                          Arrival window between{' '}
                          {moment(quoteDetails?.booking_date)
                            .add(quoteDetails.time_slot.split('_')?.[0], 'hours')
                            .format('HH')}{' '}
                          -{' '}
                          {moment(quoteDetails?.booking_date)
                            .add(quoteDetails.time_slot.split('_')?.[1], 'hours')
                            .format('HH')}
                        </div>
                      </div>
                    </>
                  )}

                  {!quoteDetails?.booking_date && !!quoteDetails?.request_booking_date && (
                    <>
                      <h1 className='mb-4'>Request sent, we are now reviewing it!</h1>
                    </>
                  )}

                  <div className='booking-address'>
                    {quoteDetails.delivery_address?.line_1 || quoteDetails.delivery_address?.line_2},{' '}
                    {quoteDetails.delivery_address?.town_or_city}
                    <br />
                    {quoteDetails.delivery_address?.county}
                    <br />
                    {quoteDetails.delivery_address?.postcode}
                  </div>
                  {quoteDetails?.order_state !== OrderState.WON && (
                    <div className='d-flex justify-content-end'>
                      <button className='edit-btn' onClick={() => setEditBooing(true)}>
                        EDIT
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <TimeSelection
                    timeSlotToParent={timeSlotToParent}
                    liveBooking={false}
                    bookingStartDate={
                      quoteDetails?.booking_date
                        ? moment(quoteDetails?.booking_date)
                            .add(quoteDetails.time_slot.split('_')?.[0], 'hours')
                            .format(BOOKING_DATE_FORMAT)
                        : moment(quoteDetails?.request_booking_date)
                            .add(quoteDetails.request_time_slot.split('_')?.[0], 'hours')
                            .format(BOOKING_DATE_FORMAT)
                    }
                  />
                  <LocationSelection
                    userBillingAddress={quoteDetails.invoice_address}
                    deliveryAddressToChild={quoteDetails.delivery_address}
                    deliveryAddressToParent={deliveryAddressToParent}
                  />
                  {(editBooking || timeSlotIsChanged || deliveryAddressIsChanged) && (
                    <div className='d-flex justify-content-center gap-4 mb-4'>
                      <button className='btn-stroked' onClick={() => handleCancelBookingChange()}>
                        Cancel
                      </button>
                      {timeSlot?.isFull ? (
                        <button className='btn-raised' onClick={() => handleRequestAvailability()}>
                          Request Availability
                        </button>
                      ) : (
                        <button className='btn-raised' onClick={() => handleConfirmBookingChange()}>
                          Confirm Booking
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {showButtons && (
            <div className='quote-scroll-target-2' id='3'>
              -
            </div>
          )}
        </div>
      </div>

      {/* Hide for now */}
      {showButtons && (
        <div className='accept-btn-container' id='accept-cont'>
          <button
            className='btn btn-purple-outline mb-3 quote-btn quote-decline'
            onClick={handleDecline}
            id='decline-btn'
          >
            Decline
          </button>
          {quoteDetails?.order_state !== OrderState.WON && !!acceptBtn && (
            <button
              className='btn btn-purple-radius mb-3 quote-btn'
              onClick={() => handleSnapChange(acceptBtn)}
              id='accept-btn'
            >
              {acceptBtn}
            </button>
          )}
        </div>
      )}

      <div className='quote-before-after'>
        <BeforeAfter />
      </div>

      <div className='center mb-5'>
        <h2 className='contact-message'>If you have questions please call {PHONE_NUMBER}</h2>
      </div>

      {!!warningMsg && (
        <ConfirmDialog
          title='Error'
          description={warningMsg}
          showCancel={false}
          confirmStr='Ok'
          onConfirm={() => setWarningMsg('')}
        />
      )}

      {showConfirmBooking && (
        <ConfirmDialog
          title='Confirm Booking'
          description={
            <span className='text-left d-block'>
              Are you certain you want to make a booking for{' '}
              <strong>
                {moment(timeSlot?.booking_date).format('dddd, MMMM Do')}, between{' '}
                {moment(timeSlot?.booking_date).add(timeSlot?.time_slot.split('_')?.[0], 'hours').format('hh:mm A')} and{' '}
                {moment(timeSlot?.booking_date).add(timeSlot?.time_slot.split('_')?.[1], 'hours').format('hh:mm A')}
              </strong>
              ?
            </span>
          }
          onConfirm={() => {
            sendBookingData()
            setShowConfirmBooking(false)
          }}
          onCancel={() => setShowConfirmBooking(false)}
        />
      )}

      {showBookingMsg && (
        <ConfirmDialog
          title='You are booked in!'
          showIcon={false}
          description={
            <span className='text-left d-block'>
              Arriving {moment(quoteDetails?.booking_date).format('dddd, DD MMMM')} between{' '}
              {timeSlot?.time_slot.split('_')?.[0]} - {timeSlot?.time_slot.split('_')?.[1]}
              <br />
              {quoteDetails?.delivery_address?.line_1}, {quoteDetails?.delivery_address?.town_or_city},{' '}
              {quoteDetails?.delivery_address?.postcode}
            </span>
          }
          subDescription={
            <span className='text-left d-block'>
              <br />
              Job will take 1-2 hours to complete. <br />
              We need to test wipers and/or door glass movement.
              <br />
              <br />
              How can you help our work process and quality: <br />
              Make sure we have enough space to fully open your vehicle doors and we can park our mid-sized van next. If
              not enough space we have to move to different location. If needed, remove dashcam, empty dashboard and/or
              door pockets. It will help us vacuum the shattered glass. <br />
              Then just let us do the rest and we will notify you when all is done. <br />
              <br />
              Any question, call {PHONE_NUMBER}
            </span>
          }
          showCancel={false}
          confirmStr='Ok'
          onConfirm={() => setShowBookingMsg(false)}
        />
      )}

      {showRequestAvailabilityMsg && (
        <ConfirmDialog
          title='Request sent!'
          showIcon={false}
          description={<span className='text-left d-block'>We are now reviewing it</span>}
          showCancel={false}
          confirmStr='Ok'
          onConfirm={() => setShowRequestAvailabilityMsg(false)}
        />
      )}
    </div>
  )
}
