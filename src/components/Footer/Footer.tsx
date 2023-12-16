import './style.css'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { SocialLinks } from '@glass/components/Footer/SocialLinks'
import { LicensePlate } from '@glass/components/LicensePlate'
import { PHONE_NUMBER } from '@glass/constants'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

export type FooterProps = {
  showReg?: boolean
}

export const Footer: React.FC<FooterProps> = ({ showReg = true }) => {
  const navigate = useNavigate()
  const [licenseSearchVal, setLicense] = useState('')

  const handleVehInputChange = (data: string | undefined) => {
    setLicense(formatLicenseNumber(data))
  }

  const directToCustomer = () => {
    if (licenseSearchVal) {
      navigate('/customer/' + licenseSearchVal)
      setLicense('')
    }
  }

  return (
    <footer className='footer'>
      <section className={'footer-top px-2 py-4 p-md-5' + (showReg ? ' footer-full' : '')}>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-7 offset-lg-5'>
              <h3 className='text-white fnt-48 fnt-md-60 fw-n'>Call us on {PHONE_NUMBER} or ask a quote online.</h3>

              {showReg && (
                <div className='mt-5'>
                  <p className='text-white fnt-20 fnt-md-28 fw-n mb-4'>
                    We accept all major credit cards and 0% monthly instalments are available.
                  </p>
                  <label className='text-white fnt-14 mb-2 ms-5'>Insert your Vehicle Registration Number</label>
                  <div className='d-flex flex-column flex-md-row align-items-center gap-4'>
                    <LicensePlate
                      placeholderVal={'NU71 REG'}
                      licenseNumber={licenseSearchVal}
                      showEdit={false}
                      handleVehInputChange={handleVehInputChange}
                    />
                    <button onClick={directToCustomer} className='btn-raised round col-12 col-md-auto'>
                      Get a Quote
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className='footer-content p-3 p-md-5'>
        <div className='content-box'>
          <div className='d-md-flex justify-content-between'>
            <div>
              <div className='d-flex flex-column flex-md-row align-items-md-center gap-3 gap-md-5'>
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
                  <div className='d-md-none'>
                    <SocialLinks />
                  </div>
                </div>
                <div className='d-flex flex-column flex-md-row gap-3 gap-md-5'>
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
            <div className='d-none d-md-block'>
              <SocialLinks />
            </div>
          </div>
        </div>
      </section>
    </footer>
  )
}
