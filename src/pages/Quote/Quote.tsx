import React, { useState, useRef, useEffect } from 'react'
import Tooltip from '@mui/material/Tooltip'
import axios from 'axios'
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
import { CustomerDetail, Invoice, Offer, PaymentOption, TimeSlot } from '@glass/models'
import '@glass/components/LicensePlate/license-plate.css'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'
import './quote.css'

export const Quote: React.FC = () => {
  // Tabs - controls the different views of the quote page: 0 -> customer, 1 -> pay&book, 3 -> thank you
  const [tabValue] = useState(0)
  const [customerDetails, setCustomerDetails] = useState<CustomerDetail | undefined>(undefined)
  const [snapValue, setSnapValue] = useState(1)
  const [acceptBtn, setAcceptBtn] = useState('Next') // can change to Next
  const [timeSlot, setTimeSlot] = useState<TimeSlot | undefined>(undefined)
  const [quoteInfoOpen, setInfoOpen] = useState(false)
  const [billingAddress, setBillingAddress] = useState('')
  const [, setDeliveryAddress] = useState('')
  const [paymentOption, setPaymentOption] = useState<PaymentOption[]>([{ p_option: 0, detail: '' }])
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
  const [payAssistStatus, setPayAssistStatus] = useState('')
  const [invoiceData, setInvoiceData] = useState<Invoice | undefined>(undefined)
  const [PAData, setPAData] = useState<(string | undefined)[]>([])
  const [PAUrl, setPAUrl] = useState<string>('')

  // client info
  const { id } = useParams()
  const getQuote = (qid: string) => {
    const data = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        fe_token: qid,
      },
    })
    const config = {
      method: 'post',
      url: process.env.REACT_APP_PREVIEW_QUOTE,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    }
    axios(config)
      .then(function (response) {
        setCustomerDetails(response.data.result.data)
        setBillingAddress(response.data.result.data.customer_order_postal_code)
        if (response.data.result.data.order_lines.length !== 0) {
          setOffersDetails(response.data.result.data.order_lines)
        }
      })
      .catch(() => {})
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
      if (paymentOption[0].p_option === 4 || paymentOption[0].detail === 'Select payment method') {
        // scroll to PM component if no payment method is selected
        setSnapValue(1)
        const dom = document.getElementById('1')
        if (dom) dom.scrollIntoView({ behavior: 'smooth' })
      } else if (paymentOption[0].p_option === 1 && paymentOption[0].detail !== 'Select payment method') {
        // pay with Payment Assist
        confirmBooking()
      }
    }
  }

  function confirmBooking() {
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
    const data = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        f_name: first,
        s_name: second,
        addr1: addr,
        postcode: post,
      },
    })
    const config = {
      method: 'post',
      url: process.env.REACT_APP_PAYMENT_ASSIST_PRE,
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.REACT_APP_ODOO_STAGING_KEY,
      },
      data: data,
    }
    axios(config)
      .then(function (response) {
        if (response.data.result.message === 'Success' && response.data.result.result.data.approved) {
          PABegin()
        } else if (response.data.result.message === 'Success' && !response.data.result.result.data.approved) {
        } else {
        }
      })
      .catch(() => {})
  }

  function PABegin() {
    // create payment API call
    const data = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        fe_token: id,
        invoice_number: invoiceData?.invoice_number,
      },
    })
    const config = {
      method: 'post',
      url: process.env.REACT_APP_PAYMENT_ASSIST_BEGIN,
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.REACT_APP_ODOO_STAGING_KEY,
      },
      data: data,
    }
    axios(config)
      .then(function (response) {
        window.open(response.data.result.result.data.url, '_blank', 'noreferrer')
        setPAUrl(response.data.result.result.data.url)
      })
      .catch(() => {})
  }

  const sendBookingData = (selectedSlot: TimeSlot) => {
    const data = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        fe_token: id,
        booking_start_date: moment(selectedSlot.start).format(BOOKING_DATE_FORMAT),
        booking_end_date: moment(selectedSlot.end).format(BOOKING_DATE_FORMAT),
      },
    })
    const config = {
      method: 'post',
      url: process.env.REACT_APP_SEND_BOOKING,
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.REACT_APP_ODOO_STAGING_KEY,
      },
      data: data,
    }
    axios(config)
      .then(() => {
        setIsBlink(true)
      })
      .catch(() => {})
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

  const paymentOptionToParent = (pOption: PaymentOption[]) => {
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

  // useEffect(() => {
  //     if (timeSlot !== '') {
  //         // format timeslot data to send to live booking tab
  //         // data:"2023-01-12 12:00:00"
  //         const dateTime = timeSlot.split(' ');
  //         const dateSplit = dateTime[0].split('-');
  //         const timeSplit = dateTime[1].substring(0, 5);
  //         const timeSplitNext = timeHeaders[timeHeaders.indexOf(timeSplit) + 1];
  //         const date = monthValuesRev[dateSplit[1]].concat(' ', dateSplit[2]).concat(' ', dateSplit[0]);
  //         setDateToPayment(date);
  //         setTimeToPayment(timeSplit.concat('-', timeSplitNext));
  //     }
  // }, [tabValue]);

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
      if (paymentOption[0].p_option === 1) {
        // detail coming from payment method
        setAcceptBtn(paymentOption[0].detail)
      } else {
        setAcceptBtn('Select payment method')
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
