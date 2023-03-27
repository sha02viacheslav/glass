import React from 'react'

const Contact = () => {
  return (
    <div>
      <section className='map'>
        <div
          id='map-container-google-1'
          className='z-depth-1-half map-container position-relative'
          width='100%'
          style={{ height: 400 + 'px' }}
        >
          <iframe
            src='https://maps.google.com/maps?q=manhatan&t=&z=13&ie=UTF8&iwloc=&output=embed'
            width='100%'
            height='100%'
            frameBorder='0'
            style={{ border: 0 }}
            allowFullScreen
          ></iframe>
          <h2 className='contact bg-purple text-white'>Contact Us</h2>
        </div>
      </section>

      <section className='sec-form section'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-8'>
              <h2 className='text-blue'>We&apos;re available for you 24/7</h2>
              <p className='main-content mt-3 mb-4'>
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit offici liqua conti.
              </p>
              <div className='row'>
                <div className='col-md-6'>
                  <h5 className='text-blue fw-normal mt-mob-h'>Headquarter</h5>
                  <p>
                    Estglass Ltd.
                    <br />
                    Main Ave, Enfield EN1 1GD, <br />
                    United Kingdom
                  </p>
                </div>
                <div className='col-md-6'>
                  <h5 className='text-blue fw-normal call-txt'>Call us or write an email</h5>
                  <p className='mb-0'>
                    {' '}
                    <a href='#' className='text-gray text-decoration-none'>
                      +44 772 345 1616
                    </a>
                  </p>
                  <a href='#' className='text-gray text-decoration-none'>
                    contact@estglass.co.uk
                  </a>
                </div>
              </div>
            </div>

            <div className='col-md-4 mt-4 mt-md-0'>
              <h2 className='text-blue'>Quick quote</h2>
              <p className='main-content mt-3 mb-4'>Enter your name and phone and we will call you back in 1 hour.</p>
              <form action='' className='pt-4 pt-md-0'>
                <div className='form-group position-relative mb-4'>
                  {/* <label className="form-label">Your Name</label> */}
                  <input type='text' className='form-control cool' placeholder='Your Name' />
                </div>
                <div className='form-group position-relative mb-4'>
                  {/* <label className="form-label">Your Phone</label> */}
                  <input type='text' className='form-control cool' placeholder='Your Phone' />
                </div>
                <div className='form-group position-relative mb-4'>
                  {/* <label className="form-label">Vehicle Registration Number</label> */}
                  <input type='text' className='form-control cool' placeholder='Vehicle Registration Number' />
                </div>
                <div className='form-group'>
                  <button className='btn btn-et w-100'>Get a quick quote</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
