import './Footer.css'
import React from 'react'
import { Link } from 'react-router-dom'
import { SocialLinks } from '@glass/components/Footer/SocialLinks'

export const Footer: React.FC = () => {
  return (
    <footer className='footer'>
      <section className='footer-content'>
        <div className='content-box'>
          <div className='d-lg-flex justify-content-between'>
            <div>
              <div className='d-flex flex-column flex-lg-row align-items-lg-center'>
                <div className='d-flex align-items-center justify-content-between mb-3'>
                  <div>
                    <a href='#'>
                      <img src={process.env.PUBLIC_URL + '/images/logo.svg'} className='img-fluid' alt='' />
                    </a>
                  </div>
                  <div className='d-lg-none'>
                    <SocialLinks />
                  </div>
                </div>

                <div className='divider'></div>

                <div className='footer-link-container'>
                  <div className='footer-link-wrap'>
                    <div className='title'>Our services</div>
                    <Link to='/services?serviceKey=new-windscreen-replacement' className='footer-link'>
                      Windscreen replacement
                    </Link>
                    <Link to='/services?serviceKey=new-door-glass-replacement' className='footer-link'>
                      Door glass replacement
                    </Link>
                    <Link to='/services?serviceKey=new-heated-rear-windscreen-replacement' className='footer-link'>
                      Rear windscreen replacement
                    </Link>
                  </div>

                  <div className='footer-link-wrap'>
                    <div className='title'>Other information</div>
                    <Link to='/about-us' className='footer-link'>
                      About Us
                    </Link>
                    <Link to='/contact' className='footer-link'>
                      Contact Us
                    </Link>
                    <Link to='/faq' className='footer-link'>
                      FAQ
                    </Link>
                  </div>
                </div>
              </div>

              <div className='divider'></div>

              <div className='footer-bottom'>
                <div className='footer-bottom-links'>
                  <div className='footer-link'>English</div>
                  <div className='dot'></div>
                  <div className='footer-link'>Privacy Policy</div>
                  <div className='dot'></div>
                  <Link to='/terms-conditions' className='footer-link'>
                    Terms & Conditions
                  </Link>
                </div>

                <div className='copy-right'>Copyright by © FixGlass Company No.11808031. All rights reserved.</div>
              </div>
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
