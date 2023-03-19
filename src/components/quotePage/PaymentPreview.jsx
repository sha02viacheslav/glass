import '../../css/payment-method.css';
import SelectOfferNew from './SelectOfferNew';

const previewOffer = [{
    product: 'Your order',
    price_subtotal: 0,
    price_total: 0
}]

export default function PaymentPreview() {

    const [singlePay, setSinglePay] = useState('card');

    return(
        <div className='center'>
                {/* show quotation price details */}
                <SelectOfferNew 
                    selectOfferToCustomer={previewOffer}
                />
                <div className='PM-btn-container'>
                    <button className={selectedMethod === 1 ? 'PM-button-active' : 'PM-button'} onClick={() => setSelectedMethod(1)}>
                        <small className="fs-14">4 month</small>
                        <div className='PM-price'>£ processing</div>
                    </button>
                    <button className={selectedMethod === 2 ? 'PM-button-active' : 'PM-button'} onClick={() => setSelectedMethod(2)}>
                        <small className="fs-14">Insurance</small>
                        <div className='PM-price'>£ processing</div>
                    </button>
                    <button className={selectedMethod === 3 ? 'PM-button-active' : 'PM-button'} onClick={() => setSelectedMethod(3)}>
                        <small className="fs-14">Single pay</small>
                        <div className='PM-price'>£ processing</div>
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
                                defaultValue={address}
                                value={address} /> 
                            <input type="text" 
                                className='form-control PM-postalcode'
                                defaultValue={postalCode}
                                onChange={updatePAInfo}/>
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
                                defaultValue={address}
                                value={address} /> 
                            <div className='PM-excess-cont'>
                                <span>Excess: </span>
                                <span> £</span>
                                <input ref={excessRef} type="text" 
                                    className='form-control'
                                    defaultValue={excess}
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