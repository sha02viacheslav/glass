import './Quote.css'
import React, { useEffect, useMemo, useState } from 'react'
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp'
import UnfoldMore from '@mui/icons-material/UnfoldMore'
import { Box } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import moment from 'moment'
import { trackPromise } from 'react-promise-tracker'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Chat } from '@glass/components/Chat'
import { ConfirmDialog } from '@glass/components/ConfirmDialog'
import { LicensePlate } from '@glass/components/LicensePlate'
import { OurMethod } from '@glass/components/OurMethod'
import { LocationSelection } from '@glass/components/quotePage/LocationSelection'
import { OrderInformation } from '@glass/components/quotePage/OrderInformation'
import { PaymentMethod } from '@glass/components/quotePage/PaymentMethod'
import { TimeSelection } from '@glass/components/quotePage/TimeSelection'
import { EMPTY_OFFER, PHONE_NUMBER } from '@glass/constants'
import {
  FixglassPaymentMethodTyp,
  OrderState,
  PaymentOptionEnum,
  PaymentStatus,
  QuoteAction,
  QuoteStep,
  WorkingPlace,
} from '@glass/enums'
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
import { isFourMonths } from '@glass/utils/is-four-months/is-four-months.util'
import { scrollToElementWithOffset } from '@glass/utils/scroll-to-element/scroll-to-element.util'
import { setQuoteId } from '@glass/utils/session/session.util'
import { slot2Time } from '@glass/utils/slot-to-time/slot-to-time.util'
import { PendingQuote } from './PendingQuote'

export type QuoteProps = {
  quoteCount?: boolean
}

