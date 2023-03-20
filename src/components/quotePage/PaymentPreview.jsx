import { useState } from 'react';
import '../../css/payment-method.css';
import SelectOfferNew from './SelectOfferNew';

const previewOffer = [{
    product: 'Your order',
    price_subtotal: 0,
    price_total: 0,
    price_unit: 0
}]

export default function PaymentPreview({customerInfo}) {

    const [singlePay, setSinglePay] = useState('card');
    const [selectedMethod, setSelectedMethod] = useState(4);

    function updateTotalPrice(data) {

    }

    return(
            <div className="payment-method">
                <h3 className="text-24 text-blue PM-header">Quotation</h3>
                <div className='PM-status'>Status: processing</div>
                {/* show quotation price details */}
                <SelectOfferNew 
                    selectOfferToCustomer={previewOffer}
                    priceToParent={updateTotalPrice}
                />
                <div className='PM-btn-container'>
                    <button className={selectedMethod === 1 ? 'PM-button-active' : 'PM-button'} onClick={() => setSelectedMethod(1)}>
                        <small className="fs-14">4 month</small>
                        <div className='PM-price'>£ 0</div>
                    </button>
                    <button className={selectedMethod === 2 ? 'PM-button-active' : 'PM-button'} onClick={() => setSelectedMethod(2)}>
                        <small className="fs-14">Insurance</small>
                        <div className='PM-price'>£ 0</div>
                    </button>
                    <button className={selectedMethod === 3 ? 'PM-button-active' : 'PM-button'} onClick={() => setSelectedMethod(3)}>
                        <small className="fs-14">Single pay</small>
                        <div className='PM-price'>£ 0</div>
                    </button>
                </div>

                <div className='PM-payment-option'>
                    {selectedMethod === 1 && <div>
                        <p className="text-purple mb-2">4-Month</p>
                        <div>
                            <p>This loan comprises of 4 monthly payments, with the first taken immediately on setup.</p>
                        </div>
                        <div className='PM-insurance-container'>
                            <div className="PM-insurance-sub">
                                <input type="text" 
                                    className='form-control PM-top-input'
                                    defaultValue={customerInfo[0].f_name}/>
                                <input type="text" 
                                    className='form-control PM-top-input'
                                    defaultValue={customerInfo[0].s_name}/>
                            </div>
                            <input type="text" 
                                className='form-control PM-email'
                                defaultValue={customerInfo[0].email}/>
                            <input 
                                id="autocomplete-field" 
                                type='text'
                                className='form-control PM-address'
                                defaultValue={customerInfo[0].c_address}/> 
                            <input type="text" 
                                className='form-control PM-postalcode'
                                defaultValue={customerInfo[0].c_postalcode}/>
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
                                defaultValue={customerInfo[0].c_address}/> 
                            <div className='PM-excess-cont'>
                                <span>Excess: </span>
                                <span> £</span>
                                <input type="text" 
                                    className='form-control'
                                    defaultValue='0'
                                />
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
                    {selectedMethod === 4 && <div className='transparent-element'>
                        -
                    </div> }                    
                </div>
            </div>
    )
}