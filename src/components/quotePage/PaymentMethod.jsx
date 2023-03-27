import { useEffect, useRef, useState } from 'react'
import '../../css/payment-method.css'
import Tooltip from '@mui/material/Tooltip'
import axios from 'axios'
import { autocomplete } from 'getaddress-autocomplete'
import Checkout from './Checkout'
import SelectOfferNew from './SelectOfferNew'
import PDFViewer from '../functions/PDFViewer'
import invoice from '../icons/invoice.png'

const monthValuesRev = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'Aug',
  '09': 'Sept',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
}

export default function PaymentMethod({
  offerDetails,
  customerInfo,
  qid,
  payAssist,
  invData,
  PADataToParent,
  PAurl,
  method,
}) {
  const [selectedMethod, setSelectedMethod] = useState(4)
  const [address, setAddress] = useState('')
  const userBillingAddress = customerInfo[0].c_address
  const [postalCode, setPostalCode] = useState(customerInfo[0].c_postalcode)
  const excessRef = useRef('')
  const [excess, setExcess] = useState(115)
  const [singlePay, setSinglePay] = useState('card')
  const [status] = useState('not paid')
  const [invoicePDF, setInvoicePDF] = useState('')
  const [showInvoice, setShowInvoice] = useState(false)
  const [monthlyPayments, setMonthlyPayments] = useState([])
  const [PAErrorMsg] = useState('')
  const [invoiceData, setInvoiceData] = useState([])
  const PAf_nameRef = useRef('')
  const PAs_nameRef = useRef('')
  const PAemailRef = useRef('')
  const [priceTotals, setPriceTotals] = useState([{ total: 0 }])
  const [PAproceed, setPAproceed] = useState(false)
  const [invoiceMessage, setInvoiceMessage] = useState('')
  const [startPAprocess, setStartPAprocess] = useState(false)

  function updateExcess() {
    setExcess(Number(excessRef.current.value))
  }

  const handlePCodeChange = (event) => {
    setAddress(event.target.value)
  }

  function updatePAInfo() {
    const firstName = PAf_nameRef.current.value
    const secondName = PAs_nameRef.current.value
    const email = PAemailRef.current.value
    const data = [firstName, secondName, email, postalCode, address]
    PADataToParent(data)
  }

  function getTotalPrices(data) {
    setPriceTotals(data)
  }

  useEffect(() => {
    // Integration of PostalCode/ Address AutoComplete API
    autocomplete('autocomplete-field', process.env.REACT_APP_AUTOCOMPLETE, {
      delay: 500,
    })
    // Preventing Default to show complete address with Postal Code
    window.addEventListener('getaddress-autocomplete-address-selected', function (e) {
      e.preventDefault()
      let tempAddress = e.address.formatted_address.filter(Boolean).join(', ')
      let postalcode = e.address.postcode
      setAddress(tempAddress)
      setPostalCode(postalcode)
    })
    setAddress(userBillingAddress)
    // update selected payment method in quote page (parent)
    let msg = ''
    if (startPAprocess && PAurl === '') {
      // if user is in check eligibility phase
      msg = 'Check Eligibility'
    } else if (startPAprocess && PAurl !== '') {
      msg = 'Continue Payment Assist'
    } else if (!startPAprocess) {
      msg = 'Select payment method'
    }
    method([{ p_option: selectedMethod, detail: msg }])
  }, [selectedMethod, startPAprocess, PAurl])

  function retrieveInvoice() {
    // get url of invoice PDF
    let data = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        fe_token: qid,
      },
    })
    let config = {
      method: 'post',
      url: process.env.REACT_APP_GET_INVOICE_PDF,
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.REACT_APP_ODOO_STAGING_KEY,
      },
      data: data,
    }
    axios(config)
      .then(function (response) {
        // figure out how to view pdf
        if (response.data.result.data.invoice_pdf_url !== '') {
          setInvoicePDF(response.data.result.data.invoice_pdf_url)
          setShowInvoice(true)
          setInvoiceMessage('')
        } else {
          setInvoiceMessage('Invoice can be created after booking is confirmed')
        }
      })
      .catch(() => {
        setShowInvoice(false)
      })
  }

  function handleInvoicePopup(status) {
    setShowInvoice(status)
  }

  function getInvoiceData() {
    let data = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        fe_token: qid,
      },
    })
    let config = {
      method: 'post',
      url: process.env.REACT_APP_GET_INVOICE,
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.REACT_APP_ODOO_STAGING_KEY,
      },
      data: data,
    }
    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response));
        setInvoiceData(response.data.result.data)
        invData(response.data.result.data)
      })
      .catch(() => {})
  }

  function checkEligibility() {
    // communicate with Payment (parent)
    payAssist('go')
  }

  useEffect(() => {
    // get invoice data for payment
    getInvoiceData()
  }, [])

  function retrievePlan() {
    if (selectedMethod === 1) {
      // retrieve payment assist plan data
      let data = JSON.stringify({
        jsonrpc: '2.0',
        params: {
          fe_token: qid,
        },
      })
      let config = {
        method: 'post',
        url: process.env.REACT_APP_PAYMENT_ASSIST_PLAN,
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.REACT_APP_ODOO_STAGING_KEY,
        },
        data: data,
      }
      axios(config)
        .then(function (response) {
          setMonthlyPayments(response.data.result.result.data)
        })
        .catch(() => {})
    }
  }

  useEffect(() => {
    if (selectedMethod === 1 && !PAproceed) {
      // retrieve payment assist plan data
      let data = JSON.stringify({
        jsonrpc: '2.0',
        params: {
          fe_token: qid,
        },
      })
      let config = {
        method: 'post',
        url: process.env.REACT_APP_INVOICE_CONFIRM,
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.REACT_APP_ODOO_STAGING_KEY,
        },
        data: data,
      }
      axios(config)
        .then(() => {
          setPAproceed(true)
          retrievePlan()
          getInvoiceData()
        })
        .catch(() => {})
    }
  }, [selectedMethod])

  return (
    <div className='center'>
      {showInvoice === true && (
        <PDFViewer
          invoicePDF={invoicePDF}
          isOpen={handleInvoicePopup}
          qid={qid}
          invoiceID={invoiceData.invoice_number}
        />
      )}
      <div className='payment-method'>
        <Tooltip disableFocusListener title='Invoice'>
          <img className='PM-invoice' onClick={retrieveInvoice} src={invoice} alt='' />
        </Tooltip>
        <h3 className='text-24 text-blue PM-header'>Quotation</h3>
        <div className='PM-invoice-status'>{invoiceMessage}</div>
        <div className='PM-status'>Status: {status}</div>
        {/* show quotation price details */}
        <SelectOfferNew selectOfferToCustomer={offerDetails} priceToParent={getTotalPrices} />
        <div className='PM-btn-container'>
          <button
            className={selectedMethod === 1 ? 'PM-button-active' : 'PM-button'}
            onClick={() => setSelectedMethod(1)}
          >
            <small className='fs-14'>4 month</small>
            <div className='PM-price'>£ {(priceTotals[0].total / 4).toFixed(2)}</div>
          </button>
          <button
            className={selectedMethod === 2 ? 'PM-button-active' : 'PM-button'}
            onClick={() => setSelectedMethod(2)}
          >
            <small className='fs-14'>Insurance</small>
            <div className='PM-price'>£ {priceTotals[0].total}</div>
          </button>
          <button
            className={selectedMethod === 3 ? 'PM-button-active' : 'PM-button'}
            onClick={() => setSelectedMethod(3)}
          >
            <small className='fs-14'>Single pay</small>
            <div className='PM-price'>£ {priceTotals[0].total}</div>
          </button>
        </div>

        <div className='PM-payment-option'>
          {selectedMethod === 1 && (
            <div>
              <p className='text-purple mb-2'>4-Month</p>
              {monthlyPayments.length !== 0 && (
                <div>
                  <p>{monthlyPayments.summary}</p>
                  <div className='PA-plan-container'>
                    {monthlyPayments.schedule.map((element) => (
                      <div className='PA-plan-element' key={element.date}>
                        <div className='PA-plan-date'>
                          {/* {element.date} */}
                          {element.date.slice(8, 10) +
                            ' ' +
                            monthValuesRev[element.date.slice(5, 7)] +
                            ' ' +
                            element.date.slice(0, 4)}
                        </div>
                        <div className='PA-plan-price'>£ {(element.amount / 100).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className='PA-status-failed'>{PAErrorMsg}</div>
              {startPAprocess && (
                <div className='PM-insurance-container'>
                  <div className='PM-insurance-sub'>
                    <input
                      type='text'
                      className='form-control PM-top-input'
                      ref={PAf_nameRef}
                      defaultValue={customerInfo[0].f_name}
                      onChange={updatePAInfo}
                    />
                    <input
                      type='text'
                      className='form-control PM-top-input'
                      ref={PAs_nameRef}
                      defaultValue={customerInfo[0].s_name}
                      onChange={updatePAInfo}
                    />
                  </div>
                  <input
                    type='text'
                    className='form-control PM-email'
                    defaultValue={customerInfo[0].email}
                    ref={PAemailRef}
                    onChange={updatePAInfo}
                  />
                  <input
                    id='autocomplete-field'
                    type='text'
                    className='form-control PM-address'
                    onChange={handlePCodeChange}
                    defaultValue={address}
                    value={address}
                  />
                  <input
                    type='text'
                    className='form-control PM-postalcode'
                    defaultValue={postalCode}
                    onChange={updatePAInfo}
                  />
                </div>
              )}
              <div className='PM-proceed-btn-cont'>
                {startPAprocess && PAurl === '' && (
                  <button className='PM-proceed-btn' onClick={checkEligibility}>
                    Check Eligibility
                  </button>
                )}
                {startPAprocess && PAurl !== '' && (
                  <a className='PA-link' href={PAurl}>
                    {PAurl}
                  </a>
                )}
                {startPAprocess && PAurl !== '' && (
                  <button className='PM-proceed-btn' onClick={checkEligibility}>
                    Continue
                  </button>
                )}
                {!startPAprocess && (
                  <button className='PM-proceed-btn' onClick={() => setStartPAprocess(true)}>
                    Pay with Payment Assist
                  </button>
                )}
              </div>
            </div>
          )}
          {selectedMethod === 2 && (
            <div>
              <p className='text-purple mb-2'>Insurance</p>
              <div className='PM-insurance-container'>
                <div className='PM-insurance-sub'>
                  <input type='text' className='form-control PM-top-input' placeholder='Insurance Number' />
                  <input
                    type='text'
                    className='form-control PM-top-input'
                    defaultValue={customerInfo[0].f_name + ' ' + customerInfo[0].s_name}
                  />
                </div>
                <div className='PM-insurance-sub'>
                  <input type='text' className='form-control PM-insurance-input' placeholder='Insurance provider' />
                  <input
                    type='text'
                    className='form-control PM-insurance-date'
                    placeholder='Date of damage (dd-mm-yyyy)'
                  />
                </div>
                <input
                  id='autocomplete-field'
                  type='text'
                  className='form-control PM-address'
                  onChange={handlePCodeChange}
                  defaultValue={address}
                  value={address}
                />
                <div className='PM-insurance-sub'>
                  <div className='PM-excess-cont'>
                    <span>Excess: </span>
                    <span> £</span>
                    <input
                      ref={excessRef}
                      type='text'
                      className='form-control'
                      defaultValue={excess}
                      onChange={updateExcess}
                    />
                  </div>
                  <div className='PM-insurace-doc-cont'>
                    <button>Choose</button>
                    <span>Upload insurance policy</span>
                  </div>
                </div>
              </div>
              <div className='PM-insurance-btn-cont'>
                <button className='PM-proceed-btn'>Excess Card Pay</button>
                <button className='PM-proceed-btn'>Excess Cash Pay</button>
              </div>
            </div>
          )}
          {selectedMethod === 3 && (
            <div>
              <div className='PM-insurance-container'>
                <div className='PM-single-pay'>
                  <button
                    className={`pm-proceed-btn card-btn ${singlePay === 'card' ? 'pm-proceed-selected' : ''}`}
                    onClick={() => setSinglePay('card')}
                  >
                    <div className='position-relative w-100'>
                      <svg
                        className='p-Icon p-Icon--card Icon p-Icon--md p-TabIcon TabIcon'
                        role='presentation'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 16 16'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M0 4a2 2 0 012-2h12a2 2 0 012 2H0zm0 2v6a2 2 0 002 2h12a2 2 0 002-2V6H0zm3 5a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1z'
                        ></path>
                      </svg>
                    </div>
                    <span>Card</span>
                  </button>
                  <button
                    className={`pm-proceed-btn ${singlePay === 'cash' ? 'pm-proceed-selected' : ''}`}
                    onClick={() => setSinglePay('cash')}
                  >
                    <div className='position-relative w-100'>
                      <div className='p-TabIconContainer'>
                        <svg
                          width='16'
                          height='16'
                          viewBox='0 0 16 16'
                          fill='none'
                          className='p-Logo p-Logo--md p-TabIcon TabIcon'
                        >
                          <path
                            d='M12 0H4C1.79086 0 0 1.79086 0 4V12C0 14.2091 1.79086 16 4 16H12C14.2091 16 16 14.2091 16 12V4C16 1.79086 14.2091 0 12 0Z'
                            fill='url(#paint0_linear_867_1617)'
                          ></path>
                          <path
                            d='M8.40681 5.29776C9.17683 5.30047 9.92125 5.57452 10.5092 6.07176C10.5702 6.12709 10.65 6.15704 10.7323 6.15548C10.8146 6.15391 10.8932 6.12096 10.952 6.06336L11.552 5.45376C11.5824 5.42361 11.6063 5.38748 11.6221 5.34766C11.6379 5.30784 11.6453 5.26517 11.6439 5.22235C11.6424 5.17953 11.6321 5.13748 11.6136 5.09883C11.5951 5.06018 11.5688 5.02577 11.5364 4.99776C11.0614 4.59384 10.5124 4.28613 9.92001 4.09176L10.1096 3.19536C10.1191 3.14944 10.1182 3.102 10.107 3.05647C10.0958 3.01094 10.0746 2.96848 10.045 2.93216C10.0153 2.89585 9.97793 2.8666 9.93556 2.84653C9.8932 2.82647 9.84689 2.81609 9.80001 2.81616H8.62881C8.55631 2.81611 8.48597 2.84082 8.42945 2.88622C8.37292 2.93161 8.3336 2.99496 8.31801 3.06576L8.14761 3.86256C6.58761 3.93936 5.26761 4.70976 5.26761 6.28896C5.26761 7.65576 6.35841 8.24136 7.51161 8.64696C8.60241 9.05256 9.17841 9.20256 9.17841 9.77376C9.17841 10.345 8.60241 10.705 7.75401 10.705C6.93031 10.718 6.13457 10.4063 5.53881 9.83736C5.47942 9.77946 5.39976 9.74705 5.31681 9.74705C5.23386 9.74705 5.1542 9.77946 5.09481 9.83736L4.44321 10.4734C4.41283 10.5027 4.38867 10.5378 4.37217 10.5767C4.35567 10.6156 4.34717 10.6573 4.34717 10.6996C4.34717 10.7418 4.35567 10.7836 4.37217 10.8224C4.38867 10.8613 4.41283 10.8964 4.44321 10.9258C4.97338 11.4259 5.62149 11.7839 6.32721 11.9662L6.15201 12.8002C6.14253 12.8465 6.14331 12.8943 6.1543 12.9403C6.16528 12.9863 6.18621 13.0294 6.2156 13.0664C6.24499 13.1035 6.28213 13.1337 6.32442 13.1548C6.36672 13.176 6.41313 13.1876 6.46041 13.189H7.64001C7.71297 13.1898 7.78399 13.1654 7.84105 13.1199C7.89812 13.0745 7.93773 13.0107 7.95321 12.9394L8.12241 12.1402C9.98601 12.0202 11.1224 11.023 11.1224 9.55296C11.1224 8.20176 9.98481 7.63296 8.60241 7.16496C7.81401 6.87936 7.13241 6.68496 7.13241 6.09816C7.13241 5.51136 7.76961 5.29776 8.40681 5.29776Z'
                            fill='white'
                          ></path>
                          <defs>
                            <linearGradient
                              id='paint0_linear_867_1617'
                              x1='0'
                              y1='8'
                              x2='16'
                              y2='8'
                              gradientUnits='userSpaceOnUse'
                            >
                              <stop stopColor='#00C244'></stop>
                              <stop offset='1' stopColor='#00D64B'></stop>
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    <span>Cash</span>
                  </button>
                </div>
              </div>
              <Checkout method={singlePay} amount={priceTotals[0].total} />
            </div>
          )}
          {selectedMethod === 4 && <div className='transparent-element'>-</div>}
        </div>
      </div>
    </div>
  )
}
