import './quote.css'
import React, { useEffect, useRef, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import moment from 'moment'
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
import { BOOKING_DATE_FORMAT } from '@glass/constants'
import { OrderState, PaymentOptionEnum, PaymentStatus, QuoteStep } from '@glass/enums'
import { useCalcPriceSummary } from '@glass/hooks/useCalcPriceSummary'
import { Offer, OptionalOrderLine, PaymentOptionDto, Quote, TimeSlot } from '@glass/models'
import { addOptionalProductService } from '@glass/services/apis/add-optional-product.service'
import { beginPaymentAssistService } from '@glass/services/apis/begin-payment-assist.service'
import { getQuoteService } from '@glass/services/apis/get-quote.service'
import { preApprovePaymentService } from '@glass/services/apis/pre-approve-payment.service'
import { removeOptionalProductService } from '@glass/services/apis/remove-optional-product.service'
import { sendBookingService } from '@glass/services/apis/send-booking.service'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

export type QuoteProps = {
  quoteCount?: boolean
}

export const QuotePage: React.FC<QuoteProps> = ({ quoteCount = true }) => {
  // Tabs - controls the different views of the quote page: 0 -> customer, 1 -> pay&book, 3 -> thank you
  const { id } = useParams()
  const [quoteDetails, setQuoteDetails] = useState<Quote | undefined>(undefined)
  const [snapValue, setSnapValue] = useState<QuoteStep>(QuoteStep.PAYMENT)
  const [acceptBtn, setAcceptBtn] = useState('Next') // can change to Next
  const [timeSlot, setTimeSlot] = useState<TimeSlot | undefined>(undefined)
  const [quoteInfoOpen, setInfoOpen] = useState(false)
  const [billingAddress, setBillingAddress] = useState('')
  const [, setDeliveryAddress] = useState('')
  const [paymentOption, setPaymentOption] = useState<PaymentOptionDto>({ p_option: PaymentOptionEnum.NONE, detail: '' })
  const [declinePopup, setDeclinePopup] = useState(false)
  const [declineReason, setDeclineReason] = useState<number>(0)
  const [isBlink, setIsBlink] = useState(false)
  const declineRef = useRef<HTMLInputElement>(null)
  const [tempLicenseNum, setTempLicense] = useState('')
  const navigate = useNavigate()
  const [offersDetails, setOffersDetails] = useState<Offer[]>([
    {
      product: '',
      discount: 0,
      price_unit: 0,
      price_total: 0,
      price_subtotal: 0,
    },
  ])
  const [optionalOrderLines, setOptionalOrderLines] = useState<OptionalOrderLine[]>([])
  const [PAData, setPAData] = useState<(string | undefined)[]>([])
  const [PAUrl, setPAUrl] = useState<string>('')
  const [warningMsg, setWarningMsg] = useState<string>('')

  const { totalPrice, totalUnitPrice } = useCalcPriceSummary(quoteDetails)

  const getQuote = () => {
    if (id) {
      getQuoteService(id, quoteCount).then((res) => {
        if (res.success) {
          setQuoteDetails(res.data)
          setBillingAddress(res.data.customer_order_postal_code)
        }
      })
    }
  }

  const handleSnapChange = () => {
    // navigate scroll snap
    if (snapValue === QuoteStep.PAYMENT) {
      setSnapValue(QuoteStep.TIMESLOT)
      const dom = document.getElementById('2')
      if (dom) dom.scrollIntoView({ behavior: 'smooth' })
    } else if (snapValue === QuoteStep.TIMESLOT && !timeSlot) {
      if (quoteDetails?.invoice_data?.payment_state === PaymentStatus.PAID) {
        setWarningMsg('Select a time for the repair!')
      } else {
        setSnapValue(QuoteStep.PAYMENT)
        const dom = document.getElementById('1')
        if (dom) dom.scrollIntoView({ behavior: 'smooth' })
      }
    } else if (snapValue === QuoteStep.TIMESLOT && !!timeSlot) {
      if (
        quoteDetails?.invoice_data?.payment_state !== PaymentStatus.PAID &&
        (paymentOption.p_option === PaymentOptionEnum.NONE || paymentOption.detail === 'Select payment method')
      ) {
        // scroll to PM component if no payment method is selected
        setSnapValue(QuoteStep.PAYMENT)
        const dom = document.getElementById('1')
        if (dom) dom.scrollIntoView({ behavior: 'smooth' })
      } else if (
        paymentOption.p_option === PaymentOptionEnum.FOUR_MONTH &&
        paymentOption.detail !== 'Select payment method'
      ) {
        // pay with Payment Assist
        sendBookingData(timeSlot)
        confirmPA()
      } else {
        sendBookingData(timeSlot)
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
      post =
        quoteDetails?.customer_order_postal_code.substring(quoteDetails.customer_order_postal_code.length - 8) || ''
      addr = quoteDetails?.customer_order_postal_code.slice(0, -8) || ''
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

  const sendBookingData = (selectedSlot: TimeSlot) => {
    if (id) {
      sendBookingService(
        id,
        moment(selectedSlot.start).format(BOOKING_DATE_FORMAT),
        moment(selectedSlot.end).format(BOOKING_DATE_FORMAT),
      ).then(() => {
        setIsBlink(true)
      })
    }
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
    const licenseReg = quoteDetails?.registration_number
    const i = quoteDetails?.customer_name.indexOf(' ') || 0
    const names = [quoteDetails?.customer_name.slice(0, i), quoteDetails?.customer_name.slice(i + 1)]
    const quoteData = JSON.stringify({
      address: quoteDetails?.customer_order_postal_code,
      firstName: names[0],
      lastName: names[1],
      email: quoteDetails?.customer_email,
      phone: quoteDetails?.customer_phone,
      selected: quoteDetails?.glass_location,
    })
    sessionStorage.setItem('quoteInfo', quoteData)
    navigate('/customer/' + licenseReg)
  }

  const timeSlotToParent = (data: TimeSlot) => {
    setTimeSlot(data)
    setWarningMsg('')
  }

  const deliveryAddressToParent = (data: string) => {
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

  useEffect(() => {
    // Get Quote Data
    if (id) {
      getQuote()
    }

    // hide navbar and footer
    const navbarMain = document.getElementById('navbar-main')
    const footerMain = document.getElementById('footer-main')
    if (navbarMain) navbarMain.style.display = 'none'
    if (footerMain) footerMain.style.display = 'none'
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
    }
  }, [quoteDetails])

  useEffect(() => {
    if (quoteDetails) {
      setTempLicense(formatLicenseNumber(quoteDetails.registration_number))
    }
  }, [quoteDetails])

  useEffect(() => {
    // change between accept and next buttons names and styling
    const acceptSelector = document.getElementById('accept-btn')
    if (!acceptSelector) return
    if (snapValue === QuoteStep.PAYMENT) {
      setAcceptBtn('Next')
      acceptSelector.classList.remove('quote-accept')
    } else if (snapValue === QuoteStep.TIMESLOT) {
      if (quoteDetails?.invoice_data?.payment_state !== PaymentStatus.PAID) {
        if (paymentOption.p_option === PaymentOptionEnum.FOUR_MONTH) {
          setAcceptBtn(paymentOption.detail)
        } else {
          setAcceptBtn('Select payment method')
        }
      } else {
        setAcceptBtn('Book Online')
      }

      acceptSelector.classList.add('quote-accept')
    }
  }, [snapValue, timeSlot, paymentOption, quoteDetails?.invoice_data])

  return (
    <div>
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
        <div className='true-top' id='1'>
          -
        </div>
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
                  <div className='client-info'>{quoteDetails?.customer_name}</div>
                  <div className='client-info'>
                    <b>Billing address:</b> {quoteDetails?.customer_order_postal_code}
                  </div>
                  <div className='client-info'>
                    <b>Email:</b> {quoteDetails?.customer_email}
                  </div>
                  <div className='client-info'>
                    <b>Phone number:</b>
                    {quoteDetails?.customer_phone}
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
              <div className='client-info'>{quoteDetails?.customer_name}</div>
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

      {quoteDetails?.is_published && (
        <div className='center'>
          <div className='scroll-container'>
            {/* select offer / payment method */}
            <div id='offer' className='mt-5'>
              {!!quoteDetails && (
                <PaymentMethod
                  offerDetails={offersDetails}
                  optionalOrderLines={optionalOrderLines}
                  quoteDetails={{
                    ...quoteDetails,
                    c_address: quoteDetails.customer_order_postal_code.slice(0, -8),
                    c_postalcode: quoteDetails.customer_order_postal_code.substring(
                      quoteDetails.customer_order_postal_code.length - 8,
                    ),
                  }}
                  qid={id}
                  totalPrice={totalPrice}
                  totalUnitPrice={totalUnitPrice}
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
                {quoteDetails?.order_state === OrderState.WON ? (
                  <div className='booking-info p-4'>
                    <h1 className='mb-4'>Booking Confirmed</h1>
                    <div className='booking-address mb-4'>
                      <div>{moment(quoteDetails?.booking_start_date).format('DD MMMM')}</div>
                      <div>
                        Arrival window between {moment(quoteDetails?.booking_start_date).format('HH')} -{' '}
                        {moment(quoteDetails?.booking_start_date).add(2, 'hours').format('HH')}
                      </div>
                    </div>

                    <div className='booking-address'>
                      {quoteDetails.delivery_address?.line_1}, {quoteDetails.delivery_address?.town_or_city}
                      <br />
                      {quoteDetails.delivery_address?.county}
                      <br />
                      {quoteDetails.delivery_address?.postcode}
                    </div>
                  </div>
                ) : (
                  <>
                    <TimeSelection
                      timeSlotToParent={timeSlotToParent}
                      liveBooking={false}
                      bookingStartDate={quoteDetails?.booking_start_date}
                    />
                    <LocationSelection
                      key={billingAddress}
                      userBillingAddress={billingAddress}
                      deliveryAddressToParent={deliveryAddressToParent}
                      ids={[
                        {
                          customerId: quoteDetails.customer_id,
                          addressId: quoteDetails.delivery_address.address_id,
                        },
                      ]}
                      deliveryAddressToChild={quoteDetails.delivery_address}
                    />
                  </>
                )}
              </div>
            )}

            <div className='quote-scroll-target-2' id='3'>
              -
            </div>
          </div>
        </div>
      )}
      {/* accept / decline buttons */}
      {quoteDetails?.is_published && (
        <div className='accept-btn-container' id='accept-cont'>
          <button
            className='btn btn-purple-outline mb-3 quote-btn quote-decline'
            onClick={handleDecline}
            id='decline-btn'
          >
            Decline
          </button>
          {quoteDetails.order_state !== OrderState.WON && (
            <button className='btn btn-purple-radius mb-3 quote-btn' onClick={() => handleSnapChange()} id='accept-btn'>
              {acceptBtn}
            </button>
          )}
        </div>
      )}

      <div className='quote-before-after'>
        <BeforeAfter />
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
    </div>
  )
}
