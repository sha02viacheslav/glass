import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import user from '@glass/assets/assets/icons/user.png'
import close from '@glass/assets/components/icons/x.png'
import { LocationSelection } from '@glass/components/quotePage/LocationSelection'
import { PayBookTimeline } from '@glass/components/quotePage/PayBookTimeline'
import { PaymentMethod } from '@glass/components/quotePage/PaymentMethod'
import { TimeSelection } from '@glass/components/quotePage/TimeSelection'
import './payment.css'
import { Invoice } from '@glass/models'

export type PaymentProps = {
  clientTime: string
  clientDate: string
  clientAddress: string
  qid: string
}

export const Payment: React.FC<PaymentProps> = ({ clientTime, clientDate, clientAddress, qid }) => {
  const [pastSlots, setPastSlots] = useState<string[]>(JSON.parse(sessionStorage.getItem('pastSlots') || '[]'))
  const [pastLocs] = useState<string[]>(JSON.parse(sessionStorage.getItem('pastLocs') || '[]'))
  const [isOpen, setIsOpen] = useState(false)
  const [isRetrieved, setIsRetrieved] = useState(true)
  const [today, setToday] = useState('')
  const [componentDisplay, setComponentDisplay] = useState('')
  const [billingAddress] = useState('')
  const [, setDeliveryAddress] = useState('')
  const [, setInvoiceData] = useState<Invoice | undefined>(undefined)
  const [payAssistStatus, setPayAssistStatus] = useState('')

  const handleChangeSlotId = (slotData: string) => {
    pastSlots.push(slotData)
    setPastSlots(pastSlots.slice())
  }

  const deliveryAddressToParent = (data: string) => {
    setDeliveryAddress(data)
  }

  const openPopup = (compValue: string) => {
    setComponentDisplay(compValue)
    setIsOpen(true)
  }

  const closePopup = () => {
    setIsOpen(false)
    setComponentDisplay('')
  }

  const payAssistToParent = (status: string) => {
    if (payAssistStatus === '' || payAssistStatus === 'opened-nogo') {
      setPayAssistStatus(status)
    }
  }

  const pay = () => {
    if (payAssistStatus === 'go') {
      // create payment API call
      const data = JSON.stringify({
        jsonrpc: '2.0',
        params: {
          fe_token: 'ff74f4',
          invoice_number: 'STAGINV/2023/02043',
          // "fe_token": qid,
          // "invoice_number": invoiceData.invoice_number
        },
      })
      const config = {
        method: 'post',
        url: process.env.REACT_APP_PAYMENT_ASSIST_BEGIN,
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.REACT_APP_API_KEY,
        },
        data: data,
      }
      axios(config)
        .then(function (response) {
          window.open(response.data.result.result.data.url, '_blank', 'noreferrer')
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      return
    }
  }

  useEffect(() => {
    // for correctly displaying the current date in case Live Booking is in the preview state (!isRetrieved)
    setToday(moment().format('MMM DD YYYY'))
    // get invoice data for payment
    const data = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        fe_token: qid,
      },
    })
    const config = {
      method: 'post',
      url: process.env.REACT_APP_GET_INVOICE,
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.REACT_APP_API_KEY,
      },
      data: data,
    }
    axios(config)
      .then(function (response) {
        setInvoiceData(response.data.result.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return (
    <div className='pay-main-container'>
      {isOpen && (
        <div className='popup-background'>
          <div className='popup-container'>
            <div className='popup-close-container'>
              <img className='popup-close' src={close} alt='' onClick={closePopup} />
            </div>

            {componentDisplay === 'time' && (
              <TimeSelection
                onChangeSlotId={handleChangeSlotId}
                liveBooking={false}
                bookingStartDate={'2023-01-12 12:00:00'}
              />
            )}

            {componentDisplay === 'loc' && (
              <LocationSelection
                userBillingAddress={billingAddress}
                deliveryAddressToParent={deliveryAddressToParent}
              />
            )}

            <div className='popup-btn-container'>
              <button className='btn btn-purple-outline mb-3' onClick={closePopup}>
                Close
              </button>
              <button className='btn btn-purple-radius mb-3' onClick={closePopup}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className='pay-top-container'>
          <div className='pay-left-container'>
            <ul className='list-inline d-flex align-items-center'>
              <li className='list-item-inline'>
                {isRetrieved && (
                  <img src={process.env.PUBLIC_URL + '/img/avat.svg'} className='img-fluid me-3' alt='' />
                )}
                {!isRetrieved && <img src={user} className='img-fluid me-3 pay-user' alt='' />}
              </li>
              <li className='list-item-inline'>
                <span className='fs-18 d-block text-purple'>Technician</span>
                {isRetrieved && <p className='mb-0'>Arvin Kuldner</p>}
              </li>
            </ul>
            {isRetrieved &&
              [...new Set(pastLocs)].slice(0, -1).map((element, index) => (
                <div key={index} className='pay-old-container-right'>
                  {element}
                </div>
              ))}
          </div>
          <div className='pay-right-container'>
            {isRetrieved &&
              pastSlots.slice(0, -1).map((element, index) => (
                <div key={index} className='pay-old-container-right'>
                  {element}
                </div>
              ))}
            <div className={!isRetrieved ? 'dis-info-frame' : 'pay-info-frame'}>
              <div className='pay-frame-inner'>
                {isRetrieved && <h5 className='text-blue'>{clientDate !== '' ? clientDate : 'Date'}</h5>}
                {!isRetrieved && <h5 className='text-blue'>{today}</h5>}
                {isRetrieved && (
                  <div className='pay-booking-info'>Arriving between {clientTime !== '' ? clientTime : ''}</div>
                )}
              </div>
              <a href='#'>
                <span className='text-purple fs-14 fw-normal float-end' onClick={() => openPopup('time')}>
                  EDIT
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className={!isRetrieved ? 'dis-loc-frame' : 'frame mb-5'}>
          <div className='date-address-container'>
            <h5 className='date-address-header'>{clientAddress !== '' ? clientAddress : 'Billing address'}</h5>
            <a href='#'>
              <span className='text-purple fs-14 fw-normal float-end' onClick={() => openPopup('loc')}>
                EDIT
              </span>
            </a>
          </div>
          {/* <p className="mb-0 fs-14">{pastLocs[pastLocs.length - 1]} </p> */}
          {isRetrieved && (
            <p className='mb-0 fs-14'>
              Arriving between <span className='fw-500'> {clientTime !== '' ? clientTime : ''}</span>{' '}
            </p>
          )}

          <div
            id='map-container-google-1'
            className='z-depth-1-half map-container mt-4'
            style={{ height: '400px', width: '100%' }}
          >
            <iframe
              src='https://maps.google.com/maps?q=manhatan&t=&z=13&ie=UTF8&iwloc=&output=embed'
              width='100%'
              height='100%'
              frameBorder='0'
              style={{ border: 0 }}
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <button onClick={() => setIsRetrieved(!isRetrieved)}>switch</button>
        <PayBookTimeline />
        <PaymentMethod qid={qid} payAssist={payAssistToParent} />
        <br />
        <br />
        <div className='payment-btn-container'>
          <button className='btn btn-purple-outline mb-3 quote-btn quote-decline'>Decline</button>
          <button className='btn btn-purple-radius mb-3 quote-btn quote-accept' onClick={pay}>
            Pay
          </button>
        </div>
      </div>
    </div>
  )
}
