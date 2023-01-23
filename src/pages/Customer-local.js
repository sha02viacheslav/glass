import { useState, React, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import { StickyContainer, Sticky } from 'react-sticky';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Dialog, DialogTitle, DialogContent, useMediaQuery, TextField, IconButton, Box, Button, Menu, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// import all car components for window-selection
import ThreeDoorHatch from '../components/window-selection/3_Door_Hatch';
import FiveDoorHatch from '../components/window-selection/5_Door_Hatch';
import Coupe from '../components/window-selection/Coupe';
import Estate from '../components/window-selection/Estate';
import Sedan from '../components/window-selection/Sedan';
import VanBarnDoor from '../components/window-selection/VAN_Barn_door';
import VanTailgater from '../components/window-selection/VAN_Tailgater';

import axios from "axios";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };
const Customer = () => {

    const {licenseRef} = useParams();

    const [selectedDate, handleDateChange] = useState(new Date());

    // Dialog Options
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [postalAddressOptions, setAddress] = useState();

    // temporary things for car selection menu - Rainer
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedCarType, setSelectedCarType] = useState('3door');
    const [anchorEl, setAnchorEl] = useState(null);

    function handleMenuClick(event) {
        setMenuOpen(!menuOpen);
        setAnchorEl(event.currentTarget)
    }
    
    function handleCarSelect(carClicked) {
        setSelectedCarType(carClicked);
        setMenuOpen(false);
    }

    function handleMenuClose() {
        setMenuOpen(false);
        setAnchorEl(null);
    }


    function getVehicleDetails() {
        // With all properties
        let body = {
            action : 'search',
            reg_number: licenseRef
        };
        axios
        .post("https://estglass.co.uk/form_latest/odoo_api_estglass.php", body)
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
    }
    // handleOnInputChange = ()=>{
    //     alert("")
    // };

    // const handleOnInputChange = async () => {
    //     const response = await fetch(
    //       "https://jsonplaceholder.typicode.com/todos/"
    //     ).then((response) => response.json());
      
    //     // update the state
    //     setAddress(response);
    //   };

    useEffect(() => {
        getVehicleDetails();
    });

    // getVehicleDetails();
    return (
        <div>
        <StickyContainer>

        
            <section className="sec-customer my-4 my-md-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 mx-auto">
                            <ul className="nav nav-tabs justify-content-center tab-cust nav-justified" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Customer</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Pay & Book</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="tab-content py-5" id="myTabContent">
                        <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                <Typography align='center' margin={2} zIndex={150}>
                                    <Sticky>
                                        {({
                                            style,
                                            // the following are also available but unused here
                                            isSticky,
                                            wasSticky,
                                            distanceFromTop,
                                            distanceFromBottom,
                                            calculatedHeight
                                        }) => (
                                            <Button style={style} color={'primary'} variant="contained" endIcon={<SendIcon />} onClick={handleOpen}>
                                                Submit Request
                                            </Button>
                                        )}
                                    </Sticky>
                                </Typography>
                                <Dialog
                                // fullScreen={fullScreen}
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                    style={customStyles}
                                >
                                    <DialogTitle margin={2}>
                                    <Box display="flex" alignItems="center">
                                        <Box flexGrow={1} >Booking Preferences</Box>
                                        <Box>
                                            <IconButton onClick={handleClose}>
                                                <CloseIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    </DialogTitle>
                                    <DialogContent margin={2}>
                                        <div className="row m-2">
                                            <div className="col-md-12 mt-2">
                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                        <DateTimePicker
                                                            margin={2}
                                                            label="Select Booking Date&Time"
                                                            minDate={new Date()}
                                                            maxDate={new Date().setDate(new Date().getDate() + 7)}
                                                            minutesStep={5}
                                                            minTime={new Date(0, 0, 0, 8)}
                                                            maxTime={new Date(0, 0, 0, 18, 45)}
                                                            value={selectedDate}
                                                            onChange={handleDateChange}
                                                            renderInput={(params) => <TextField margin='normal' {...params} />}
                                                        />
                                                    </LocalizationProvider>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            <div className="row">
                                <div className="col-md-4 mx-auto">
                                    <div className="car-code d-flex justify-content-between align-items-center">
                                        <div className="code-state me-5">
                                            <ul className="list-inline d-flex align-items-center">
                                                <li className="list-inline-item state-bg">
                                                    <svg width="20" height="100%" className="mb-0" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g clip-path="url(#clip0_870_5075)">
                                                            <path d="M0 0H10V7H0V0Z" fill="#012169" />
                                                            <path d="M1.17188 0L4.98438 2.63958L8.78125 0H10V0.904167L6.25 3.51458L10 6.11042V7H8.75L5 4.38958L1.26562 7H0V6.125L3.73438 3.52917L0 0.933333V0H1.17188Z" fill="white" />
                                                            <path d="M6.625 4.09792L10 6.41667V7L5.76562 4.09792H6.625ZM3.75 4.38958L3.84375 4.9L0.84375 7H0L3.75 4.38958ZM10 0V0.04375L6.10938 2.78542L6.14062 2.14375L9.21875 0H10ZM0 0L3.73438 2.56667H2.79688L0 0.6125V0Z" fill="#C8102E" />
                                                            <path d="M3.76562 0V7H6.26562V0H3.76562ZM0 2.33333V4.66667H10V2.33333H0Z" fill="white" />
                                                            <path d="M0 2.81458V4.21458H10V2.81458H0ZM4.26562 0V7H5.76562V0H4.26562Z" fill="#C8102E" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_870_5075">
                                                                <rect width="10" height="7" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                    <p className="mb-0 text-white">GB</p>
                                                </li>
                                                <li className="list-inline-item code-content">

                                                    <input type="text" className="form-control" placeholder=" AB72 CDE" value={licenseRef} />
                                                </li>
                                            </ul>
                                            <p className="fw-500 mb-0 ms-2"><img src={process.env.PUBLIC_URL + "/img/car-sv.svg"} className="img-fluid me-2" alt="" /> Peugeot 208</p>
                                        </div>
                                        {/* temporary solution here */}
                                        <Button 
                                            color='secondary' 
                                            id='basic-button'
                                            aria-controls={menuOpen ? 'basic-menu' : undefined}
                                            aria-haspopup='true'
                                            aria-expanded={menuOpen ? 'true' : undefined}
                                            onClick={handleMenuClick}>
                                                EDIT
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
                                                <MenuItem onClick={() => handleCarSelect('barn')}>VAN Barn Door</MenuItem>
                                                <MenuItem onClick={() => handleCarSelect('tailgater')}>VAN Tailgater</MenuItem>
                                        </Menu>
                                        {/* <p className="mb-0">  <a href="#" className="text-purple text-decoration-none">EDIT</a></p> */}
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4 mt-md-5 text-center">
                                
                                <div className="col-md-9 mx-auto">
                                    <h2 className="text-blue  text-24">Select Broken Glasses</h2>
                                    <p>Select or tap directly </p>
                                    <div className="btns my-4">
                                        <a href="#" className="btn btn-gray">Front Windscreen</a>
                                        <a href="#" className="btn btn-gray">Rear Windscreen</a>
                                        <a href="#" className="btn btn-gray">Front Door RX</a>
                                        <a href="#" className="btn btn-gray">Front Door SX</a>
                                        <a href="#" className="btn btn-gray">Rear Door Quarter SX</a>
                                        <a href="#" className="btn btn-gray">Front Door Quarter RX</a>
                                        <a href="#" className="btn btn-gray">Front Door Quarter SX</a>
                                        <a href="#" className="btn btn-gray">Rear Door RX</a>
                                        <a href="#" className="btn btn-gray">Rear Door SX</a>
                                        <a href="#" className="btn btn-gray">Rear Door Quarter RX</a>
                                    </div>
                                    <div className="parent">
                                        {/* car image display */}
                                        {selectedCarType === '3door' && <ThreeDoorHatch />}
                                        {selectedCarType === '5door' && <FiveDoorHatch />}
                                        {selectedCarType === 'coupe' && <Coupe />}
                                        {selectedCarType === 'estate' && <Estate />}
                                        {selectedCarType === 'sedan' && <Sedan />}
                                        {selectedCarType === 'barn' && <VanBarnDoor />}
                                        {selectedCarType === 'tailgater' && <VanTailgater />}
                                        {/* <div className="img-carmain position-relative my-md-5 my-4">
                                            <img src={process.env.PUBLIC_URL + "/img/final-car.png"} className="img-fluid d-block mx-auto" alt="" />
                                        </div> */}
                                        <p className="fs-18 text-blue">Your comments (optional)</p>
                                        <div className="form-group mb-4">
                                            <textarea name="" id="" rows="4" className="form-control h-auto" placeholder="Lorem ipsum dolor sit.."></textarea>
                                        </div>
                                        {/* <a href="#" className="btn btn-purple">Add Pictures</a> */}
                                        <Button variant="contained" color="secondary">Add Pictures</Button>
                                        <small className="d-block mt-2">*Recommended</small>
                                        <form action="" className="form-car my-md-5 my-4">
                                            <p className="fs-18 text-blue">Fill your personal details</p>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-4">
                                                        <input type="text" className="form-control" placeholder="First Name" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-4">
                                                        <input type="text" className="form-control" placeholder="Last name" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-4">
                                                        <input type="text" className="form-control" placeholder="Email" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-4">
                                                        <input type="text" className="form-control" placeholder="Phone" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-4">
                                                        <input type="text" className="form-control" placeholder="Postal Code" />
                                                    </div>
                                                </div>
                                            </div>

                                        </form>
                                    </div>
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
                        <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <div className="row">
                                <div className="col-md-4 mx-auto">
                                    <div className="car-code d-flex justify-content-between align-items-center">
                                        <div className="code-state me-5">
                                            <ul className="list-inline d-flex align-items-center">
                                                <li className="list-inline-item state-bg">
                                                    <svg width="20" height="100%" className="mb-0" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g clip-path="url(#clip0_870_5075)">
                                                            <path d="M0 0H10V7H0V0Z" fill="#012169"></path>
                                                            <path d="M1.17188 0L4.98438 2.63958L8.78125 0H10V0.904167L6.25 3.51458L10 6.11042V7H8.75L5 4.38958L1.26562 7H0V6.125L3.73438 3.52917L0 0.933333V0H1.17188Z" fill="white"></path>
                                                            <path d="M6.625 4.09792L10 6.41667V7L5.76562 4.09792H6.625ZM3.75 4.38958L3.84375 4.9L0.84375 7H0L3.75 4.38958ZM10 0V0.04375L6.10938 2.78542L6.14062 2.14375L9.21875 0H10ZM0 0L3.73438 2.56667H2.79688L0 0.6125V0Z" fill="#C8102E"></path>
                                                            <path d="M3.76562 0V7H6.26562V0H3.76562ZM0 2.33333V4.66667H10V2.33333H0Z" fill="white"></path>
                                                            <path d="M0 2.81458V4.21458H10V2.81458H0ZM4.26562 0V7H5.76562V0H4.26562Z" fill="#C8102E"></path>
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_870_5075">
                                                                <rect width="10" height="7" fill="white"></rect>
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                    <p className="mb-0 text-white">GB</p>
                                                </li>
                                                <li className="list-inline-item code-content">
                                                    <input type="text" className="form-control" placeholder=" AB72 CDE" />
                                                </li>
                                            </ul>
                                            <p className="fw-500 mb-0 ms-2"><img src={process.env.PUBLIC_URL + "/img/car-sv.svg"} className="img-fluid me-2" alt="" /> Peugeot 208</p>

                                        </div>
                                        <p className="mb-0">  <a href="#" className="text-purple text-decoration-none">EDIT</a></p>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-8 mx-auto">


                                    





                                    <div className="car-payment sel-ofr text-center my-md-5 my-4">
                                        <h3 className="text-24 text-blue mb-4">Select Offer</h3>


                                        <ul className="nav nav-pills  mb-3 justify-content-center mb-4" id="pills-tab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link active" id="pills-oem-tab" data-bs-toggle="pill" data-bs-target="#pills-oem" type="button" role="tab" aria-controls="pills-oem" aria-selected="true">
                                                    OEM Original Part
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="pills-arg-tab" data-bs-toggle="pill" data-bs-target="#pills-arg" type="button" role="tab" aria-controls="pills-arg" aria-selected="false">
                                                    ARG Aftermarket Part
                                                </button>
                                            </li>
                                        </ul>

                                        <div className="row gx-2">
                                            <div className="col-md-6">
                                                <div className="table-responsive px-2 table-car">
                                                    <table className="table table-striped">
                                                        <tbody>
                                                            <tr>
                                                                <th>Color<svg width="24" className="ms-2" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z" fill="#9557E8" />
                                                                    <path d="M11 11H13V17H11V11ZM11 7H13V9H11V7Z" fill="#9557E8" />
                                                                </svg>
                                                                </th>
                                                                <td className="text-center"><a className="btn btn-mini">Green tint</a></td>
                                                            </tr>
                                                            <tr>
                                                                <th>Rain Sensor </th>
                                                                <td className="text-center"><a className="btn btn-mini">Yes</a></td>
                                                            </tr>
                                                            <tr>
                                                                <th>Heating </th>
                                                                <td className="text-center"><a className="btn btn-mini-gray">No</a></td>
                                                            </tr>
                                                            <tr>
                                                                <th>Quality </th>
                                                                <td className="text-center"><a className="btn btn-mini">High</a></td>
                                                            </tr>
                                                            <tr>
                                                                <th>
                                                                    Brand Logo <svg width="24" className="ms-2" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z" fill="#9557E8" />
                                                                        <path d="M11 11H13V17H11V11ZM11 7H13V9H11V7Z" fill="#9557E8" />
                                                                    </svg>
                                                                </th>
                                                                <td className="text-center"><a className="btn btn-mini">Yes</a></td>


                                                            </tr>



                                                            <tr>
                                                                <th>Claim new
                                                                    wipers </th>
                                                                <td className="text-center">
                                                                    <div className="car-check form-check">
                                                                        <label className="form-check-label" for="flexCheckChecked">
                                                                            Value £35 as free
                                                                        </label>
                                                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked />

                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th className="border-bottom-0">
                                                                    TOTAL PRICE
                                                                </th>
                                                                <td className="border-bottom-0"><p className="mb-0 text-purple fs-18 fw-500">£410</p></td>


                                                            </tr>


                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>


                                            <div className="col-md-6 border-left border-light">
                                                <div className="table-responsive px-2 table-car">
                                                    <table className="table table-striped">
                                                        <tbody>
                                                            <tr>
                                                                {/* <th>Color<svg width="24" className="ms-2" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z" fill="#9557E8" />
                                                                    <path d="M11 11H13V17H11V11ZM11 7H13V9H11V7Z" fill="#9557E8" />
                                                                </svg>
                                                                </th> */}

                                                                <td className="text-center"><a className="btn btn-mini-gray disabled">Green tint</a></td>

                                                            </tr>



                                                            <tr>
                                                                {/* <th>Rain Sensor </th> */}

                                                                <td className="text-center"><a className="btn btn-mini-gray disabled">Yes</a></td>

                                                            </tr>
                                                            <tr>
                                                                {/* <th>Heating </th> */}

                                                                <td className="text-center"><a className="btn btn-mini-gray disabled">No</a></td>

                                                            </tr>


                                                            <tr>
                                                                {/* <th>Quality </th> */}

                                                                <td className="text-center"><a className="btn btn-mini-gray disabled">High</a></td>

                                                            </tr>


                                                            <tr>
                                                                {/* <th>
                                                                    Brand Logo <svg width="24" className="ms-2" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z" fill="#9557E8" />
                                                                        <path d="M11 11H13V17H11V11ZM11 7H13V9H11V7Z" fill="#9557E8" />
                                                                    </svg>
                                                                </th> */}

                                                                <td className="text-center"><a className="btn btn-mini-gray disabled">No</a></td>

                                                            </tr>



                                                            <tr>
                                                                {/* <th>Claim new
                                                                    wipers </th> */}

                                                                <td className="text-center"><a className="btn btn-mini-gray disabled">High</a></td>

                                                            </tr>



                                                            <tr>
                                                                {/* <th className="border-bottom-0">
                                                                    TOTAL PRICE
                                                                </th> */}

                                                                <td className="text-center border-bottom-0"><p className="mb-0 text-muted fs-18 fw-500">£180</p></td>

                                                            </tr>


                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>



                                        </div>



                                    </div>

                                    <div className="car-payment text-center my-md-5 my-4">
                                        <h3 className="text-24 text-blue mb-4">Payment method</h3>


                                        <ul className="nav nav-pills  mb-3 justify-content-center mb-4" id="pills-tab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">

                                                    <small className="fs-14">4 month</small>
                                                    <h5>£60</h5>
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">
                                                    <small className="fs-14">Insurance</small>
                                                    <h5>£115</h5>
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">
                                                    <small className="fs-14">Single Pay</small>
                                                    <h5>£410</h5>
                                                </button>
                                            </li>
                                        </ul>


                                        <div className="active tab-pay">
                                            <p className="text-purple mb-2">4-Month</p>
                                            <p className="fs-14">Amet minim mollit non deserunt ullamco est sit est aliqua dolor do amet sint. Velit officia consequat e duis enim velit mollit. Exercitation veniam  onequat sunt nostrud amet</p>
                                        </div>

                                        <div className=" tab-pay">
                                            <p className="text-purple mb-2">Insurance</p>
                                            <p className="fs-14">Amet minim mollit non deserunt ullamco est sit est aliqua dolor do amet sint. Velit officia consequat e duis enim velit mollit. Exercitation veniam  onequat sunt nostrud amet</p>
                                        </div>

                                        <div className=" tab-pay">
                                            <p className="text-purple mb-2">Single Pay</p>
                                            <p className="fs-14">Amet minim mollit non deserunt ullamco est sit est aliqua dolor do amet sint. Velit officia consequat e duis enim velit mollit. Exercitation veniam  onequat sunt nostrud amet</p>
                                        </div>


                                    </div>



                                    <div className="row">
                                        <div className="col-md-7 mx-auto">
                                            <Link to="/react/payment" className="btn btn-purple-radius w-100 mb-3">Accept</Link>
                                            <Link to="/react/customer" className="btn btn-purple-outline w-100 mb-3">Decline</Link>
                                        </div>
                                    </div>




                                </div>
                            </div>




                        </div>
                    </div>
                </div>
            </section>
        </StickyContainer>
        </div>
    )
}

export default Customer
