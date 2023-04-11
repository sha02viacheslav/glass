import './style.css'
import React from 'react'
import { Link } from 'react-router-dom'
import { CustomLink } from '@glass/components/Header/CustomLink'

export const Header: React.FC = () => {
  const handleToggleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.classList.toggle('toggle-active')
  }

  return (
    <header id='navbar-main'>
      <nav id='navbar_top' className='navbar navbar-expand-lg navbar-light py-0'>
        <div className='container'>
          {/* Mobile Navigation */}
          <div className='mobile-nav d-sm-block d-md-block d-lg-none w-100'>
            <div className='row align-items-center w-100 g-0'>
              <div className='col-4'>
                <Link className=' py-2' to='/'>
                  <img
                    src={process.env.PUBLIC_URL + '/img/logo.png'}
                    className='logo-img img-fluid d-block mx-auto'
                    alt=''
                  />
                </Link>
              </div>
              <div className='col-5 text-end ms-auto'>
                <Link to='/customer' className='btn btn-purple ms-auto'>
                  Get a Quote
                </Link>
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
            </div>
          </div>

          <Link className='navbar-brand d-none d-lg-flex d-md-none d-sm-none' to='/'>
            <img src={process.env.PUBLIC_URL + '/img/logo.png'} className='logo-img img-fluid' alt='' />
          </Link>

          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav ms-md-4  mb-lg-0 align-items-center et-nav'>
              <CustomLink to='/services'>Services</CustomLink>
              <CustomLink to='/contact'>Contact us</CustomLink>
            </ul>
            <Link to='/customer' className='btn-raised ms-auto d-none d-md-flex'>
              Get a Quote
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
