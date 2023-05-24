import './contact.css'
import React from 'react'
import { PHONE_NUMBER } from '@glass/constants'

export const Contact: React.FC = () => {
  return (
    <div>
      <section className='map'>
        <div id='map-container-google-1' className='z-depth-1-half map-container position-relative'>
          <h2 className='contact bg-purple text-white'>Contact Us</h2>
        </div>
      </section>

      <section className='sec-form section'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-8'>
              <p className='main-content mt-3 mb-4'>
                You can come to our workshop
                <br /> or we come to you.
              </p>
              <div className='row'>
                <div className='col-md-6'>
                  <h5 className='text-blue fw-normal mt-mob-h'>Registered office</h5>
                  <p>
                    85 Great Portland Street
                    <br />
                    London
                    <br />
                    W1W 7LT
                  </p>
                </div>
                <div className='col-md-6'>
                  <h5 className='text-blue fw-normal call-txt'>Call us</h5>
                  <p className='mb-0'>
                    <a href={`tel:${PHONE_NUMBER}`} className='text-gray text-decoration-none'>
                      {PHONE_NUMBER}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
