import React from 'react'

export const Services: React.FC = () => {
  return (
    <div>
      <section className='sec-banner-s'>
        <div className='container'>
          <h1 className='main-heading text-white'>Our Services </h1>
          <p className='content-s text-white'>We love to replace glasses. At your home or work.</p>
        </div>
      </section>
      <section className='sec-car-slider section'>
        <div className='container'>
          <div className='row justify-content-center text-center gy-md-5 gy-4' autoFocus>
            <div className='col-md-4 col-sm-6'>
              <div className='content'>
                <div className='content-overlay'></div>
                <div className='sv-m'>
                  <img src={process.env.PUBLIC_URL + '/img/ic1.png'} className='img-fluid mb-4' alt='' />
                  <div className='content-sv'>
                    <h5 className='text-blue mb-3 pt-2'>New Windscreen Replacement</h5>
                    <p>
                      We can source the new glass from the biggest suppliers and new windscreen will meet all quality
                      standards. All different sensors and heating versions. Whole process 1-2 hours and vehicle is safe
                      to drive.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='col-md-4 col-sm-6'>
              <div className='content'>
                <div className='content-overlay'></div>
                <div className='sv-m'>
                  <img src={process.env.PUBLIC_URL + '/img/ic2.png'} className='img-fluid mb-4' alt='' />
                  <div className='content-sv'>
                    <h5 className='text-blue mb-3 pt-2'>New Door Glass Replacement</h5>
                    <p>
                      We can source the new glass from the biggest suppliers and new, either tempered or laminated door
                      glass will meet all quality standards. Rear doors have privacy glasses available. Shattered glass
                      can be vacuumed. Whole process 1-2 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='col-md-4 col-sm-6'>
              <div className='content'>
                <div className='content-overlay'></div>
                <div className='sv-m'>
                  <img src={process.env.PUBLIC_URL + '/img/ic3.png'} className='img-fluid mb-4' alt='' />
                  <div className='content-sv'>
                    <h5 className='text-blue mb-3 pt-2'>New Heated Rear Windscreen Replacement</h5>
                    <p>
                      We can source the new glass from the biggest suppliers and new, either tempered or laminated rear
                      windscreen will meet all quality standards. Shattered glass can be vacuumed. Privacy glasses
                      available. Whole process 1-2 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*Remove for now, will check later*/}
      {/*<CaseStudies />*/}
    </div>
  )
}
