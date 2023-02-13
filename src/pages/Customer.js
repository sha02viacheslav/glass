import { useState, React, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import { useMediaQuery, Button } from '@mui/material';
// import all car components for window-selection
import ThreeDoorHatch from '../components/window-selection/3_Door_Hatch';
import FiveDoorHatch from '../components/window-selection/5_Door_Hatch';
import Coupe from '../components/window-selection/Coupe';
import Estate from '../components/window-selection/Estate';
import Sedan from '../components/window-selection/Sedan';
import VANs from '../components/window-selection/VANs';
import LicensePlate from '../components/LicensePlate';
import {autocomplete} from 'getaddress-autocomplete';
import { trackPromise } from 'react-promise-tracker';
import axios from 'axios';

const Customer = () => {
    const [quoteInfo, setQuoteInfo] = useState(JSON.parse(sessionStorage.getItem('quoteInfo')) || []);
    const  inputInterval = useRef('');
    const  pCodeInterval = useRef('');
    const [vehicleData, setVehicleData] = useState('');
    const {licenseRef} = useParams();
    const [licenseSearchVal, setLicense] = useState(licenseRef || '');
    const [vehicleMakeModel, setVehicleMakeModel] = useState('Make & Model');
    const [vehicleMake, setVehicleMake] = useState('');
    const [vehicleRegYear, setVehicleRegYear] = useState('');
    const [vehicleBodyType, setVehicleBodyType] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [vehicleModelYear, setVehicleModelYear] = useState('');
    const [billingAddressVal, setBillingAddress] = useState(quoteInfo.address || '');
    const firstName = quoteInfo.firstName || '';
    const lastName = quoteInfo.lastName || '';
    const email = quoteInfo.email || '';
    const phone = quoteInfo.phone || '';
    const selected = quoteInfo.selected || [];
    const navigate = useNavigate();

    // keep track if request can be submitted
    const firstNameRef = useRef('');
    const lastNameRef = useRef('');
    const emailRef = useRef('');
    const phoneRef = useRef('');
    const billingRef = useRef('');

    // for determining which form is not filled
    const [incorrectFormIndex, setIncorrectFormIndex] = useState(99);

    // when true, displays offer info
    const [submitClicked, setSubmitClicked] = useState(false);
    const [onSubmitMessage, setOnSubmitMessage] = useState('');

    // temporary things for car selection menu - Rainer
    const [selectedCarType, setSelectedCarType] = useState(quoteInfo.bodyType || '3door');

    // for getting the array of broken windows
    const [selectedBrokenWindows, setSelectedBrokenWindows] = useState([]);
    const brokenWindowsToCustomer = (windows) => {
        setSelectedBrokenWindows(windows);
    }
    // preselect broken windows if editing quote
    const [brokenWindowsToComponent, setBrokenWindowsToComponent] = useState([]);

    // functions for checking if necessary fields are filled and enable submit request
    function checkIfFilled(ref, errorMsg, formIndex) {
        if (formIndex === 5) {
            if (ref === '') {
                setOnSubmitMessage(errorMsg);
                setIncorrectFormIndex(formIndex);
                return true;
            }
        } else if (ref.current.value === '') {
            setOnSubmitMessage(errorMsg);
            setIncorrectFormIndex(formIndex);
            return true;
        }
    }

    // check if any windows are selected before submit request
    function checkIfSelected() {
        if (selectedBrokenWindows.length === 0) {
            setOnSubmitMessage('Select windows that need replacing');
            return true;
        }
    }
    
    function handleSubmitClick() {
        const firstNameNotFilled = checkIfFilled(firstNameRef, 'First name not filled', 0);
        const lastNameNotFilled = checkIfFilled(lastNameRef, 'Last name not filled', 1);
        const emailNotFilled = checkIfFilled(emailRef, 'Email not filled', 2);
        const phoneNotFilled = checkIfFilled(phoneRef, 'Phone number not filled', 3);
        const billingNotFilled = checkIfFilled(billingRef, 'Postal code not filled', 4);
        const licenseNumNotFilled = checkIfFilled(licenseSearchVal, 'License number not filled', 5);
        const windowNotFilled = checkIfSelected();

        // enable submit request if all form fields are filled (more conditions can be added)
        if (firstNameNotFilled || lastNameNotFilled || emailNotFilled || phoneNotFilled || billingNotFilled || windowNotFilled || licenseNumNotFilled) {
            return;
        } else {
            // post data
            setSubmitClicked(true); 
            console.log('sent');
            const name = firstNameRef.current.value.concat(' ', lastNameRef.current.value);
            // let axios = require('axios');
            let data = JSON.stringify({
                "jsonrpc": "2.0",
                "params": {
                    "customer_name": name,
                    "customer_phone": phoneRef.current.value,
                    "customer_email": emailRef.current.value,
                    "customer_order_postal_code": billingRef.current.value,
                    "registration_number": licenseSearchVal,
                    "registration_year": "2010",
                    "make": "make 2002",
                    "model": "model 2002",
                    "body_type": "body_type 2002",
                    "model_year": "2002",
                    "glass_location": selectedBrokenWindows
                }
            });

            let config = {
                method: 'post',
                url: 'https://fixglass-staging-7245003.dev.odoo.com/api/v1/react/order/create_quotation',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                navigate("/react/quote/" + response.data.result.fe_token);
            })
            .catch(function (error) {
                console.log(error);
            })
        }
    }


    useEffect(() => {
        // scroll car into view on page load
        // if (!submitClicked) {
        //     const windowSelector = document.getElementById("scroll-focus");
        //     windowSelector.scrollIntoView();
        // } 
        // necessary incase returning from quote page navbar would not load unless the page is refreshed
        document.getElementById("navbar-main").style.display = "inline";
        document.getElementById("footer-main").style.display = "inline";

        // Integration of PostalCode/ Address AutoComplete API
        autocomplete("billingAddress","SFB4ZD1fO0ONndTgHnmUmg26020", {
            delay: 500,
        });

        // Preventing Default to show complete address with Postal Code
        window.addEventListener("getaddress-autocomplete-address-selected", function(e){
            e.preventDefault();
            let tempAddress = e.address.formatted_address.filter(Boolean).join(", ")+" "+e.address.postcode;
            setBillingAddress(tempAddress);
        })
    }, []);

    useEffect(() => {
        // send previously selected windows to window selection component
        let selectedWindows = [];
        if (selected.length > 0) {
            for (let i = 0; i < selected.length; i++) {
                selectedWindows.push(selected[i].name); 
            }
            setBrokenWindowsToComponent(selectedWindows); 
        }
    }, []);

    function handleVehInputChange(data) {
        // format correcly
        // check if license plate is standard or unique
        let input = data;
        if (data.length >= 3) {
            if (Number.isInteger(Number(data.charAt(2)))) {
                // license number is standard
                // check if plate already includes space
                if (data.charAt(4) !== ' ' && data.length === 7) {
                    input = input.slice(0,4) + ' ' + input.slice(4);
                }
            }
        } 
        setLicense(input.toUpperCase());
    }      


    const handlePCodeChange = (event) => {
        setBillingAddress(event.target.value);
    }

    return (
        <div>
            <section className="sec-customer my-4 my-md-5">
                <div className="container">
                    <div className='tab-content'>
                        <div className="row" id='scroll-to-top'>
                        <LicensePlate 
                            placeholderVal={'NU71 REG'}
                            licenseNumber={licenseSearchVal}
                            model={vehicleMakeModel}
                            handleVehInputChange={handleVehInputChange}
                        />
                        <br />
                            
                        </div>
                        <div className="row mt-4 mt-md-5 text-center">
                            <div className="col-md-9 mx-auto">
                                { !submitClicked && <div>
                                    <div id='scroll-focus'>
                                        <h2 className="text-blue  text-24">Select Broken Glasses</h2>
                                        <p>Tap directly or select below</p>
                                    </div>
                                
                                    <div className="parent">                        
                                        {/* car image display */}
                                        {selectedCarType === '3door' && 
                                        <ThreeDoorHatch 
                                            brokenWindowsToCustomer={brokenWindowsToCustomer}
                                            brokenWindowsToComponent={brokenWindowsToComponent}
                                        />}
                                        {selectedCarType === '5door' && 
                                        <FiveDoorHatch 
                                            brokenWindowsToCustomer={brokenWindowsToCustomer}
                                            brokenWindowsToComponent={brokenWindowsToComponent}
                                        />}
                                        {selectedCarType === 'coupe' && 
                                        <Coupe 
                                            brokenWindowsToCustomer={brokenWindowsToCustomer}
                                            brokenWindowsToComponent={brokenWindowsToComponent}
                                        />}
                                        {selectedCarType === 'estate' && 
                                        <Estate 
                                            brokenWindowsToCustomer={brokenWindowsToCustomer}
                                            brokenWindowsToComponent={brokenWindowsToComponent}
                                        />}
                                        {selectedCarType === 'sedan' && 
                                        <Sedan 
                                            brokenWindowsToCustomer={brokenWindowsToCustomer}
                                            brokenWindowsToComponent={brokenWindowsToComponent}
                                        />}
                                        {selectedCarType === 'van' && 
                                        <VANs 
                                            brokenWindowsToCustomer={brokenWindowsToCustomer}
                                            brokenWindowsToComponent={brokenWindowsToComponent}
                                        />}
                                        <br /><br />
                                        <p className="fs-18 text-blue">Your comments (optional)</p>
                                        <div className="form-group mb-4">
                                            <textarea name="" id="" rows="4" className="form-control h-auto" placeholder="Details for glass or any other comment."></textarea>
                                        </div>

                                        <p className="fs-18 text-blue">Car Data (temporary)</p>
                                        <div className="form-group mb-4">
                                            <textarea name="" id="" value={vehicleData} rows="4" className="form-control" placeholder="Details for glass or any other comment.">{vehicleData}</textarea>
                                        </div>
                                        {/* <a href="#" className="btn btn-purple">Add Pictures</a> */}
                                        <Button variant="contained" color="secondary">Add Pictures</Button>
                                        <small className="d-block mt-2">*Recommended</small>
                                        <form action="" className="form-car my-md-5 my-4">
                                            <p className="fs-18 text-blue">Fill your personal details</p>
                                            <br />
                                            <div className="row" key={quoteInfo}>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-4">
                                                        <input ref={firstNameRef} type="text" 
                                                            className={incorrectFormIndex === 0 ? 'form-control form-not-filled' : 'form-control'} 
                                                            placeholder="First name" 
                                                            defaultValue={firstName} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-4">
                                                        <input ref={lastNameRef} type="text" 
                                                            className={incorrectFormIndex === 1 ? 'form-control form-not-filled' : 'form-control'} 
                                                            placeholder="Last name" 
                                                            defaultValue={lastName} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-4">
                                                        <input ref={emailRef} type="text" 
                                                            className={incorrectFormIndex === 2 ? 'form-control form-not-filled' : 'form-control'} 
                                                            placeholder="Email" 
                                                            defaultValue={email} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-4">
                                                        <input ref={phoneRef} type="text" 
                                                            className={incorrectFormIndex === 3 ? 'form-control form-not-filled' : 'form-control'} 
                                                            placeholder="Phone" 
                                                            defaultValue={phone} />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group mb-4">
                                                        <input id='billingAddress' ref={billingRef} type="text" 
                                                            className={incorrectFormIndex === 4 ? 'form-control form-not-filled' : 'form-control'} 
                                                            placeholder="Billing address"
                                                            onChange={handlePCodeChange}
                                                            value={billingAddressVal}
                                                            defaultValue={billingAddressVal} />
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        {/* submit request button */}
                                        <div className="row">
                                        <div className="col-md-7 mx-auto">
                                            <div className='submit-request-msg'>{onSubmitMessage}</div> 
                                            <button 
                                                className="btn btn-purple-radius w-100 mb-3" 
                                                onClick={handleSubmitClick}
                                                id='submitBtn'
                                                >
                                                    Submit request</button>
                                        </div>
                                    </div>
                                    </div>
                                </div>}
                                <br />
                                <div className="position-relative pt-md-4">
                                    <img src={process.env.PUBLIC_URL + "/img/hand-pic.png"} className="img-fluid w-100 mob-h" alt="" />
                                    <div className="recycle-content text-start phn-content">
                                        <div className="d-flex justify-content-between">
                                            <div className="content-left">
                                                <h2 className="text-white mb-2">Mobile Service </h2>
                                                <p className="fw-light fs-14 mb-0 text-white">We come to your home or work.</p>
                                                <p className="mb-2 text-white">Replacement 1-2 h</p>
                                                <Link to="/react/customer" className="btn  text-purple bg-white">Get a Quote</Link>
                                            </div>
                                            <div className="re-img mt-auto">
                                                <img src={process.env.PUBLIC_URL + "/img/phn.png"} className="img-fluid" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Customer
