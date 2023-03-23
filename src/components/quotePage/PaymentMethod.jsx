import { useEffect, useRef, useState } from 'react';
import '../../css/payment-method.css';
import {autocomplete} from 'getaddress-autocomplete';
import invoice from '../icons/invoice.png';
import axios from 'axios';
import PDFViewer from '../functions/PDFViewer';
import SelectOfferNew from './SelectOfferNew';

import Checkout from './Checkout';
import Tooltip from '@mui/material/Tooltip';

export default function PaymentMethod({offerDetails, customerInfo, qid, payAssist, invData, PADataToParent}) {

    const [selectedMethod, setSelectedMethod] = useState(4);
    const [address, setAddress] = useState('');
    const userBillingAddress = customerInfo[0].c_address;
    const [postalCode, setPostalCode]= useState(customerInfo[0].c_postalcode);
    const excessRef = useRef('');
    const [excess, setExcess] = useState(115);
    const [singlePay, setSinglePay] = useState('card');
    const [status, setStatus] = useState('not paid');
    const [invoicePDF, setInvoicePDF] = useState('');
    const [showInvoice, setShowInvoice] = useState(false);
    const [monthlyPayments, setMonthlyPayments] = useState([]);
    const [PAErrorMsg, setPAErrorMsg] = useState('');
    const [invoiceData, setInvoiceData] = useState([]);
    const PAf_nameRef = useRef('');
    const PAs_nameRef = useRef('');
    const PAemailRef = useRef('');
    const [priceTotals, setPriceTotals] = useState([{total: 0}]);
    const [PAproceed, setPAproceed] = useState(false);
    const [invoiceMessage, setInvoiceMessage] = useState('');
    const [startPAprocess, setStartPAprocess] = useState(false);

    function updateExcess() {
        setExcess(Number(excessRef.current.value));
    }

    const handlePCodeChange = (event) => {
        setAddress(event.target.value);
    }

    function updatePAInfo() {
        const firstName = PAf_nameRef.current.value;
        const secondName = PAs_nameRef.current.value;
        const email = PAemailRef.current.value;
        const data = [firstName, secondName, email, postalCode, address];
        PADataToParent(data);
    }

    function getTotalPrices(data) {
        setPriceTotals(data);
    }

    useEffect(() => {
        // Integration of PostalCode/ Address AutoComplete API
        autocomplete("autocomplete-field", process.env.REACT_APP_AUTOCOMPLETE, { 
            delay: 500,
        });
        // Preventing Default to show complete address with Postal Code
        window.addEventListener("getaddress-autocomplete-address-selected", function(e){
            e.preventDefault();
            let tempAddress = e.address.formatted_address.filter(Boolean).join(", ");
            let postalcode = e.address.postcode;
            setAddress(tempAddress);
            console.log(postalcode);
            setPostalCode(postalcode);
        });
        setAddress(userBillingAddress);
        // console.log("Address found at useEffect"+userBillingAddress);
    }, [selectedMethod]);  
    // console.log(postalCode);

    function retrieveInvoice() {
        // get url of invoice PDF
        let data = JSON.stringify({
            "jsonrpc": "2.0",
            "params": {
                "fe_token": qid
            }
        });
        let config = {
            method: 'post',
            url: process.env.REACT_APP_GET_INVOICE_PDF,
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.REACT_APP_ODOO_STAGING_KEY
            },
            data: data
        };
        axios(config)
        .then(function (response) {
            // figure out how to view pdf
            console.log(JSON.stringify(response));
            if (response.data.result.data.invoice_pdf_url !== '') {
                setInvoicePDF(response.data.result.data.invoice_pdf_url);
                setShowInvoice(true);
                setInvoiceMessage('');
            } else {
                setInvoiceMessage('Invoice can be created after booking is confirmed');
            }
        })
        .catch(function (error) {
            console.log(error);
            setShowInvoice(false);  
        })
    }

    function handleInvoicePopup(status) {
        setShowInvoice(status);
    }

    function getInvoiceData() {
        let data = JSON.stringify({
            "jsonrpc": "2.0",
            "params": {
                "fe_token": qid
            }
        });
        let config = {
            method: 'post',
            url: process.env.REACT_APP_GET_INVOICE,
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.REACT_APP_ODOO_STAGING_KEY
            },
            data: data
        };
        axios(config)
        .then(function (response) {
            // console.log(JSON.stringify(response));
            setInvoiceData(response.data.result.data);
            invData(response.data.result.data);
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    useEffect(() => {
        // communicate with Payment (parent)
        payAssist('opened-nogo');
        // get invoice data for payment
        getInvoiceData();
    }, []);

    function retrievePlan() {
        if (selectedMethod === 1) {
            // retrieve payment assist plan data
            let data = JSON.stringify({
                "jsonrpc": "2.0",
                "params": {
                    "fe_token": qid
                }
            });
            let config = {
                method: 'post',
                url: process.env.REACT_APP_PAYMENT_ASSIST_PLAN,
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.REACT_APP_ODOO_STAGING_KEY
                },
                data: data
            };
            axios(config)
            .then(function (response) {
                // console.log(JSON.stringify(response));
                setMonthlyPayments(response.data.result.result.data);
            })
            .catch(function (error) {
                console.log(error);
            })
        }
    }

    useEffect(() => {
        if (selectedMethod === 1 && !PAproceed) {
            // retrieve payment assist plan data
            let data = JSON.stringify({
                "jsonrpc": "2.0",
                "params": {
                    "fe_token": qid
                }
            });
            let config = {
                method: 'post',
                url: process.env.REACT_APP_INVOICE_CONFIRM,
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.REACT_APP_ODOO_STAGING_KEY
                },
                data: data
            };
            axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response));
                setPAproceed(true);
                retrievePlan();
                getInvoiceData();
            })
            .catch(function (error) {
                console.log(error);
            })
        }
    }, [selectedMethod]);

    return (
        <div className='center'>
                { showInvoice === true && <PDFViewer
                    invoicePDF={invoicePDF}
                    isOpen={handleInvoicePopup}
                    qid={qid}
                    invoiceID={invoiceData.invoice_number}
                /> }
                <div className='payment-method'>
                    <Tooltip disableFocusListener title='Invoice'>
                        <img className='PM-invoice' onClick={retrieveInvoice} src={invoice} alt="" />
                    </Tooltip>
                    <h3 className="text-24 text-blue PM-header">Quotation</h3>
                    <div className='PM-invoice-status'>{invoiceMessage}</div>
                    <div className='PM-status'>Status: {status}</div>
                    {/* show quotation price details */}
                    <SelectOfferNew 
                        selectOfferToCustomer={offerDetails}
                        priceToParent={getTotalPrices}
                    />
                    <div className='PM-btn-container'>
                        <button className={selectedMethod === 1 ? 'PM-button-active' : 'PM-button'} onClick={() => setSelectedMethod(1)}>
                            <small className="fs-14">4 month</small>
                            <div className='PM-price'>£ {(priceTotals[0].total/4).toFixed(2)}</div>
                        </button>
                        <button className={selectedMethod === 2 ? 'PM-button-active' : 'PM-button'} onClick={() => setSelectedMethod(2)}>
                            <small className="fs-14">Insurance</small>
                            <div className='PM-price'>£ {priceTotals[0].total}</div>
                        </button>
                        <button className={selectedMethod === 3 ? 'PM-button-active' : 'PM-button'} onClick={() => setSelectedMethod(3)}>
                            <small className="fs-14">Single pay</small>
                            <div className='PM-price'>£ {priceTotals[0].total}</div>
                        </button>
                    </div>

                <div className='PM-payment-option'>
                    {selectedMethod === 1 && <div>
                        <p className="text-purple mb-2">4-Month</p>
                        {monthlyPayments.length !== 0 && <div>
                            <p>{monthlyPayments.summary}</p>
                            <div className='PA-plan-container'>
                                {monthlyPayments.schedule.map(element => 
                                    <div className='PA-plan-element' key={element.date}>
                                        <div className='PA-plan-date'>
                                            {element.date}
                                        </div>
                                        <div className='PA-plan-price'>
                                            £ {(element.amount / 100).toFixed(2)}
                                        </div>
                                    </div>  
                                )}
                            </div>
                        </div>}
                        <div className='PA-status-failed'>
                            {PAErrorMsg}
                        </div>
                        {startPAprocess && <div className='PM-insurance-container'>
                            <div className="PM-insurance-sub">
                                <input type="text" 
                                    className='form-control PM-top-input'
                                    ref={PAf_nameRef}
                                    defaultValue={customerInfo[0].f_name}
                                    onChange={updatePAInfo}/>
                                <input type="text" 
                                    className='form-control PM-top-input'
                                    ref={PAs_nameRef}
                                    defaultValue={customerInfo[0].s_name}
                                    onChange={updatePAInfo}/>
                            </div>
                            <input type="text" 
                                className='form-control PM-email'
                                defaultValue={customerInfo[0].email}
                                ref={PAemailRef}
                                onChange={updatePAInfo}/>
                            <input 
                                id="autocomplete-field" 
                                type='text'
                                className='form-control PM-address'
                                onChange={handlePCodeChange}
                                defaultValue={address}
                                value={address} /> 
                            <input type="text" 
                                className='form-control PM-postalcode'
                                defaultValue={postalCode}
                                onChange={updatePAInfo}/>
                        </div>}   
                        <div className='PM-proceed-btn-cont'>
                            {!startPAprocess && <button className='PM-proceed-btn' onClick={() => setStartPAprocess(true)}>
                                Pay with Payment Assist
                            </button>}
                        </div>
                    </div>}
                    {selectedMethod === 2 && <div>
                        <p className="text-purple mb-2">Insurance</p>
                        <div className='PM-insurance-container'>
                            <div className="PM-insurance-sub">
                                <input type="text" 
                                    className='form-control PM-top-input'
                                    placeholder='Insurance Number'/>
                                <input type="text" 
                                    className='form-control PM-top-input'
                                    defaultValue={customerInfo[0].f_name + ' ' + customerInfo[0].s_name}/>
                            </div>
                            <div className="PM-insurance-sub">
                                <input type="text" 
                                    className='form-control PM-insurance-input'
                                    placeholder='Insurance provider'/>
                                <input type="text" 
                                    className='form-control PM-insurance-date'
                                    placeholder='Date of damage (dd-mm-yyyy)'/>
                            </div>
                            <input 
                                id="autocomplete-field" 
                                type='text'
                                className='form-control PM-address'
                                onChange={handlePCodeChange}
                                defaultValue={address}
                                value={address} /> 
                            <div className='PM-excess-cont'>
                                <span>Excess: </span>
                                <span> £</span>
                                <input ref={excessRef} type="text" 
                                    className='form-control'
                                    defaultValue={excess}
                                    onChange={updateExcess}/>
                            </div>
                        </div>     
                    </div>} 
                    {selectedMethod === 3 && <div>
                        <p className="text-purple mb-2">Single pay</p>
                        <div className='PM-insurance-container'>
                            <div className='PM-single-pay'>
                                <button className={singlePay === 'card' ? 'PM-proceed-active' : "PM-proceed-btn"} 
                                    onClick={() => setSinglePay('card')}>
                                    Pay with card
                                </button>
                                <button className={singlePay === 'cash' ? 'PM-proceed-active' : "PM-proceed-btn"} 
                                    onClick={() => setSinglePay('cash')}>
                                    Pay in cash
                                </button>
                            </div>
                        </div>
                        <Checkout method={singlePay} amount={priceTotals[0].total} />
                    </div>}   
                    {selectedMethod === 4 && <div className='transparent-element'>
                        -
                    </div> }                    
                </div>
                </div>
        </div>
    )
}