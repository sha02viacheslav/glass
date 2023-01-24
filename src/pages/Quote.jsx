import { useState } from 'react';
import '../css/quote.css';
import '../css/license-plate.css';
import SelectOfferNew from '../components/SelectOfferNew';
import TimeSelectionNew from '../components/TimeSelectionNew';
import LocationSelection from '../components/LocationSelection';
import BeforeAfter from '../components/BeforeAfter';
import Payment from './Payment'
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import expand from '../components/icons/expand.png';
import up from '../components/icons/up.png';
import flag from '../components/icons/uk-flag.png';
import close from '../components/icons/x.png';
import timeData from '../components/data/newTSDummy.json';
import { trackPromise } from 'react-promise-tracker';
import { useRef } from 'react';

const monthValuesRev = {"01":"Jan","02":"Feb","03":"Mar","04":"Apr","05":"May","06":"June","07":"July","08":"Aug","09":"Sept","10":"Oct","11":"Nov","12":"Dec"};
const timeheaders = ['08:00', '10:00', '12:00', '14:00','16:00','18:00','20:00','22:00'];

function Quote() {

    // Tabs - controls the different views of the quote page: 0 -> customer, 1 -> pay&book, 3 -> thank you
    const [tabValue, setTabValue] = useState(0);
    const [isRetrieved, setIsRetrieved] = useState(false);
    const [snapValue, setSnapValue] = useState(1);
    const [acceptBtn, setAcceptBtn] = useState('Next'); // can change to Next
    const [timeSlot, setTimeSlot] = useState("");
    const [quoteInfoOpen, setInfoOpen] = useState(false);
    const [billingAddress, setBillingAddress] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [quoteDetails, setQuoteDetails] = useState([]);
    const [customerDetails, setCustomerDetails] = useState([]);
    const [glassDetails, setGlassDetails] = useState([]);
    const [offersDetails, setOffersDetails] = useState([]);// || [];
    const [schedulerData, setSchedulerData] = useState([]);
    const [paymentOption, setPaymentOption] = useState([]);
    const [dateToPayment, setDateToPayment] = useState('');
    const [timeToPayment, setTimeToPayment] = useState('');
    const [slotSelected, setSlotSelected] = useState(false);
    const [declinePopup, setDeclinePopup] = useState(false);
    const [declineReason, setDeclineReason] = useState(0);
    const declineRef = useRef();

    // navigate back to customer page
    const navigate = useNavigate();

    // client info
    const {id} = useParams('');
    // getQuote(id);
    function getQuote(qid) {
        // console.log(qid);

        let body = {
            action: "get_quote_data",
            quote_id: qid
        };
        trackPromise(
            axios
            .post("https://fix.glass/odoo_apis/stag_call.php", body, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            .then(function(response) {
                console.log(response.data);
                console.log(response.data.QuoteData);
                console.log(response.data.glassData);
                console.log(response.data.userData[0]);
                setQuoteDetails(response.data.QuoteData[0]);
                if(response.data.QuoteData[0].x_studio_status_1 !== "Published"){
                    setTabValue(3);
                }
                setCustomerDetails(response.data.userData[0]);
                setGlassDetails(response.data.glassData);
                setOffersDetails(response.data.offerData);
                setBillingAddress(response.data.userData[0].order_postal_code);

                
                // var dataG = '';
                // var countG = response.data.glassData;
                // for(let i=0;i<countG.length;i++) {
                //     dataG += '<span key='+countG[i].name+' className="client-windows">'+countG[i].name+'</span>';
                            
                // }
                // setGlassDetails(dataG);
                console.log(glassDetails);
                setInfoOpen(true);
                
                    
            })
            .catch(function(error) {
                console.log(error);
                //getAddress("No Data Found! Error in Address API .");
            })
        );
    }
    function getSchedulerData() {
        let body = {
            action: "get_schedule_data"
        };
        trackPromise(
            axios
            .post("https://fix.glass/odoo_apis/stag_call.php", body, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            .then(function(response) {
                console.log(response.data);
                setSchedulerData(response.data);
            })
            .catch(function(error) {
                console.log(error);
            })
        );
    }

    function updateQuoteData(){
        let body = {
            action: "up_quote_data",
            quote_id: id,
            ptype: paymentOption,
            pl_address:deliveryAddress,
            schedule_date:timeSlot
        };
        console.log(body);
        trackPromise(
            axios
            .post("https://fix.glass/odoo_apis/stag_call.php", body, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            .then(function(response) {
                console.log(response.data);
                // handleSnapChange('next');
            })
            .catch(function(error) {
                console.log(error);
            })
        );
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
            // change tab
            handleTabChange(1);
            updateQuoteData();
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
        navigate('/react/customer');
    }

    function timeSlotToParent(data) {
        setTimeSlot(data);
        setSlotSelected(false);
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
            getSchedulerData();
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
        if (timeSlot !== '') {
            // format timeslot data to send to live booking tab
            // data:"2023-01-12 12:00:00"
            const dateTime = timeSlot.split(' ');
            const dateSplit = dateTime[0].split('-');
            const timeSplit = dateTime[1].substring(0, 5);
            const timeSplitNext = timeheaders[timeheaders.indexOf(timeSplit) + 1];
            const date = monthValuesRev[dateSplit[1]].concat(' ', dateSplit[2]).concat(' ', dateSplit[0]);
            setDateToPayment(date);
            console.log(timeSplitNext);
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
                {/* && quoteDetails.hasOwnProperty("registration_number") */}
                {/* {quoteInfoOpen && <div className="quote-info-main"> */}
                {quoteInfoOpen && quoteDetails.hasOwnProperty("registration_number") && <div className="quote-info-main">
                    <div className="client-info-container">
                        <div className='info-container'>
                            <div id="scroll-to-top">
                                <div className="yellow-box">
                                    <div className="blue-box">
                                        <img className='flag' src={flag} alt="" />
                                        <div className='gb'>UK</div>
                                    </div>
                                    <input className='license-input' type="text" value={quoteDetails.registration_number} placeholder='Reg. Number'/>
                                    {/* <input className='license-input' type="text" value='FGHJKL7' placeholder='Reg. Number'/> */}
                                </div>
                                <div className="client-info">{customerDetails.name}</div>
                                {/* <div className="client-info">My Name</div> */}
                                <div className="client-info"><b>Billing address:</b> {customerDetails.order_postal_code}</div>
                                {/* <div className="client-info"><b>Billing address:</b> 12345</div> */}
                                <div className="client-info"><b>Email:</b> {customerDetails.email}</div>
                                {/* <div className="client-info"><b>Email:</b> my.name@email.com</div> */}
                                <div className="client-info"><b>Phone number:</b>{customerDetails.phone}</div>
                                {/* <div className="client-info"><b>Phone number:</b>098765432</div> */}
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
                            {glassDetails.map(element => 
                                <span key={element.id} className="client-windows">{element.name}</span>
                            )}
                            {/* <span className="client-windows">Windscreen</span> */}
                        </div>
                        <img onClick={() => setInfoOpen(false)} src={up} alt="" style={{width: '17px'}} className='client-up-icon' />
                    </div>
                </div>}
                {/*  && quoteDetails.hasOwnProperty("registration_number") */}
                {!quoteInfoOpen && quoteDetails.hasOwnProperty("registration_number") && <div className="quote-info-compact">
                    <div className='client-info-compact'>
                        <div className="yellow-box">
                            <div className="blue-box">
                                <img className='flag' src={flag} alt="" />
                                <div className='gb'>UK</div>
                            </div>
                            <input className='license-input' type="text" value={quoteDetails.registration_number} placeholder='Reg. Number'/>
                            {/* <input className='license-input' type="text" value='FGHJKL7' placeholder='Reg. Number'/> */}
                        </div>
                        {/* <div className="client-info">{customerDetails.name}</div> */}
                        <div className='compact-bottom-row'>
                            <div className='compact-bottom-row'>
                                {glassDetails.map(element => 
                                    <span key={element.id} className="client-windows">{element.name}</span>
                                )}
                                {/* <span className="client-windows">Windscreen</span> */}
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
            {((tabValue === 1 || tabValue === 0) && quoteDetails.hasOwnProperty("registration_number")) && <div className="tab">
                <button className={tabValue === 0 ? 'tab-button-active' : 'tab-button'} onClick={() => handleTabChange(0)}>Customer</button>
                <button className={tabValue === 1 ? 'tab-button-active' : 'tab-button'} onClick={() => handleTabChange(1)} id='pay-btn'>Live Booking</button>
            </div>}

            <div className='center'>
                {/*  && quoteDetails.x_studio_status_1 === "Published" */}
                {tabValue === 0 && quoteDetails.x_studio_status_1 === "Published" && <div className='scroll-container'>
                    {/* select offer */}
                    <div id='offer'>
                        <SelectOfferNew 
                            selectOfferToCustomer={offersDetails}
                            isRetrieved={isRetrieved}
                            paymentOptionToParent={paymentOptionToParent}
                        />
                        <br /><br />
                    </div>

                    <div className="quote-scroll-target" id='2'>-</div>
                    {slotSelected && <div className='quote-scheduler-msg'>Select a time for the repair</div>}
                    {schedulerData.length > 0 &&<div className={slotSelected ? 'quote-scheduler-red' : undefined}>
                        <TimeSelectionNew 
                            timeSlotToParent={timeSlotToParent}
                            timeData={schedulerData}
                            liveBooking={false}
                            slot={timeSlot}
                        />
                    </div>}

                    {/* {slotSelected && <div className='quote-scheduler-msg'>Select a time for the repair</div>}
                    {schedulerData.length === 0 &&<div className={slotSelected ? 'quote-scheduler-red' : undefined}>
                        <TimeSelectionNew 
                            timeSlotToParent={timeSlotToParent}
                            timeData={timeData}
                            liveBooking={false}
                            slot={""}
                        />
                    </div>} */}

                    <div className="quote-scroll-target-2" id='3'>-</div>

                    {/* > 0 for build, === 0 for local */}
                    {billingAddress.length > 0 && <div className='quote-component-last'>
                        <LocationSelection
                            userBillingAddress={billingAddress}
                            deliveryAddressToParent={deliveryAddressToParent}
                         />
                    </div>}
                </div>}
            </div>
            {/* accept / decline buttons */}
            {/*  && quoteDetails.x_studio_status_1 === "Published" */}
            {tabValue === 0 && quoteDetails.x_studio_status_1 === "Published" && <div className="accept-btn-container" id='accept-cont'>
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
            {tabValue === 1 && quoteDetails.x_studio_status_1 === "Published" && <div className='tab-content center'>
                <Payment 
                    clientTime={timeToPayment}
                    clientDate={dateToPayment}
                    clientAddress={billingAddress}/>                    
            </div>}
        </div>
    );
}

export default Quote;