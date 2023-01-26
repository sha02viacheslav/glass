import {useRef, useState} from 'react'
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import flag from '../components/icons/uk-flag.png';

const Home = () => {
    const [licenseNum, setLicenseNum] = useState('');
    const navigate = useNavigate();
    const licenseRef = useRef();

    function patternMatch() {
        licenseRef.current.value = licenseRef.current.value.toUpperCase();
        // check if license plate is standard or unique
        if (licenseRef.current.value.length >= 3) {
            if (Number.isInteger(Number(licenseRef.current.value.charAt(2)))) {
                // license number is standard
                // check if plate already includes space
                if (licenseRef.current.value.charAt(4) === ' ') {
                    return;
                } else if (licenseRef.current.value.length === 7) {
                    let input = licenseRef.current.value;
                    input = input.slice(0,4) + ' ' + input.slice(4);
                    licenseRef.current.value = input;
                }
            }
        }
    }
    
    function directToCustomer() {
        navigate("/react/customer/"+licenseRef.current.value.toUpperCase());
    }

    return (
        <div>
            <section className="sec-banner-s1 my-4 my-md-5">
                <div className="container">
                    <div className="banner-s1 position-relative">
                        <img src={process.env.PUBLIC_URL +"/img/bg-s1.png"} className="img-fluid hp-quote-bg-img" alt="" />
                        <div className="license-input-container">
                            {/* <input ref={licenseRef} type="text" className="form-control" placeholder="Reg. Number" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={handleVehInputChange}/> */}
                            <div className="yellow-box-home" key={licenseNum}>
                                <div className="blue-box">
                                    <img className='flag' src={flag} alt="" />
                                    <div className='gb'>UK</div>
                                </div>
                                {/* <input className='license-input' type="text" value={quoteDetails.registration_number} placeholder='Reg. Number'/> */}
                                <input ref={licenseRef} className='license-input' type="text" defaultValue={licenseNum} placeholder='NU71 REG' onChange={patternMatch} maxLength='8'/>
                            </div>
                            <span className="input-group-text" id="basic-addon2">
                                <Button
                                    onClick={directToCustomer}>
                                    Get a Quote
                                </Button>
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
