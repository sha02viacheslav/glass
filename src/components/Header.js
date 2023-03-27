import React from 'react'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
const Header = () => {
  const handleToggleClick = (event) => {
    // 👇️ toggle class on click
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
                  <img src={process.env.PUBLIC_URL + '/img/logo.png'} className='img-fluid d-block mx-auto' alt='' />
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
                  type='button'
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
            <img src={process.env.PUBLIC_URL + '/img/logo.png'} className='img-fluid' alt='' />
          </Link>

          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav ms-md-4  mb-lg-0 align-items-center et-nav'>
              {/* <li className="nav-item ">
                                <Link className="nav-link" to="/services">Services</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/pricing">Pricing</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/contact">Contact us</Link>
                            </li> */}

              <CustomLink to='/services'>Services</CustomLink>
              <CustomLink to='/pricing'>Pricing</CustomLink>
              <CustomLink to='/contact'>Contact us</CustomLink>
            </ul>
            <Link to='/customer' className='btn btn-purple ms-auto d-none d-sm-none d-lg-flex d-md-flex'>
              Get a Quote
            </Link>
            <button className='lost-quote-btn'>Lost my quote</button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className='nav-item'>
      <Link to={to} {...props} className={isActive ? 'nav-link active' : 'nav-link'}>
        {children}
      </Link>
    </li>
  )
}
