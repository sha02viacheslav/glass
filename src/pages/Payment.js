import React, { useEffect } from 'react'
import PayBookTimeline from '../components/Timeline';
import LocationSelection from '../components/LocationSelection';
import TimeSelectionNew from '../components/TimeSelectionNew';
import PaymentMethod from '../components/PaymentMethod';
import { useState } from 'react';
import '../css/payment.css';
import user from '../components/icons/user.png';
import monthsData from '../components/data/months.json';
import close from '../components/icons/x.png';
import timeData from '../components/data/newTSDummy.json';

export default function Payment({clientTime, clientDate, clientAddress}) {

    const [selectedSlot, setSelectedSlot] = useState(JSON.parse(sessionStorage.getItem('selectedSlot')) || '');
    const [pastSlots, setPastSlots] = useState(JSON.parse(sessionStorage.getItem('pastSlots')) || []);
    const [pastLocs, setPastLocs] = useState(JSON.parse(sessionStorage.getItem('pastLocs')) || []);
    const [isOpen, setIsOpen] = useState(false); // control popup
    const [isRetrieved, setIsRetrieved] = useState(true);
    const quoteInfo = JSON.parse(sessionStorage.getItem('quoteInfo')) || []; 
    let currentDate = new Date();
    const months = monthsData;
    const [today, setToday] = useState('');
    const [componentDisplay, setComponentDisplay] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');

    function timeSlotToParent(slotData) {
        pastSlots.push(slotData);
        setPastSlots(pastSlots.slice());
    }

    function deliveryAddressToParent(data) {
        setDeliveryAddress(data);
    }

    function openPopup(compValue) {
        setComponentDisplay(compValue);
        setIsOpen(true);
    }

    function closePopup() {
        setIsOpen(false);
        setComponentDisplay('');
    }

    useEffect(() => {
        // for correctly displaying the current date incase Live Booking is in the preview state (!isRetrieved)
        const currentDay = currentDate.getDate().toString();
        const currentMonth = months[currentDate.getMonth()]
        const currentYear = currentDate.getFullYear().toString();
        const newCurrentDate = currentDay.concat(' ', currentMonth).concat(' ', currentYear);
        setToday(newCurrentDate);
    }, []);

    return (
        <div className='pay-main-container'>
            {isOpen && <div className="popup-background">
                <div className='popup-container'>
                    <div className="popup-close-container">
                        <img className='popup-close' src={close} alt="" onClick={closePopup}/>
                    </div>

                    {componentDisplay === 'time' && <TimeSelectionNew 
                        timeSlotToParent={timeSlotToParent}
                        timeData={timeData}
                        liveBooking={false}
                        slot={"2023-01-12 12:00:00"}
                    />}

                    {componentDisplay === 'loc' && <LocationSelection
                        userBillingAddress={billingAddress}
                        deliveryAddressToParent={deliveryAddressToParent}
                    />}

                    <div className="popup-btn-container">
                        <button className="btn btn-purple-outline mb-3" onClick={closePopup}>
                            Close
                        </button>
                        <button className="btn btn-purple-radius mb-3" onClick={closePopup}>
                            Update
                        </button>
                    </div>
                </div>
            </div>}

            <div>
                <div className="pay-top-container">   
                    <div className="pay-left-container">
                        <ul className="list-inline d-flex align-items-center">
                            <li className="list-item-inline">
                                {isRetrieved && <img src={process.env.PUBLIC_URL +"/img/avat.svg"} className="img-fluid me-3" alt="" />}
                                {!isRetrieved && <img src={user} className="img-fluid me-3 pay-user" alt="" />}
                            </li>
                            <li className="list-item-inline">
                                <span className="fs-18 d-block text-purple">Technician</span>
                                {isRetrieved && <p className="mb-0">Arvin Kuldner</p>}
                            </li>
                        </ul>
                        {isRetrieved && [...new Set(pastLocs)].slice(0,-1).map((element, index) => 
                            <div key={index} className="pay-old-container-right">
                                {element}
                            </div>)}
                    </div>
                    <div className="pay-right-container">
                        {isRetrieved && pastSlots.slice(0,-1).map((element, index) => 
                            <div key={index} className="pay-old-container-right">
                                {element}
                            </div>)}
                        <div className={!isRetrieved ? "dis-info-frame" : "pay-info-frame"}>
                            <div className="pay-frame-inner">
                                {isRetrieved && <h5 className="text-blue">{clientDate !== '' ? clientDate : 'Date'}</h5>}
                                {!isRetrieved && <h5 className="text-blue">{today}</h5>}
                                {isRetrieved && <div className='pay-booking-info'>Arriving between {clientTime !== '' ? clientTime : ''}</div>}
                            </div>
                            <a href="#">
                                <span className="text-purple fs-14 fw-normal float-end" onClick={() => openPopup('time')}>EDIT</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className={!isRetrieved ? "dis-loc-frame" : "frame mb-5"}>
                    <div className="date-address-container">
                        <h5 className="date-address-header">{clientAddress !== '' ? clientAddress : 'Billing address'}</h5>
                        <a href="#">
                            <span className="text-purple fs-14 fw-normal float-end" onClick={() => openPopup('loc')}>EDIT</span>
                        </a>
                    </div>
                    {/* <p className="mb-0 fs-14">{pastLocs[pastLocs.length - 1]} </p> */}
                    {isRetrieved && <p className="mb-0 fs-14">Arriving between <span className="fw-500"> {clientTime !== '' ? clientTime : ''}</span> </p>}

                    <div id="map-container-google-1" className="z-depth-1-half map-container mt-4" width="100%" style={{height: 400+"px"}}>
                        <iframe src="https://maps.google.com/maps?q=manhatan&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" frameBorder="0"
                            style={{border:0}} allowFullScreen></iframe>
                    </div>
                </div>
                <button onClick={() => setIsRetrieved(!isRetrieved)}>switch</button>
                <PayBookTimeline />
                <PaymentMethod />
                <br /><br />
                {/* <div className="row">
                    <div className="col-md-7 mx-auto">
                        <Link to="/react/paid" className="btn btn-purple-radius w-100 mb-3">Pay and Book</Link>
                        <Link to="/react/payment" className="btn btn-purple-outline w-100 mb-3">Cancel Booking</Link>
                    </div>
                </div> */}
                <div className="payment-btn-container">
                <button className="btn btn-purple-outline mb-3 quote-btn quote-decline">
                    Decline
                </button>
                <button className="btn btn-purple-radius mb-3 quote-btn quote-accept">
                    Pay
                </button>
            </div>
            </div>
        </div>
    )
}