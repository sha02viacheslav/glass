import React from 'react'

const Pricing = () => {
    return (
        <div>
            <section className="sec-banner-p">
                <div className="container">
                    <h1 className="main-heading text-white">Our Pricing </h1>
                    <p className="content-s text-white">Amet minim mollit non deserunt ullamco est sit aliqua dolor </p>
                </div>
            </section>
            <section className="sec-plan section">
                <div className="container">
                    <p className="title-ls mb-md-5">Choose the vehicle type</p>
                    <div className="pricing-box pt-md-5 py-4">

                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-8">

                                <div className="radio-buttonss d-flex justify-content-between">
                                    <label className="position-relative">
                                        <input type="radio" className="option-input radio" name="example" defaultChecked />
                                        <span className="link-txt">$120</span>
                                    </label>
                                    <label className="position-relative">
                                        <input type="radio" className="option-input radio" name="example" />
                                        <span className="link-txt">$500</span>
                                    </label>
                                    <label className="position-relative">
                                        <input type="radio" className="option-input radio" name="example" />
                                        <span className="link-txt">$1000</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="tab-content pt-md-5 tab-price">
                            <div className="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab">

                                <div className="row gx-md-5">
                                    <div className="col-md-4 ">
                                        <div className="px-4">
                                            <h3 className="text-blue">Insurance</h3>
                                            <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitatt sunt  amet.</p>
                                            <ul className="list-unstyled list-price mb-4">
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Lorem ipsum dolor sit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Amet venim irure alue consectetur</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Anime euismod ullamco quis nostrud</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Consectetur sint exercitat mollit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Duis aute deserunt velit</li>
                                            </ul>
                                            <h5 className="text-blue text-center mb-4">from $69 / month</h5>
                                            <a href="#" className="btn btn-et w-100">Choose the Plan</a>
                                        </div>
                                    </div>

                                    <div className="col-md-4 border-lr">
                                        <div className="px-4">
                                            <h3 className="text-blue">Insurance</h3>
                                            <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitatt sunt  amet.</p>
                                            <ul className="list-unstyled list-price mb-4">
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Anime euismod ullamco quis nostrud</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Consectetur sint exercitat mollit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Duis aute deserunt velit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Lorem ipsum dolor sit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Amet venim irure alue consectetur</li>
                                            </ul>
                                            <h5 className="text-blue text-center mb-4">from $0 / month</h5>
                                            <a href="#" className="btn btn-et w-100">Choose the Plan</a>
                                        </div>
                                    </div>

                                    <div className="col-md-4 ">
                                        <div className="px-4">
                                            <h3 className="text-blue">Single Payment</h3>
                                            <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitatt sunt  amet.</p>
                                            <ul className="list-unstyled list-price mb-4">
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Duis aute deserunt velit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Lorem ipsum dolor sit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Amet venim irure alue consectetur</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Anime euismod ullamco quis nostrud</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Consectetur sint exercitat mollit</li>

                                            </ul>
                                            <h5 className="text-blue text-center mb-4">from $360 / month</h5>
                                            <a href="#" className="btn btn-et w-100">Choose the Plan</a>
                                        </div>
                                    </div>


                                </div>


                            </div>
                            <div className="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab">

                                <div className="row gx-md-5">
                                    <div className="col-md-4 ">
                                        <div className="px-4">
                                            <h3 className="text-blue">Insurance</h3>
                                            <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitatt sunt  amet.</p>
                                            <ul className="list-unstyled list-price mb-4">
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Lorem ipsum dolor sit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Amet venim irure alue consectetur</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Anime euismod ullamco quis nostrud</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Consectetur sint exercitat mollit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Duis aute deserunt velit</li>
                                            </ul>
                                            <h5 className="text-blue text-center mb-4">from $69 / month</h5>
                                            <a href="#" className="btn btn-et w-100">Choose the Plan</a>
                                        </div>
                                    </div>

                                    <div className="col-md-4 border-lr">
                                        <div className="px-4">
                                            <h3 className="text-blue">Insurance</h3>
                                            <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitatt sunt  amet.</p>
                                            <ul className="list-unstyled list-price mb-4">
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Anime euismod ullamco quis nostrud</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Consectetur sint exercitat mollit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Duis aute deserunt velit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Lorem ipsum dolor sit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Amet venim irure alue consectetur</li>
                                            </ul>
                                            <h5 className="text-blue text-center mb-4">from $0 / month</h5>
                                            <a href="#" className="btn btn-et w-100">Choose the Plan</a>
                                        </div>
                                    </div>

                                    <div className="col-md-4 ">
                                        <div className="px-4">
                                            <h3 className="text-blue">Single Payment</h3>
                                            <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitatt sunt  amet.</p>
                                            <ul className="list-unstyled list-price mb-4">
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Duis aute deserunt velit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Lorem ipsum dolor sit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Amet venim irure alue consectetur</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Anime euismod ullamco quis nostrud</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Consectetur sint exercitat mollit</li>

                                            </ul>
                                            <h5 className="text-blue text-center mb-4">from $360 / month</h5>
                                            <a href="#" className="btn btn-et w-100">Choose the Plan</a>
                                        </div>
                                    </div>


                                </div>

                            </div>
                            <div className="tab-pane" id="messages" role="tabpanel" aria-labelledby="messages-tab">

                                <div className="row gx-md-5">
                                    <div className="col-md-4 ">
                                        <div className="px-4">
                                            <h3 className="text-blue">Insurance</h3>
                                            <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitatt sunt  amet.</p>
                                            <ul className="list-unstyled list-price mb-4">
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Lorem ipsum dolor sit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Amet venim irure alue consectetur</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Anime euismod ullamco quis nostrud</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Consectetur sint exercitat mollit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Duis aute deserunt velit</li>
                                            </ul>
                                            <h5 className="text-blue text-center mb-4">from $69 / month</h5>
                                            <a href="#" className="btn btn-et w-100">Choose the Plan</a>
                                        </div>
                                    </div>

                                    <div className="col-md-4 border-lr">
                                        <div className="px-4">
                                            <h3 className="text-blue">Insurance</h3>
                                            <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitatt sunt  amet.</p>
                                            <ul className="list-unstyled list-price mb-4">
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Anime euismod ullamco quis nostrud</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Consectetur sint exercitat mollit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Duis aute deserunt velit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Lorem ipsum dolor sit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Amet venim irure alue consectetur</li>
                                            </ul>
                                            <h5 className="text-blue text-center mb-4">from $0 / month</h5>
                                            <a href="#" className="btn btn-et w-100">Choose the Plan</a>
                                        </div>
                                    </div>

                                    <div className="col-md-4 ">
                                        <div className="px-4">
                                            <h3 className="text-blue">Single Payment</h3>
                                            <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitatt sunt  amet.</p>
                                            <ul className="list-unstyled list-price mb-4">
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Duis aute deserunt velit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Lorem ipsum dolor sit</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Amet venim irure alue consectetur</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Anime euismod ullamco quis nostrud</li>
                                                <li><img src={process.env.PUBLIC_URL +"/img/check.svg"} className="img-fluid me-3" alt="" />Consectetur sint exercitat mollit</li>

                                            </ul>
                                            <h5 className="text-blue text-center mb-4">from $360 / month</h5>
                                            <a href="#" className="btn btn-et w-100">Choose the Plan</a>
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

export default Pricing
