import { useState, useRef, useEffect } from 'react';
import '../css/quote.css';
import '../css/license-plate.css';
import SelectOfferNew from '../components/SelectOfferNew';
import TimeSelectionNew from '../components/TimeSelectionNew';
import LocationSelection from '../components/LocationSelection';
import BeforeAfter from '../components/BeforeAfter';
import Payment from './Payment'
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import expand from '../components/icons/expand.png';
import up from '../components/icons/up.png';
import flag from '../components/icons/uk-flag.png';
import close from '../components/icons/x.png';
import { trackPromise } from 'react-promise-tracker';
import { ConstructionRounded } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';

const monthValuesRev = {"01":"Jan","02":"Feb","03":"Mar","04":"Apr","05":"May","06":"June","07":"July","08":"Aug","09":"Sept","10":"Oct","11":"Nov","12":"Dec"};
const timeheaders = ['08:00', '10:00', '12:00', '14:00','16:00','18:00','20:00','22:00'];

function Quote() {

    // Tabs - controls the different views of the quote page: 0 -> customer, 1 -> pay&book, 3 -> thank you
    const [tabValue, setTabValue] = useState(0);
    const [customerDetails, setCustomerDetails] = useState([]);
    const [isRetrieved, setIsRetrieved] = useState(false);
    const [snapValue, setSnapValue] = useState(1);
    const [acceptBtn, setAcceptBtn] = useState('Next'); // can change to Next
    const [timeSlot, setTimeSlot] = useState("");
    const [timeEnd, setTimeEnd] = useState("");
    const [quoteInfoOpen, setInfoOpen] = useState(false);
    const [billingAddress, setBillingAddress] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [schedulerData, setSchedulerData] = useState([]);
    const [paymentOption, setPaymentOption] = useState([]);
    const [dateToPayment, setDateToPayment] = useState('');
    const [timeToPayment, setTimeToPayment] = useState('');
    const [slotSelected, setSlotSelected] = useState(false);
    const [declinePopup, setDeclinePopup] = useState(false);
    const [declineReason, setDeclineReason] = useState(0);
    const [isBlinky, setIsBlinky] = useState(false);
    const declineRef = useRef();
    const [tempLicenseNum, setTempLicense] = useState('');
    const navigate = useNavigate();
    const [offersDetails, setOffersDetails] = useState([{
        price_unit: 0,
        price_total: 0,
        price_subtotal: 0
    }]);

    // client info
    const {id} = useParams('');
    // getQuote(id);
    function getQuote(qid) {
        console.log('sent');
        let data = JSON.stringify({
            "jsonrpc": "2.0",
            "params": {
                "fe_token": qid
            }
        });
        let config = {
            method: 'post',
            url: process.env.REACT_APP_PREVIEW_QUOTE,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            setCustomerDetails(response.data.result.data);
            setBillingAddress(response.data.result.data.customer_order_postal_code);
            if (response.data.result.data.order_lines.length != 0) {
                setOffersDetails(response.data.result.data.order_lines);
            }
            // setGlassDetails(response.data.result.data.glass_location);
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    function handleSnapChange(option) {
        // naviagate scroll snap
        if (snapValue === 1 && option === 'next' && timeSlot === '') {
            setSnapValue(2);
            document.getElementById('2').scrollIntoView({behavior: 'smooth'});
        } else if (snapValue === 1 && option === 'next' && timeSlot !== '') {
            setSnapValue(3);
            document.getElementById('3').scrollIntoView({behavior: 'smooth'});
        } else if (snapValue === 2 && option === 'next' && timeSlot !== '') {
            setSnapValue(3);
            document.getElementById('3').scrollIntoView({behavior: 'smooth'});
        } else if (snapValue === 2 && option === 'next' && timeSlot === '') {
            // setSnapValue(2);
            // scroll snap to time select if no slot selected
            document.getElementById('2').scrollIntoView({behavior: 'smooth'});
            setSlotSelected(true);
        } else if (snapValue === 3 && option === 'next' && timeSlot !== '') {
            // send booking data
            let data = JSON.stringify({
                "jsonrpc": "2.0",
                "params": {
                    "fe_token": id,
                    "booking_start_date": timeSlot,
                    "booking_end_date": timeEnd  
                }
            });
            let config = {
                method: 'post',
                url: process.env.REACT_APP_SEND_BOOKING,
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.REACT_APP_ODOO_STAGING_KEY
                },
                data: data
            };
            axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                // change tab
                handleTabChange(1);
                // updateQuoteData();
                setIsBlinky(true);
            })
            .catch(function (error) {
                console.log(error);
            })
        } else {
            return;
        }
    }

    function handleDecline() {
        setDeclinePopup(true);
    }

    function selectDeclineReason(option) {
        setDeclineReason(option);
    }

    function handleTabChange(newValue) {
        setTabValue(newValue);
        setSnapValue(1);
    }

    function backToCustomer() {
        const licenseReg = customerDetails.registration_number;
        const i = customerDetails.customer_name.indexOf(' ');
        const names = [customerDetails.customer_name.slice(0,i), customerDetails.customer_name.slice(i + 1)];
        let quoteData = {
            address: customerDetails.customer_order_postal_code, 
            firstName: names[0],
            lastName: names[1],
            email: customerDetails.customer_email,
            phone: customerDetails.customer_phone,
            selected: customerDetails.glass_location
        };
        quoteData = JSON.stringify(quoteData);
        sessionStorage.setItem('quoteInfo', quoteData);
        navigate('/customer/' + licenseReg);
    }

    function timeSlotToParent(data) {
        setTimeSlot(data);
        setSlotSelected(false);
    }

    function timeEndToParent(data) {
        setTimeEnd(data);
        console.log(data);
    }
    
    function deliveryAddressToParent(data) {
        setDeliveryAddress(data);
    }

    function paymentOptionToParent(pOption){
        setPaymentOption(pOption);
    }

    useEffect(() => {
        //Get Quote Data
        if(id){
            getQuote(id);
            // getSchedulerData();
        }
        // hide navbar and footer
        document.getElementById("navbar-main").style.display = "none";
        document.getElementById("footer-main").style.display = "none";
        // scroll to top on page load
        const topSelector = document.getElementById('1');
        if (topSelector !== null) {
            topSelector.scrollIntoView({behavior: 'smooth'});
        }
    }, []);

    useEffect(() => {
        // format license number correctly
        setTempLicense(customerDetails.registration_number);
        if (tempLicenseNum === undefined) {
            return
        }
        if (Number.isInteger(Number(tempLicenseNum.charAt(2)))) {
            // license number is standard
            // check if plate already includes space
            if (tempLicenseNum.charAt(4) === ' ') {
                return;
            } else if (tempLicenseNum.length === 7) {
                let input = '';
                if (customerDetails.registration_number !== undefined) {
                    input = customerDetails.registration_number;
                } else {
                    input = tempLicenseNum;
                }
                input = input.slice(0,4) + ' ' + input.slice(4);
                setTempLicense(input);
            }
        }
    }, [customerDetails]);

    useEffect(() => {
        if (timeSlot !== '') {
            // format timeslot data to send to live booking tab
            // data:"2023-01-12 12:00:00"
            const dateTime = timeSlot.split(' ');
            const dateSplit = dateTime[0].split('-');
            const timeSplit = dateTime[1].substring(0, 5);
            const timeSplitNext = timeheaders[timeheaders.indexOf(timeSplit) + 1];
            const date = monthValuesRev[dateSplit[1]].concat(' ', dateSplit[2]).concat(' ', dateSplit[0]);
            setDateToPayment(date);
            setTimeToPayment(timeSplit.concat('-', timeSplitNext));
        }
    }, [tabValue]);

    useEffect(() => {
        // change between accept and next buttons names and styling
        let acceptSelector = document.getElementById('accept-btn');
        if (snapValue === 1 && acceptSelector != null) {
            setAcceptBtn('Next');
        } else if (snapValue === 2 && acceptSelector !== null) {
            setAcceptBtn('Next');
            acceptSelector.classList.remove('quote-accept');
        } else if (snapValue === 3 && acceptSelector !== null && timeSlot !== '') {
            setAcceptBtn('Confirm Booking');
            acceptSelector.classList.add('quote-accept');
        }
    }, [snapValue, timeSlot]);

    return ( 
        <div>
            {declinePopup && <div className="popup-background">
                <div className='popup-container'>
                    <div className="popup-close-container">
                        <img className='popup-close' src={close} alt="" onClick={() => setDeclinePopup(false)}/>
                    </div>                  
                    <div className='popup-decline-container'>
                        <div>Reason for declining</div>
                        <div className={declineReason === 1 ? 'popup-decline-reason-act' : 'popup-decline-reason'} 
                            onClick={() => selectDeclineReason(1)}>1. Too expensive</div>
                        <div className={declineReason === 2 ? 'popup-decline-reason-act' : 'popup-decline-reason'} 
                            onClick={() => selectDeclineReason(2)}>2. Job already done</div>
                        <input type="text" ref={declineRef} placeholder='3. Other'/>
                    </div>
                    <div className="popup-btn-container">
                        {/* needs a function to take back */}
                        <button className="btn btn-purple-outline mb-3" onClick={() => setDeclinePopup(false)}>
                            Close
                        </button>
                        <button className="btn btn-purple-radius mb-3" onClick={() => setDeclinePopup(false)}>
                            Take back decline
                        </button>
                    </div>
                </div>
            </div>}

            <div className="center">
                <div className='true-top' id='1'>-</div>
                {quoteInfoOpen && <div className="quote-info-main">
                    <div className="client-info-container">
                        {isBlinky && <Tooltip disableFocusListener title='Booking confirmed'>
                            <div className="client-info-blinky">-</div>
                        </Tooltip>}
                        <div className='info-container'>
                            <div id="scroll-to-top">
                                <div className="yellow-box" key={tempLicenseNum}>
                                    <div className="blue-box">
                                        <img className='flag' src={flag} alt="" />
                                        <div className='gb'>UK</div>
                                    </div>
                                    <input className='license-input' type="text" value={tempLicenseNum} placeholder='NU71 REG'/>
                                </div>
                                <div className="client-info">{customerDetails.customer_name}</div>
                                <div className="client-info"><b>Billing address:</b> {customerDetails.customer_order_postal_code}</div>
                                <div className="client-info"><b>Email:</b> {customerDetails.customer_email}</div>
                                <div className="client-info"><b>Phone number:</b>{customerDetails.customer_phone}</div>
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
                            <span className="client-info"><b>Selected windows:</b> </span>
                            {customerDetails.length != 0 && customerDetails.glass_location.map(element => 
                                <span key={element} className="client-windows">{element}</span>
                            )}
                        </div>
                        <img onClick={() => setInfoOpen(false)} src={up} alt="" style={{width: '17px'}} className='client-up-icon' />
                    </div>
                </div>}
                {!quoteInfoOpen && <div className="quote-info-compact">
                    {isBlinky && <Tooltip disableFocusListener title='Booking confirmed'>
                        <div className="client-info-blinky">-</div>
                    </Tooltip>}
                    <div className='client-info-compact'>
                        <div className="yellow-box" key={tempLicenseNum}>
                            <div className="blue-box">
                                <img className='flag' src={flag} alt="" />
                                <div className='gb'>UK</div>
                            </div>
                            <input className='license-input' type="text" value={tempLicenseNum} placeholder='NU71 REG'/>
                        </div>
                        <div className="client-info">{customerDetails.customer_name}</div>
                        <div className='compact-bottom-row'>
                            <div className='compact-bottom-row'>
                                {customerDetails.length != 0 && customerDetails.glass_location.map(element => 
                                    <span key={element} className="client-windows">{element}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <img onClick={() => setInfoOpen(true)} className='client-info-icon' src={expand} alt="" />
                </div> }
            </div>
            {tabValue === 3 && <div className='center'>
                <h2 className='thank-you-header'>Thank you!</h2>
                <h1 className='extra-info'>We are preparing the quote...</h1>
                {/* <button className="btn btn-purple-radius w-100 mb-3" onClick={() => handleTabChange(0)}>Show offers (temporary)</button> */}
                <img className='working-gif' src="https://media.tenor.com/6rG_OghPUKYAAAAM/so-busy-working.gif" alt="" />
                {/* <SelectOfferNew 
                    selectOfferToCustomer={offersDetails}
                    isRetrieved={isRetrieved}
                /> */}
            </div>}
            {(tabValue === 1 || tabValue === 0) && <div className="tab">
                <button className={tabValue === 0 ? 'tab-button-active' : 'tab-button'} onClick={() => handleTabChange(0)}>Customer</button>
                <button className={tabValue === 1 ? 'tab-button-active' : 'tab-button'} onClick={() => handleTabChange(1)} id='pay-btn'>Live Booking</button>
            </div>}

            <div className='center'>
                {tabValue === 0 && <div className='scroll-container'>
                    {/* select offer */}
                    <div id='offer'>
                        <SelectOfferNew 
                            key={offersDetails}
                            selectOfferToCustomer={offersDetails}
                            isRetrieved={isRetrieved}
                            paymentOptionToParent={paymentOptionToParent}
                        />
                        <br /><br />
                    </div>

                    <div className="quote-scroll-target" id='2'>-</div>
                    {/* {slotSelected && <div className='quote-scheduler-msg'>Select a time for the repair</div>}
                    {schedulerData.length > 0 &&<div className={slotSelected ? 'quote-scheduler-red' : undefined}>
                        <TimeSelectionNew 
                            timeSlotToParent={timeSlotToParent}
                            timeData={schedulerData}
                            liveBooking={false}
                            slot={timeSlot}
                        />
                    </div>} */}

                    {slotSelected && <div className='quote-scheduler-msg'>Select a time for the repair</div>}
                    {schedulerData.length === 0 &&<div className={slotSelected ? 'quote-scheduler-red' : undefined}>
                        <TimeSelectionNew 
                            timeSlotToParent={timeSlotToParent}
                            timeEndToParent={timeEndToParent}
                            // timeData={timeData}
                            liveBooking={false}
                            slot={""}
                        />
                    </div>}

                    <div className="quote-scroll-target-2" id='3'>-</div>

                    <div className='quote-component-last'>
                        <LocationSelection
                            key={billingAddress}
                            userBillingAddress={billingAddress}
                            deliveryAddressToParent={deliveryAddressToParent}
                         />
                    </div>
                </div>}
            </div>
            {/* accept / decline buttons */}
            {/*  && quoteDetails.x_studio_status_1 === "Published" */}
            {tabValue === 0 && <div className="accept-btn-container" id='accept-cont'>
                <button className="btn btn-purple-outline mb-3 quote-btn quote-decline" onClick={handleDecline} id='decline-btn'>
                    Decline
                </button>
                <button className="btn btn-purple-radius mb-3 quote-btn" onClick={() => handleSnapChange('next')} id='accept-btn'>
                    {acceptBtn}
                </button>
            </div>}
            {tabValue === 0 && <div className='quote-before-after'>
                <BeforeAfter />
            </div>}

            {/* ---------------- Pay & Book page ---------------- */}

            {/*  && quoteDetails.x_studio_status_1 === "Published" */}
            {tabValue === 1 && <div className='tab-content center'>
                <Payment 
                    clientTime={timeToPayment}
                    clientDate={dateToPayment}
                    clientAddress={billingAddress}
                    qid={id}/>                    
            </div>}
        </div>
    );
}

export default Quote;