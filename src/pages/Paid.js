import React from 'react'

const Paid = () => {
    return (
        <div>
            <section className="sec-pay my-md-5 my-4">
                <div className="container">

                    <div className="row">
                        <div className="col-md-8 mx-auto">
                            <div className="d-flex justify-content-between align-items-center mb-4 map-mob">
                                <ul className="list-inline d-flex align-items-center">
                                    <li className="list-item-inline">
                                        <img src={process.env.PUBLIC_URL +"/img/avat.svg"} className="img-fluid me-3" alt="" />
                                    </li>
                                    <li className="list-item-inline">
                                        <span className="fs-18 d-block text-purple">Technician</span>
                                        <p className="mb-0">Arvin Kuldner</p>
                                    </li>
                                </ul>
                                <div className="frame w-400">
                                    <h5 className="text-blue">August 25 2022 <a href="#">
                                        <span className="text-purple fs-14 fw-normal float-end">EDIT BOOKING</span></a></h5>
                                    <p className="mb-0 fs-14">Arriving between <span className="fw-500"> 02:00PM-04:00PM</span> </p>
                                </div>
                            </div>

                            <div className="frame mb-5">
                                <h5 className="text-blue">Location

                                    <a href="#"><span className="text-purple fs-14 fw-normal float-end">EDIT BOOKING</span></a>
                                </h5>
                                <p className="mb-0 fs-14">Arriving between <span className="fw-500"> 02:00PM-04:00PM</span> </p>

                                <div id="map-container-google-1" className="z-depth-1-half map-container mt-4" width="100%" style={{height: 400+"px"}}>
                                    <iframe src="https://maps.google.com/maps?q=manhatan&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" frameBorder="0"
                                        style={{border:0}} allowFullScreen></iframe>
                                </div>


                            </div>
                            <div className="text-center">
                                <p className="text-blue mb-2">Payment status: <span className="text-success"> Paid</span></p>
                                <a href="#" className="text-purple text-decoration-none"><svg width="13" height="14" className="me-2" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.4585 4.75H8.62516V0.25H4.37516V4.75H1.54183L6.50016 10.75L11.4585 4.75ZM0.833496 12.25H12.1668V13.75H0.833496V12.25Z" fill="#9557E8" />
                                </svg>
                                    DOWNLOAD INVOICE</a>
                                <h5 className="text-blue mt-5">Journal</h5>
                                <p className="text-purple mb-0">On our way</p>
                                <small className="fs-12">25 Aug 2022 - 06:28PM</small>
                                <img src={process.env.PUBLIC_URL +"/img/dot-line.svg"} className="img-fluid my-3 d-block mx-auto" alt="" />
                                <p className="text-purple mb-0"> Start </p>
                                <small className="fs-12">  25 Aug 2022 - 06:28PM </small>

                                <img src={process.env.PUBLIC_URL +"/img/set.png"} className="img-fluid my-3 d-block mx-auto" alt="" />
                                <img src={process.env.PUBLIC_URL +"/img/dot-line.svg"} className="img-fluid mb-3" alt="" />
                                <p className="text-purple mb-0"> Job Complete</p>
                                <small className="fs-12">  25 Aug 2022 - 06:28PM </small>
                                <img src={process.env.PUBLIC_URL +"/img/car-c.png"} className="img-fluid my-3 d-block mx-auto" alt="" />
                            </div>


                            <div className="row mt-5">
                                <div className="col-md-7 mx-auto">
                                    <a href="#" className="btn btn-purple-radius w-100 mb-3">Chat with us</a>

                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </section>
        </div>
    )
}

export default Paid
