import './Header.css'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CustomLink } from '@glass/components/Header/CustomLink'
import { PHONE_NUMBER, SERVICES } from '@glass/constants'

export type HeaderProps = {
  showMenu: boolean
}

export const Header: React.FC<HeaderProps> = ({ showMenu }) => {
  const navigate = useNavigate()
  const servicesMenuItems = SERVICES.map((item) => {
    return { label: item.title, link: `/services?serviceKey=${item.key}` }
  })

  const directToCustomer = () => {
    navigate('/customer')
  }

  const handleToggleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.classList.toggle('toggle-active')
  }

  return (
    <header id='navbar-main'>
      {showMenu && (
        <div className='bg-primary d-md-none p-2'>
          <div className='d-flex align-items-center justify-content-center gap-3'>
            <button className='btn-stroked round' onClick={directToCustomer}>
              Get a Quote
            </button>
            <div className='header-or-call text-white'>or call</div>
            <a href={`tel:${PHONE_NUMBER}`} className='header-phone-number text-white'>
              {PHONE_NUMBER}
            </a>
          </div>
        </div>
      )}

      <nav id='navbar_top' className='navbar navbar-expand-lg navbar-light py-3 py-md-0'>
        <div className='container'>
          {/* Mobile Navigation */}

          <div className='mobile-nav d-sm-block d-md-block d-lg-none w-100'>
            <div className='d-flex align-items-center justify-content-between'>
              <Link to='/'>
                <img src={process.env.PUBLIC_URL + '/img/logo.png'} className='logo-img img-fluid d-block' alt='' />
              </Link>
              {showMenu && (
                <div className='text-end'>
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
                    <span className='bar'></span>
                    <span className='bar'></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Link className='navbar-brand d-none d-lg-flex d-md-none d-sm-none' to='/'>
            <img src={process.env.PUBLIC_URL + '/img/logo.png'} className='logo-img img-fluid' alt='' />
          </Link>

          {showMenu && (
            <div className='collapse navbar-collapse justify-content-between ms-5' id='navbarSupportedContent'>
              <ul className='navbar-nav ms-md-4  mb-lg-0 align-items-center et-nav gap-4'>
                <CustomLink to='/'>Home</CustomLink>
                <CustomLink to='/services' dropdownItems={servicesMenuItems}>
                  Services
                </CustomLink>
                <CustomLink to='/aboutus'>About Us</CustomLink>
                <CustomLink to='/contact'>Contact Us</CustomLink>
              </ul>
              <div className='d-none d-md-flex align-items-center'>
                <button className='btn-raised round' onClick={directToCustomer}>
                  Get a Quote
                </button>
                <div className='or-call mx-3'>or Call</div>
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
