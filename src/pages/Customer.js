import { useState, React, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMediaQuery, Button, Menu, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from "axios";
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

    // Dialog Options
    const theme = useTheme();
    // const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    // keep track if request can be submitted
    const firstNameRef = useRef('');
    const lastNameRef = useRef('');
    const emailRef = useRef('');
    const phoneRef = useRef('');
    const billingRef = useRef('');

    // for determining which form is not filled
    const [incorrectFormIndex, setIncorrectFormIndex] = useState(99);
    const [vehicleTypes, setVehicleTypes] = useState(new Map());

    // when true, displays offer info
    const [submitClicked, setSubmitClicked] = useState(false);
    const [onSubmitMessage, setOnSubmitMessage] = useState('');
    const navigate = useNavigate();

    // temporary things for car selection menu - Rainer
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedCarType, setSelectedCarType] = useState(quoteInfo.bodyType || '3door');
    const [anchorEl, setAnchorEl] = useState(null);

    // for getting the array of broken windows
    const [selectedBrokenWindows, setSelectedBrokenWindows] = useState([]);
    const brokenWindowsToCustomer = (windows) => {
        setSelectedBrokenWindows(windows);
    }
    // preselect broken windows if editing quote
    const [brokenWindowsToComponent, setBrokenWindowsToComponent] = useState([]);

    function handleMenuClick(event) { 
        setMenuOpen(!menuOpen);
        setAnchorEl(event.currentTarget)
    }
    
    function handleCarSelect(carClicked) {
        setSelectedCarType(carClicked);
        setMenuOpen(false);
        setSelectedBrokenWindows([]);
        setBrokenWindowsToComponent([]);
        sessionStorage.setItem('askedTinted', JSON.stringify(false));
    }

    function handleMenuClose() {
        setMenuOpen(false);
        setAnchorEl(null);
    }

    // functions for checking if necessary fields are filled and enable submit request
    function checkIfFilled(ref, errorMsg, formIndex) {
        if (ref.current.value === '') {
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
    //saving quote data logics
    function saveQuotes(quoteData) {
        console.log(quoteData);
        //qdata_in
        let body = {
            action: "qdata_in",
            reg_number: quoteData.registration.toUpperCase(),
            phone:quoteData.number,
            firstName:quoteData.firstName,
            lastName:quoteData.lastName,
            postal:quoteData.address,
            email:quoteData.email,
            reg_year:vehicleRegYear,
            make:vehicleMake,
            body_type:vehicleBodyType,
            model:vehicleModel,
            model_year:vehicleModelYear,
            glass_names:JSON.stringify(quoteData.windows)
        };
        // : emailRef.current.value,
        //         : billingAddressVal,
        //         windows: selectedBrokenWindows,
        //         registration: (licenseRef || quoteInfo.registration),
        //         : selectedCarType
        trackPromise(
            axios
            .post("https://fix.glass/odoo_apis/stag_call.php", body, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            .then(function(response) {

                console.log(response);
                console.log('response');
                console.log(body);
                if(response.data.hasOwnProperty("QuoteID")){
                    navigate('/react/quote/' + response.data.QuoteID);
                }
                
            })
            .catch(function(error) {
                console.log(error);
                //getAddress("No Data Found! Error in Address API .");
            })
        );
    }
    function handleSubmitClick() {
        const firstNameNotFilled = checkIfFilled(firstNameRef, 'First name not filled', 0);
        const lastNameNotFilled = checkIfFilled(lastNameRef, 'Last name not filled', 1);
        const emailNotFilled = checkIfFilled(emailRef, 'Email not filled', 2);
        const phoneNotFilled = checkIfFilled(phoneRef, 'Phone number not filled', 3);
        const billingNotFilled = checkIfFilled(billingRef, 'Postal code not filled', 4);

        const windowNotFilled = checkIfSelected();

        // enable submit request if all form fields are filled (more conditions can be added)
        if (firstNameNotFilled || lastNameNotFilled || emailNotFilled || phoneNotFilled || billingNotFilled || windowNotFilled) {
            return;
        } else {
            setSubmitClicked(true);
        }
    }

    function getVehicleDetails(searchValue) {
        let body = {
            action : 'search_uk_reg',
            reg_number: searchValue
        };
        trackPromise(
            axios
            .post("https://fix.glass/odoo_apis/odoo_api_estglass.php", body, {
                withCredentials: false,
                headers: { 'Access-Control-Allow-Origin': '*', "Content-Type": "multipart/form-data" }
            })
            .then(function(response) {
                if(response.data){
                    console.log(response);
                    // let vehicleDataObj = JSON.parse(response.data);
                    let vehicleDataObj = response.data;
                    if(vehicleDataObj.hasOwnProperty("CarData")){
                        console.log("Vehicle Class in OBJ:" + vehicleDataObj.CarData.Response.DataItems.SmmtDetails.BodyStyle);
                        if(vehicleTypes.has(vehicleDataObj.CarData.Response.DataItems.SmmtDetails.BodyStyle.toUpperCase())){
                            console.log("Found Vehicle Type:" + vehicleTypes.get(vehicleDataObj.CarData.Response.DataItems.SmmtDetails.BodyStyle));
                            if(vehicleDataObj.CarData.Response.DataItems.SmmtDetails.BodyStyle.toUpperCase() == "HATCHBACK"){
                                if(vehicleDataObj.CarData.Response.DataItems.VehicleRegistration.DoorPlanLiteral.includes("3")){
                                    // 3 Door Hatchback
                                    setSelectedCarType('3door');
                                } else if(vehicleDataObj.CarData.Response.DataItems.VehicleRegistration.DoorPlanLiteral.includes("5")){
                                    // 5 Door Hatchback
                                    setSelectedCarType('5door');
                                } else {
                                    setSelectedCarType(vehicleTypes.get(vehicleDataObj.CarData.Response.DataItems.SmmtDetails.BodyStyle.toUpperCase()));
                                }
                            } else if(vehicleDataObj.CarData.Response.DataItems.SmmtDetails.BodyStyle.toUpperCase() == "COUPE"){
                                if(vehicleDataObj.CarData.Response.DataItems.SmmtDetails.NumberOfDoors == 4 || vehicleDataObj.CarData.Response.DataItems.SmmtDetails.NumberOfDoors == 5){  //vehicleDataObj.CarData.Response.DataItems.VehicleRegistration.DoorPlanLiteral.toUpperCase() == "COUPE" && 
                                    // Coupe with 4 or 5 Doors is Sedan
                                    setSelectedCarType('sedan');
                                } else {
                                    setSelectedCarType(vehicleTypes.get(vehicleDataObj.CarData.Response.DataItems.SmmtDetails.BodyStyle.toUpperCase()));
                                }
                            } else {
                                setSelectedCarType(vehicleTypes.get(vehicleDataObj.CarData.Response.DataItems.SmmtDetails.BodyStyle.toUpperCase()));
                            }
                            setVehicleData(JSON.stringify(response.data, undefined, 4));
                            setVehicleMakeModel(vehicleDataObj.CarData.Response.DataItems.VehicleRegistration.MakeModel);
                            setVehicleMake(vehicleDataObj.CarData.Response.DataItems.VehicleRegistration.Make);
                            setVehicleModel(vehicleDataObj.CarData.Response.DataItems.VehicleRegistration.Model);
                            setVehicleModelYear(vehicleDataObj.CarData.Response.DataItems.VehicleRegistration.YearOfManufacture);
                            setVehicleRegYear(vehicleDataObj.CarData.Response.DataItems.VehicleRegistration.YearMonthFirstRegistered.slice(0, 4));
                            setVehicleBodyType(vehicleDataObj.CarData.Response.DataItems.SmmtDetails.BodyStyle.toUpperCase());
                        } else {
                            setVehicleData("Error in Data! "+JSON.stringify(response.data, undefined, 4));
                        }
                    } else {
                        setVehicleData("No Data Found!");
                    }
                }
            })
            .catch(function(error) {
                console.log(error);
                setVehicleData("No Data Found! Error in API.");
            })
        );
    }

    useEffect(() => {
        
        ///////////////////////////////////////////
        // Get Vehicle Data if Registration Number is found
        ///////////////////////////////////////////

        if(licenseSearchVal){
            setLicense(licenseSearchVal.toUpperCase());
            getVehicleDetails(licenseSearchVal);
        }
        // scroll car into view on page load
        // if (!submitClicked) {
        //     const windowSelector = document.getElementById("scroll-focus");
        //     windowSelector.scrollIntoView();
        // } 
        // necessary incase returning from quote page navbar would not load unless the page is refreshed
        document.getElementById("navbar-main").style.display = "inline";
        document.getElementById("footer-main").style.display = "inline";

        ///////////////////////////////////////////
        // Adding necessary data for Vehicle Types
        ///////////////////////////////////////////

        const v3HTypes = ["Car Derived Van", "Hatchback"];
        const v5HTypes = ["Hatchback"];
        const v5ETypes = ["Estate", "Light 4X4 Utility", "MPV", "SUV Convertible", "SUV Coupe", "SUV Estate", "SUV Hatchback", "SUV Saloon", "Taxi Cab", "TOURING", "Tower Wagon", "Van Derived Car"];
        const v4STypes = ["COMPETITION", "Saloon"];
        const v2CTypes = ["Convertible", "Coupe"];
        const v1VTypes = ["Ambulance", "Box Van", "Car Transporter", "Chassis Cab", "Chassis Cowl", "Insulated Van", "Luton Van", "Minibus", "Motor Caravan", "Panel Van", "Pick Up", "Specially Fitted Van", "Tipper", "Window Van", "LCV"];
        // const vehicleTypesData = new Map();

        v3HTypes.forEach(type => {
        vehicleTypes.set(type.toUpperCase(), "3door");
        });
        v5HTypes.forEach(type => {
        vehicleTypes.set(type.toUpperCase(), "5door");
        });
        v5ETypes.forEach(type => {
        vehicleTypes.set(type.toUpperCase(), "estate");
        });
        v4STypes.forEach(type => {
        vehicleTypes.set(type.toUpperCase(), "sedan");
        });
        v2CTypes.forEach(type => {
        vehicleTypes.set(type.toUpperCase(), "coupe");
        });
        v1VTypes.forEach(type => {
        vehicleTypes.set(type.toUpperCase(), "van");
        });
        // setVehicleTypes(vehicleTypesData);

        ///////////////////////////////////////////
        // Integration of PostalCode/ Address AutoComplete API
        ///////////////////////////////////////////
        autocomplete("billingAddress","SFB4ZD1fO0ONndTgHnmUmg26020", {
            delay: 500,
        });

        ///////////////////////////////////////////
        // Preventing Default to show complete address with Postal Code
        ///////////////////////////////////////////
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

    console.log(brokenWindowsToComponent);
    console.log(quoteInfo);

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
        // search for license plate
        if(inputInterval.current)
        {
            clearTimeout(inputInterval.current);
        }
        inputInterval.current=setTimeout(function(){
            console.log("Search");
            console.log("Input Changed Called!");
            getVehicleDetails(data);
        },1000);
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
                        <Button 
                            color='secondary' 
                            id='basic-button'
                            aria-controls={menuOpen ? 'basic-menu' : undefined}
                            aria-haspopup='true'
                            aria-expanded={menuOpen ? 'true' : undefined}
                            onClick={handleMenuClick}>
                                change car body type (temporary)
                        </Button>
                        <Menu
                            id='basic-menu'
                            anchorEl={anchorEl}
                            open={menuOpen}
                            onClose={handleMenuClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                            >
                                <MenuItem onClick={() => handleCarSelect('coupe')}>Coupe</MenuItem>
                                <MenuItem onClick={() => handleCarSelect('3door')}>3 Door Hatchback</MenuItem>
                                <MenuItem onClick={() => handleCarSelect('5door')}>5 Door Hatchback</MenuItem>
                                <MenuItem onClick={() => handleCarSelect('estate')}>Estate</MenuItem>
                                <MenuItem onClick={() => handleCarSelect('sedan')}>Sedan</MenuItem>
                                <MenuItem onClick={() => handleCarSelect('van')}>VAN</MenuItem>
                        </Menu>
                            
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
