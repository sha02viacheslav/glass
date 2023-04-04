import React, { useEffect, useRef, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import moment from 'moment'
import { useNavigate, useParams } from 'react-router-dom'
import expand from '@glass/assets/icons/expand.png'
import flag from '@glass/assets/icons/uk-flag.png'
import up from '@glass/assets/icons/up.png'
import close from '@glass/assets/icons/x.png'
import { BeforeAfter } from '@glass/components/BeforeAfter'
import { LocationSelection } from '@glass/components/quotePage/LocationSelection'
import { PaymentMethod } from '@glass/components/quotePage/PaymentMethod'
import { PaymentPreview } from '@glass/components/quotePage/PaymentPreview'
import { SlotsPreview } from '@glass/components/quotePage/SlotsPreview'
import { TimeSelection } from '@glass/components/quotePage/TimeSelection'
import { BOOKING_DATE_FORMAT } from '@glass/constants'
import { PaymentOptionEnum, PaymentStatus } from '@glass/enums'
import { CustomerDetail, Invoice, Offer, OptionalOrderLine, PaymentOptionDto, TimeSlot } from '@glass/models'
import '@glass/components/LicensePlate/license-plate.css'
import { addOptionalProductService } from '@glass/services/apis/add-optional-product.service'
import { beginPaymentAssistService } from '@glass/services/apis/begin-payment-assist.service'
import { getQuoteService } from '@glass/services/apis/get-quote.service'
import { preApprovePaymentService } from '@glass/services/apis/pre-approve-payment.service'
import { removeOptionalProductService } from '@glass/services/apis/remove-optional-product.service'
import { sendBookingService } from '@glass/services/apis/send-booking.service'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'
import './quote.css'

export type QuoteProps = {
  quoteCount?: boolean
}

export const Quote: React.FC<QuoteProps> = ({ quoteCount = true }) => {
  // Tabs - controls the different views of the quote page: 0 -> customer, 1 -> pay&book, 3 -> thank you
  const [tabValue] = useState(0)
  const [customerDetails, setCustomerDetails] = useState<CustomerDetail | undefined>(undefined)
  const [snapValue, setSnapValue] = useState(1)
  const [acceptBtn, setAcceptBtn] = useState('Next') // can change to Next
  const [timeSlot, setTimeSlot] = useState<TimeSlot | undefined>(undefined)
  const [quoteInfoOpen, setInfoOpen] = useState(false)
  const [billingAddress, setBillingAddress] = useState('')
  const [, setDeliveryAddress] = useState('')
  const [paymentOption, setPaymentOption] = useState<PaymentOptionDto>({ p_option: PaymentOptionEnum.NONE, detail: '' })
  const [slotSelected, setSlotSelected] = useState(false)
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
  const [payAssistStatus, setPayAssistStatus] = useState('')
  const [invoiceData, setInvoiceData] = useState<Invoice | undefined>(undefined)
  const [PAData, setPAData] = useState<(string | undefined)[]>([])
  const [PAUrl, setPAUrl] = useState<string>('')

  // client info
  const { id } = useParams()
  const getQuote = (qid: string) => {
    getQuoteService(qid, quoteCount).then((res) => {
      if (res.success) {
        setCustomerDetails(res.data)
        setBillingAddress(res.data.customer_order_postal_code)
        if (res.data.order_lines?.length) setOffersDetails(res.data.order_lines)
        setOptionalOrderLines(res.data.optional_order_lines || [])
      }
    })
  }

  const handleSnapChange = (option: string) => {
    // navigate scroll snap
    if (snapValue === 1 && option === 'next' && !timeSlot) {
      // offer to time select if timeslot is not selected
      setSnapValue(2)
      const dom = document.getElementById('2')
      if (dom) dom.scrollIntoView({ behavior: 'smooth' })
    } else if (snapValue === 1 && option === 'next' && !!timeSlot) {
      // offer to location if timeslot is selected
      setSnapValue(3)
      const dom = document.getElementById('3')
      if (dom) dom.scrollIntoView({ behavior: 'smooth' })
    } else if (snapValue === 2 && option === 'next' && !!timeSlot) {
      // time select to location if timeslot is selected
      setSnapValue(3)
      const dom = document.getElementById('3')
      if (dom) dom.scrollIntoView({ behavior: 'smooth' })
    } else if (snapValue === 2 && option === 'next' && !!timeSlot) {
      // scroll snap to time select if no slot selected
      const dom = document.getElementById('2')
      if (dom) dom.scrollIntoView({ behavior: 'smooth' })
      setSlotSelected(true)
    } else if (snapValue === 3 && option === 'next' && !!timeSlot) {
      if (
        invoiceData?.payment_state !== PaymentStatus.PAID &&
        (paymentOption.p_option === PaymentOptionEnum.NONE || paymentOption.detail === 'Select payment method')
      ) {
        // scroll to PM component if no payment method is selected
        setSnapValue(1)
        const dom = document.getElementById('1')
        if (dom) dom.scrollIntoView({ behavior: 'smooth' })
      } else if (
        paymentOption.p_option === PaymentOptionEnum.FOUR_MONTH &&
        paymentOption.detail !== 'Select payment method'
      ) {
        // pay with Payment Assist
        confirmBooking()
      }
    }
  }

  const confirmBooking = () => {
    if (!invoiceData?.invoice_number) return
    let first: string
    let second: string
    let post: string
    let addr: string
    if (PAData.length === 0) {
      first = customerDetails?.customer_f_name || ''
      second = customerDetails?.customer_s_name || ''
      post =
        customerDetails?.customer_order_postal_code.substring(customerDetails.customer_order_postal_code.length - 8) ||
        ''
      addr = customerDetails?.customer_order_postal_code.slice(0, -8) || ''
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
    if (id && invoiceData?.invoice_number) {
      beginPaymentAssistService(id, invoiceData.invoice_number).then((res) => {
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
    const licenseReg = customerDetails?.registration_number
    const i = customerDetails?.customer_name.indexOf(' ') || 0
    const names = [customerDetails?.customer_name.slice(0, i), customerDetails?.customer_name.slice(i + 1)]
    const quoteData = JSON.stringify({
      address: customerDetails?.customer_order_postal_code,
      firstName: names[0],
      lastName: names[1],
      email: customerDetails?.customer_email,
      phone: customerDetails?.customer_phone,
      selected: customerDetails?.glass_location,
    })
    sessionStorage.setItem('quoteInfo', quoteData)
    navigate('/customer/' + licenseReg)
  }

  const timeSlotToParent = (data: TimeSlot) => {
    sendBookingData(data)
    setTimeSlot(data)
    setSlotSelected(false)
  }

  const deliveryAddressToParent = (data: string) => {
    setDeliveryAddress(data)
  }

  const paymentOptionToParent = (pOption: PaymentOptionDto) => {
    setPaymentOption(pOption)
  }

  const payAssistToParent = (status: string) => {
    if (payAssistStatus === '' || payAssistStatus === 'opened-nogo') {
      setPayAssistStatus(status)
    }
    if (status === 'go') {
      PABegin()
    }
  }

  const invDataToParent = (data: Invoice) => {
    setInvoiceData(data)
  }

  const handleCheckOptionalOrderLine = (orderLineId: number, optionalLineId: number, checked: boolean) => {
    if (!id) return
    if (checked) {
      addOptionalProductService(id, optionalLineId).then((res) => {
        if (res.success) {
          getQuote(id)
        }
      })
    } else {
      removeOptionalProductService(id, orderLineId, optionalLineId).then((res) => {
        if (res.success) {
          getQuote(id)
        }
      })
    }
  }

  useEffect(() => {
    // Get Quote Data
    if (id) getQuote(id)

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
    if (customerDetails) {
      setTempLicense(formatLicenseNumber(customerDetails.registration_number))
    }
  }, [customerDetails])

  useEffect(() => {
    // change between accept and next buttons names and styling
    const acceptSelector = document.getElementById('accept-btn')
    if (snapValue === 1 && acceptSelector != null) {
      setAcceptBtn('Next')
      acceptSelector.classList.remove('quote-accept')
    } else if (snapValue === 2 && acceptSelector !== null) {
      setAcceptBtn('Next')
      acceptSelector.classList.remove('quote-accept')
    } else if (snapValue === 3 && acceptSelector !== null && !!timeSlot) {
      if (invoiceData?.payment_state !== PaymentStatus.PAID) {
        if (paymentOption.p_option === PaymentOptionEnum.FOUR_MONTH) {
          // detail coming from payment method
          setAcceptBtn(paymentOption.detail)
        } else {
          setAcceptBtn('Select payment method')
        }
      }
      acceptSelector.classList.add('quote-accept')
    }
  }, [snapValue, timeSlot, paymentOption])

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
                  <div className='client-info'>{customerDetails?.customer_name}</div>
                  <div className='client-info'>
                    <b>Billing address:</b> {customerDetails?.customer_order_postal_code}
                  </div>
                  <div className='client-info'>
                    <b>Email:</b> {customerDetails?.customer_email}
                  </div>
                  <div className='client-info'>
                    <b>Phone number:</b>
                    {customerDetails?.customer_phone}
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
                {!!customerDetails &&
                  customerDetails.glass_location.map((element) => (
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
              <div className='client-info'>{customerDetails?.customer_name}</div>
              <div className='compact-bottom-row'>
                {!!customerDetails &&
                  customerDetails.glass_location.map((element) => (
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
      {offersDetails[0].price_total === 0 && (
        <div className='center'>
          <h2 className='thank-you-header'>Thank you!</h2>
          <h1 className='extra-info'>We are preparing the quote...</h1>
          {/* <img className='working-gif' src="https://media.tenor.com/6rG_OghPUKYAAAAM/so-busy-working.gif" alt="" /> */}
          {!!customerDetails && <PaymentPreview />}
          <SlotsPreview />
        </div>
      )}

      {offersDetails[0].price_total > 1 && (
        <div className='center'>
          {tabValue === 0 && (
            <div className='scroll-container'>
              {/* select offer / payment method */}
              <div id='offer'>
                {!!customerDetails && (
                  <PaymentMethod
                    offerDetails={offersDetails}
                    optionalOrderLines={optionalOrderLines}
                    customerInfo={[
                      {
                        ...customerDetails,
                        c_address: customerDetails.customer_order_postal_code.slice(0, -8),
                        c_postalcode: customerDetails.customer_order_postal_code.substring(
                          customerDetails.customer_order_postal_code.length - 8,
                        ),
                      },
                    ]}
                    qid={id}
                    payAssist={payAssistToParent}
                    invData={invDataToParent}
                    PADataToParent={PADataToParent}
                    PAUrl={PAUrl}
                    method={paymentOptionToParent}
                    onCheckOptionalOrderLine={handleCheckOptionalOrderLine}
                  />
                )}
              </div>
              <br />
              <br />

              <div className='quote-scroll-target' id='2'>
                -
              </div>

              {slotSelected && <div className='quote-scheduler-msg'>Select a time for the repair</div>}
              <div className={slotSelected ? 'quote-scheduler-red' : undefined}>
                <TimeSelection
                  timeSlotToParent={timeSlotToParent}
                  liveBooking={false}
                  bookingStartDate={customerDetails?.booking_start_date}
                />
              </div>

              <div className='quote-scroll-target-2' id='3'>
                -
              </div>

              <div className='quote-component-last'>
                {!!customerDetails && (
                  <LocationSelection
                    key={billingAddress}
                    userBillingAddress={billingAddress}
                    deliveryAddressToParent={deliveryAddressToParent}
                    ids={[
                      {
                        customerId: customerDetails.customer_id,
                        addressId: customerDetails.delivery_address.address_id,
                      },
                    ]}
                    deliveryAddressToChild={customerDetails.delivery_address}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {/* accept / decline buttons */}
      {offersDetails[0].price_total > 1 && tabValue === 0 && (
        <div className='accept-btn-container' id='accept-cont'>
          <button
            className='btn btn-purple-outline mb-3 quote-btn quote-decline'
            onClick={handleDecline}
            id='decline-btn'
          >
            Decline
          </button>
          <button
            className='btn btn-purple-radius mb-3 quote-btn'
            onClick={() => handleSnapChange('next')}
            id='accept-btn'
          >
            {acceptBtn}
          </button>
        </div>
      )}
      {tabValue === 0 && (
        <div className='quote-before-after'>
          <BeforeAfter />
        </div>
      )}

      {/* ---------------- Pay & Book page ---------------- */}

      {/* {tabValue === 1 && <div className='tab-content center'>
                <Payment 
                    clientTime={timeToPayment}
                    clientDate={dateToPayment}
                    clientAddress={billingAddress}
                    qid={id}/>                    
            </div>} */}
    </div>
  )
}

export default Quote
