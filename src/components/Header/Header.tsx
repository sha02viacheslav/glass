import './Header.css'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CustomLink } from '@glass/components/Header/CustomLink'
import { PHONE_NUMBER } from '@glass/constants'

export type HeaderProps = {
  showMenu: boolean
}

export const Header: React.FC<HeaderProps> = ({ showMenu }) => {
  const navigate = useNavigate()

  const directToCustomer = () => {
    navigate('/customer')
  }

  const handleToggleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.classList.toggle('toggle-active')
  }

  return (
    <header id='navbar-main'>
      <nav id='navbar_top' className='navbar navbar-expand-lg navbar-light py-3 py-md-0'>
        <div className='container'>
          {/* Mobile Navigation */}
          <div className='mobile-nav d-sm-block d-md-block d-lg-none w-100'>
            <div className='row align-items-start align-items-md-center w-100 g-0'>
              <div className='col-4'>
                <Link className=' py-2' to='/'>
                  <img
                    src={process.env.PUBLIC_URL + '/img/logo.png'}
                    className='logo-img img-fluid d-block mx-auto'
                    alt=''
                  />
                </Link>
              </div>
              {showMenu && (
                <>
                  <div className='col-5 ms-auto'>
                    <div className='d-flex flex-column align-items-center'>
                      <button className='header-get-quote-btn' onClick={directToCustomer}>
                        Get a Quote
                      </button>
                      <div className='header-or-call'>or call</div>
                      <a href={`tel:${PHONE_NUMBER}`} className='header-phone-number'>
                        {PHONE_NUMBER}
                      </a>
                    </div>
                  </div>
                  <div className='col-2 text-end'>
                    <div
                      id='toggle'
                      onClick={handleToggleClick}
                      className='toggle-button ms-auto'
                      data-bs-toggle='collapse'
                      data-bs-target='#navbarSupportedContent'
                      aria-controls='navbarSupportedContent'
                      aria-expanded='false'
                      aria-label='Toggle navigation'
                    >
                      <span className='bar top'></span>
                      <span className='bar middle'></span>
                      <span className='bar bottom'></span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <Link className='navbar-brand d-none d-lg-flex d-md-none d-sm-none' to='/'>
            <img src={process.env.PUBLIC_URL + '/img/logo.png'} className='logo-img img-fluid' alt='' />
          </Link>

          {showMenu && (
            <div className='collapse navbar-collapse justify-content-between' id='navbarSupportedContent'>
              <ul className='navbar-nav ms-md-4  mb-lg-0 align-items-center et-nav'>
                <CustomLink to='/services'>Services</CustomLink>
                <CustomLink to='/contact'>Contact us</CustomLink>
              </ul>
              <div className='d-none d-md-flex align-items-center'>
                <button className='get-quote-btn' onClick={directToCustomer}>
                  Get a Quote
                </button>
                <div className='or-call mx-3'>or call</div>
                <a href={`tel:${PHONE_NUMBER}`} className='phone-number'>
                  {PHONE_NUMBER}
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
