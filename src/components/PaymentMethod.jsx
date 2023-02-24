import { useEffect, useRef, useState } from 'react';
import '../css/payment-method.css';
import {autocomplete} from 'getaddress-autocomplete';
import invoice from './icons/invoice.png';
import axios from 'axios';

export default function PaymentMethod({selectedPrice, billingAddress, name, email, qid}) {

    const [selectedMethod, setSelectedMethod] = useState(2);
    const [address, setAddress] = useState('');
    const userBillingAddress = '{address from parent}';
    const excessRef = useRef('');
    const [excess, setExcess] = useState(115);
    const [singlePay, setSinglePay] = useState('card');
    const [status, setStatus] = useState('not paid');

    function updateExcess() {
        setExcess(Number(excessRef.current.value));
    }

    const handlePCodeChange = (event) => {
        setAddress(event.target.value);
    }

    useEffect(() => {
        // Integration of PostalCode/ Address AutoComplete API
        autocomplete("autocomplete-field","SFB4ZD1fO0ONndTgHnmUmg26020", { 
            delay: 500,
        });

        // Preventing Default to show complete address with Postal Code
        window.addEventListener("getaddress-autocomplete-address-selected", function(e){
            e.preventDefault();
            let tempAddress = e.address.formatted_address.filter(Boolean).join(", ")+" "+e.address.postcode;
            setAddress(tempAddress);
        });

        setAddress(userBillingAddress);
        // console.log("Address found at useEffect"+userBillingAddress);
    }, [selectedMethod]);  

    function retrieveInvoice() {
        let data = JSON.stringify({
            "jsonrpc": "2.0",
            "params": {
                "fe_token": qid
            }
        });
        let config = {
            method: 'post',
            url: 'https://fixglass-staging-2-7305738.dev.odoo.com/api/v1/react/invoice/get_pdf',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios(config)
        .then(function (response) {
            // figure out how to view pdf
            console.log(JSON.stringify(response));
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    return (
        <div className='center'>
            <div className='payment-method'>
                <img className='PM-invoice' onClick={retrieveInvoice} src={invoice} alt="" />
            <h3 className="text-24 text-blue PM-header">Payment method</h3>
            <div className='PM-status'>Status: {status}</div>
            <div className='PM-btn-container'>
                <button className={selectedMethod === 1 ? 'PM-button-active' : 'PM-button'} onClick={() => setSelectedMethod(1)}>
                    <small className="fs-14">4 month</small>
                    <h5 className='PM-price'>£ {(selectedPrice/4).toFixed(2)}</h5>
                </button>
                <button className={selectedMethod === 2 ? 'PM-button-active' : 'PM-button'} onClick={() => setSelectedMethod(2)}>
                    <small className="fs-14">Insurance</small>
                    <h5 className='PM-price'>£ {excess}</h5>
                </button>
                <button className={selectedMethod === 3 ? 'PM-button-active' : 'PM-button'} onClick={() => setSelectedMethod(3)}>
                    <small className="fs-14">Single pay</small>
                    <h5 className='PM-price'>£ {selectedPrice}</h5>
                </button>
            </div>

            <div className='PM-payment-option'>
                {selectedMethod === 1 && <div>
                    <p className="text-purple mb-2">4-Month</p>
                    <div className='PM-insurance-container'>
                        <div className="PM-insurance-sub">
                            <input type="text" 
                                className='form-control PM-top-input'
                                defaultValue='{John Green}'/>
                            <input type="text" 
                                className='form-control PM-top-input'
                                defaultValue='{client phone number}'/>
                        </div>
                        <input type="text" 
                            className='form-control PM-email'
                            defaultValue='{client email}'/>
                        <input 
                            id="autocomplete-field" 
                            type='text'
                            className='form-control PM-address'
                            onChange={handlePCodeChange}
                            defaultValue={address}
                            value={address} /> 
                        <div className='PM-proceed-btn-cont'>
                            <button className="PM-proceed-btn">
                                Proceed to soft credit check
                            </button>
                        </div>
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
                                defaultValue='John Green'/>
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
                </div>}   
            </div>
            </div>
        </div>
    )
}