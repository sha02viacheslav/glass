import './style.css'
import React from 'react'
import { Link } from 'react-router-dom'
import { SocialLinks } from '@glass/components/Footer/SocialLinks'

export const Footer: React.FC = () => {
  return (
    <footer className='footer'>
      <section className='footer-content p-3 p-md-5'>
        <div className='content-box'>
          <div className='d-lg-flex justify-content-between'>
            <div>
              <div className='d-flex flex-column flex-lg-row align-items-lg-center gap-3 gap-md-5'>
                <div className='d-flex align-items-center justify-content-between'>
                  <div className='f-logo mt-0'>
                    <a href='#'>
                      <img
                        src={process.env.PUBLIC_URL + '/images/logo-white.png'}
                        className='img-fluid'
                        width='120'
                        alt=''
                      />
                    </a>
                  </div>
                  <div className='d-lg-none'>
                    <SocialLinks />
                  </div>
                </div>
                <div className='d-flex flex-column flex-lg-row gap-3 gap-lg-5'>
                  <Link to='/' className='footer-link'>
                    Home
                  </Link>
                  <Link to='/services' className='footer-link'>
                    Services
                  </Link>
                  <Link to='/aboutus' className='footer-link'>
                    About Us
                  </Link>
                  <Link to='/contact' className='footer-link'>
                    Contact Us
                  </Link>
                </div>
              </div>
              <p className='fnt-12 fnt-md-14 text-white text-center text-md-start mt-5 mt-md-4'>
                Copyright by © FixGlass Company No.11808031. All rights reserved.
              </p>
            </div>
            <div className='d-none d-lg-block'>
              <SocialLinks />
            </div>
          </div>
        </div>
      </section>
    </footer>
  )
}
