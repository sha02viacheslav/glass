import {useRef, useState} from 'react'
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    // const licenseRef = useRef();
    // const [licenseRef, setLicense] = useState('');
    // const handleChange = (event) => {
    //     console.log(event.target.value);
    //     setLicense(event.target.value);
    // };
    const navigate = useNavigate();
    const licenseRef = useRef();

    function directToCustomer() {
        navigate("/react/customer/"+licenseRef.current.value.toUpperCase());
    }

    function handleVehInputChange(event){
        event.target.value = event.target.value.toUpperCase();
    }

    return (
        <div>
            <section className="sec-banner-s1 my-4 my-md-5">
                <div className="container">
                    <div className="banner-s1 position-relative">
                        <img src={process.env.PUBLIC_URL +"/img/bg-s1.png"} className="img-fluid hp-quote-bg-img" alt="" />
                        <div className="s-content">
                            {/* <h1 className="title-s text-white">We make sure you get <span className="d-lg-block">
                                the right glass for your vehicle.</span> </h1> */}
                            <div className="row mt-md-5 mt-4">
                                <div className="hp-reg-form-container">
                                    <div className="input-group mb-3">
                                        <input ref={licenseRef} type="text" className="form-control" placeholder="Reg. Number" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={handleVehInputChange}/>
                                        <span className="input-group-text" id="basic-addon2">
                                            <Button
                                                onClick={directToCustomer}
                                            >
                                                Get a Quote
                                            </Button>
                                        </span>
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

export default Home