export const QuotePage: React.FC<QuoteProps> = ({ quoteCount = true }) => {
  const { id } = useParams()
  const showButtons = false
  const [quoteDetails, setQuoteDetails] = useState<Quote | undefined>(undefined)
  const [snapValue, setSnapValue] = useState<QuoteStep>(QuoteStep.PAYMENT)
  const [acceptBtn, setAcceptBtn] = useState<QuoteAction>(QuoteAction.GO_TIME_SLOT)
  const [timeSlot, setTimeSlot] = useState<TimeSlot | undefined>(undefined)
  const [quoteInfoOpen, setInfoOpen] = useState<boolean>(false)
  const [deliveryAddress, setDeliveryAddress] = useState<Address | undefined>(undefined)
  const [paymentOption, setPaymentOption] = useState<PaymentOptionDto>({
    p_option: PaymentOptionEnum.NONE,
    detail: QuoteAction.NONE,
  })
  const [isBlink, setIsBlink] = useState(false)
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
  const [emailMissing, setEmailMissing] = useState<boolean>(false)

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
      setQuoteId(id)
      trackPromise(
        getQuoteService(id, quoteCount).then((res) => {
          if (res.success) {
            setQuoteDetails(res.data)
          } else {
            toast(res.message)
          }
        }),
      )
    }
  }

  const handleSnapChange = (action: QuoteAction) => {
    switch (action) {
      case QuoteAction.GO_TIME_SLOT: {
        setSnapValue(QuoteStep.TIME_SLOT)
        scrollToElementWithOffset('2')
        return
      }
      case QuoteAction.GO_PAYMENT: {
        setSnapValue(QuoteStep.PAYMENT)
        scrollToElementWithOffset('1')
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

    trackPromise(
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
      }),
    )
  }

  const PABegin = () => {
    // create payment API call
    if (id) {
      trackPromise(
        beginPaymentAssistService(
          id,
          isFourMonths(totalPrice)
            ? FixglassPaymentMethodTyp.ASSIST_4_PAYMENT
            : FixglassPaymentMethodTyp.ASSIST_6_PAYMENT,
        ).then((res) => {
          if (res.success) {
            window.open(res.data.url, '_blank', 'noreferrer')
            setPAUrl(res.data.url)
          }
        }),
      )
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

  const PADataToParent = (data: (string | undefined)[]) => {
    setPAData(data)
  }

  const backToCustomer = () => {
    const licenseReg = quoteDetails?.registration_number.replace(' ', '')
    navigate(`/customer/edit/${licenseReg}/${id}`)
  }

  const deliveryAddressToParent = (data: Address | undefined) => {
    setDeliveryAddress(data)
  }

  const handleChangePaymentMethod = (pOption: PaymentOptionDto) => {
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
        id: 0,
        booking_date: quoteDetails.booking_date,
        time_slot: quoteDetails.time_slot,
        isFull: false,
      })
    } else if (quoteDetails?.request_booking_date) {
      setTimeSlot({
        id: 0,
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
    if (id && !quoteDetails) {
      getQuote()
    }
  }, [quoteDetails])

  useEffect(() => {
    // scroll to top on page load
    scrollToElementWithOffset('1')
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
      setAcceptBtn(QuoteAction.GO_TIME_SLOT)
      acceptSelector?.classList.remove('quote-accept')
    } else if (snapValue === QuoteStep.TIME_SLOT) {
      if (quoteDetails?.invoice_data?.payment_state !== PaymentStatus.PAID) {
        if (paymentOption.p_option === PaymentOptionEnum.MONTH_INSTALLMENT) {
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
    <Box sx={{ paddingTop: '102px' }}>
      {!!quoteDetails && (
        <>
          {!quoteDetails?.is_published ? (
            <PendingQuote quoteDetails={quoteDetails} />
          ) : (
            <div className='quote-page px-3 px-md-0'>
              <section className='sec-title'>
                <div className='container'>
                  <h1 className='fnt-48 fnt-md-60 fw-n text-primary px-md-5'>Your Quote</h1>
                </div>
              </section>

              <div className='center'>
                <div className='quote-info-main'>
                  {isBlink && (
                    <Tooltip disableFocusListener title='Booking confirmed'>
                      <div className='client-info-blink'>-</div>
                    </Tooltip>
                  )}
                  <div id='scroll-to-top' className='d-flex flex-column'>
                    <div className='w-100 p-3 bg-grey'>
                      <div className='fnt-20 fnt-md-28 text-primary'>Registry</div>
                      <div className='fnt-14 fnt-md-16 text-grey mt-2'>
                        {quoteDetails?.customer_f_name} {quoteDetails?.customer_s_name}
                        <br />
                        {formatAddress(quoteDetails?.invoice_address)}
                        <br />
                        {quoteDetails?.customer_email} {quoteDetails?.customer_phone}
                      </div>
                    </div>

                    <div className='w-100 p-3'>
                      <LicensePlate placeholderVal={'ENTER REG'} licenseNumber={tempLicenseNum} showSearch={false} />
                    </div>

                    {quoteInfoOpen && (
                      <>
                        <div className='w-100 p-3'>
                          <div className='fnt-20 fnt-md-28 text-primary'>Job Description</div>

                          {!!quoteDetails &&
                            quoteDetails.glass_location.map((element) => (
                              <div key={element} className='fnt-14 fnt-md-16 text-grey mt-2'>
                                <span className='text-primary'>
                                  {element.charAt(0).toUpperCase() + element.slice(1)}
                                </span>{' '}
                                Repair • Tint
                              </div>
                            ))}
                        </div>

                        <div className='w-100 p-3 bg-grey'>
                          <div className='fnt-20 fnt-md-28 text-primary'>Place of Intervention</div>
                          <div className='fnt-14 fnt-md-16 text-grey mt-2'>
                            {quoteDetails?.working_place === WorkingPlace.MOBILE ? (
                              <>
                                <span className='text-primary'>At Your Home/Work</span>{' '}
                                {formatAddress(quoteDetails?.delivery_address)}
                              </>
                            ) : (
                              <>
                                <span className='text-primary'>At Workshop</span> {quoteDetails?.workshop?.name}{' '}
                                {quoteDetails?.workshop?.address}
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className='d-flex justify-content-between align-items-center p-3'>
                    <div className='d-flex align-items-center gap-3'>
                      <button className='btn-raised round position-relative' onClick={backToCustomer}>
                        Edit
                      </button>

                      {emailMissing && <span className='email-missing-error'>Add Email here</span>}
                    </div>
                    <button className='btn-icon' onClick={() => setInfoOpen((prev) => !prev)}>
                      {quoteInfoOpen ? <KeyboardArrowUp /> : <UnfoldMore />}
                    </button>
                  </div>
                </div>
              </div>

              {!quoteDetails?.is_published && (
                <div className='center'>
                  <h2 className='thank-you-header'>Thank you!</h2>
                  <h1 className='extra-info'>We are preparing the quote...</h1>
                  <img
                    className='working-gif'
                    src='https://media.tenor.com/6rG_OghPUKYAAAAM/so-busy-working.gif'
                    alt=''
                  />
                </div>
              )}

              <div className='center'>
                <div className='scroll-container'>
                  {/* select offer / payment method */}
                  {!!quoteDetails && (
                    <div className='quote-card mt-5'>
                      <OrderInformation
                        offerDetails={quoteDetails.is_published ? offersDetails : [EMPTY_OFFER]}
                        optionalOrderLines={quoteDetails.is_published ? optionalOrderLines : []}
                        quoteDetails={quoteDetails}
                        qid={id}
                        totalPrice={quoteDetails.is_published ? totalPrice : 0}
                        totalUnitPrice={quoteDetails.is_published ? totalUnitPrice : 0}
                        onCheckOptionalOrderLine={handleCheckOptionalOrderLine}
                      />

                      {((!quoteDetails?.booking_date && !quoteDetails.request_booking_date) || editBooking) && (
                        <TimeSelection />
                      )}

                      <PaymentMethod
                        quoteDetails={{
                          ...quoteDetails,
                          c_address: formatAddress(quoteDetails?.delivery_address, false),
                          c_postalcode: quoteDetails?.delivery_address?.postcode || '',
                        }}
                        qid={id}
                        totalPrice={quoteDetails.is_published ? totalPrice : 0}
                        payAssist={payAssistToParent}
                        refetchQuote={getQuote}
                        PADataToParent={PADataToParent}
                        PAUrl={PAUrl}
                        handleChangePaymentMethod={handleChangePaymentMethod}
                        handleShowEmailMissing={() => {
                          setEmailMissing(true)
                          scrollToElementWithOffset('scroll-to-top')
                        }}
                      />
                    </div>
                  )}

                  {!!quoteDetails && (
                    <div className='quote-card mt-5'>
                      {(!!quoteDetails?.booking_date || !!quoteDetails?.request_booking_date) && !editBooking ? (
                        <div className='booking-info text-center bg-primary text-white p-4'>
                          {!!quoteDetails?.booking_date && (
                            <>
                              <h1 className='fnt-20 fnt-md-28 mb-4'>You are booked in!</h1>
                              <div className='booking-address mb-4'>
                                Arriving {moment(quoteDetails?.booking_date).format('dddd, DD MMMM YYYY')} from{' '}
                                {slot2Time(quoteDetails.time_slot.split('_')?.[0])} to{' '}
                                {slot2Time(quoteDetails.time_slot.split('_')?.[1])}
                              </div>
                            </>
                          )}

                          {!quoteDetails?.booking_date && !!quoteDetails?.request_booking_date && (
                            <>
                              <h1 className='mb-4'>Request sent, we are now reviewing it!</h1>
                            </>
                          )}

                          {quoteDetails.working_place === WorkingPlace.MOBILE && (
                            <div className='booking-address'>
                              Booked in at{' '}
                              {quoteDetails.delivery_address?.line_1 || quoteDetails.delivery_address?.line_2 || 'N/A'},{' '}
                              {quoteDetails.delivery_address?.town_or_city || 'N/A'}{' '}
                              {quoteDetails.delivery_address?.county || 'N/A'}{' '}
                              {quoteDetails.delivery_address?.postcode || 'N/A'}
                            </div>
                          )}
                          {quoteDetails.working_place === WorkingPlace.WORKSHOP && (
                            <div className='booking-address'>Booked in at {quoteDetails.workshop_address || 'N/A'}</div>
                          )}
                          {quoteDetails?.order_state !== OrderState.WON && (
                            <div className='d-flex justify-content-end mt-3'>
                              <button className='btn-stroked round' onClick={() => setEditBooing(true)}>
                                EDIT
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <LocationSelection
                            qid={id}
                            quoteInfo={quoteDetails}
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
                </div>
              </div>

              {/* Hide for now */}
              {showButtons && (
                <div className='accept-btn-container' id='accept-cont'>
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

              <div className='mt-5'>
                <OurMethod beforeAfterImages={quoteDetails?.images_gallery} showTitle={false} />
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
                        {moment(timeSlot?.booking_date)
                          .add(timeSlot?.time_slot.split('_')?.[0], 'hours')
                          .format('hh:mm A')}{' '}
                        and{' '}
                        {moment(timeSlot?.booking_date)
                          .add(timeSlot?.time_slot.split('_')?.[1], 'hours')
                          .format('hh:mm A')}
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
                      Make sure we have enough space to fully open your vehicle doors and we can park our mid-sized van
                      next. If not enough space we have to move to different location. If needed, remove dashcam, empty
                      dashboard and/or door pockets. It will help us vacuum the shattered glass. <br />
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

              {!!quoteDetails && <Chat qid={id} />}
            </div>
          )}
        </>
      )}
    </Box>
  )
}
