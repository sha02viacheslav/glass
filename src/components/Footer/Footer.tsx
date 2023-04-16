import './style.css'
import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Slider, { CustomArrowProps } from 'react-slick'
import { GoogleReviews } from '@glass/components/Footer/GoogleReviews'
import { PHONE_NUMBER } from '@glass/constants'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

function SliderNextArrow(props: CustomArrowProps) {
  const { onClick } = props
  return (
    <button className='slide-arrow next-arrow slick-arrow' onClick={onClick}>
      <i className='fa fa-angle-right' aria-hidden='true'></i>
    </button>
  )
}

function SliderPrevArrow(props: CustomArrowProps) {
  const { onClick } = props
  return (
    <button className='slide-arrow prev-arrow slick-arrow' onClick={onClick}>
      <i className='fa fa-angle-left' aria-hidden='true'></i>
    </button>
  )
}

export const Footer: React.FC = () => {
  const settings = {
    dots: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SliderNextArrow />,
    prevArrow: <SliderPrevArrow />,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          // infinite: true,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  const navigate = useNavigate()
  const licenseRef = useRef<HTMLInputElement>(null)

  const patternMatch = () => {
    if (licenseRef.current) {
      licenseRef.current.value = formatLicenseNumber(licenseRef.current.value)
    }
  }

  const directToCustomer = () => {
    if (licenseRef.current?.value) {
      navigate('/customer/' + licenseRef.current?.value)
      licenseRef.current.value = ''
    }
  }

  return (
    <div id='footer-main'>
      <section className='sec-case-s section pt-md-0 '>
        <div className='container'>
          <h2 className='text-center text-blue mb-3 pt-md-5'>Before & after</h2>
          <p className='mb-0 slider-content'>
            The quality of our work, check before&after pictures. We can come to your home or work and replace the glass
            in 1-2 hours.
          </p>
          <div className='main-content  pt-4'>
            <div className='regular p-4'>
              <Slider {...settings}>
                <div className='item'>
                  <div className='row g-0'>
                    <div className='col-6'>
                      <div className='item-img odd animated wow fadeIn'>
                        <img src={process.env.PUBLIC_URL + '/img/gallery/before1.jpg'} className='img-fluid' alt='' />
                        <div className='ribbon'>
                          <span>BEFORE</span>
                        </div>
                        <div className='overlay odd fade-overlay'>
                          <div className='text'>
                            <i className='fa fa-search'></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-6'>
                      <div className='item-img even animated wow fadeIn'>
                        <img src={process.env.PUBLIC_URL + '/img/gallery/after1.jpg'} className='img-fluid' alt='' />
                        <div className='ribbon ribbon-cyan'>
                          <span>AFTER</span>
                        </div>
                        <div className='overlay even fade-overlay'>
                          <div className='text'>
                            <i className='fa fa-search'></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </section>

      <GoogleReviews />

      <section className='sec-glassre section '>
        <div className='container'>
          <div className='row'>
            <div className='col-md-9 col-lg-7'>
              <div className='row d-lg-none d-md-none d-flex'>
                <div className='col-7'>
                  <h2 className='title-s mb-4 pt-md-0 pt-5'>
                    With every glass replacement
                    <span className='text-purple d-md-block'> we plant a tree.</span>{' '}
                  </h2>
                </div>
                <div className='col-5'>
                  <img src={process.env.PUBLIC_URL + '/img/tree.png'} className='img-fluid' alt='' />
                </div>
              </div>
              <h2 className='title-s mb-4 pt-md-0 pt-5 d-none d-lg-block d-md-block'>
                With every glass replacement
                <span className='text-purple d-md-block'> we plant a tree.</span>{' '}
              </h2>
              <p className='text-purple fs-18 fw-500 mb-1'>Trees are vital</p>
              <p className='text-blue pe-md-5'>
                As the biggest plants on the planet, they give us oxygen, store carbon, stabilize the soil and give life
                to the world’s wildlife. Trees regulate the water cycle.
              </p>
              <div className='row'>
                <div className='col-md-12 col-lg-9'>
                  <div className='position-relative pt-md-4'>
                    <img src={process.env.PUBLIC_URL + '/img/re-cycle.png'} className='img-fluid m-hmob' alt='' />

                    <div className='recycle-content'>
                      <div className='d-flex justify-content-between'>
                        <div className='content-left'>
                          <h2 className='text-white mb-2'>All used glass will be collected and recycled</h2>
                          <Link to='/customer' className='btn  text-purple bg-white'>
                            Get a Quote
                          </Link>
                        </div>
                        <div className='re-img mt-auto'>
                          <img src={process.env.PUBLIC_URL + '/img/re-cyc.png'} className='img-fluid' alt='' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='col-lg-3 col-md-3 ms-auto d-none d-lg-block d-md-block'>
              <img src={process.env.PUBLIC_URL + '/img/tree.png'} className='img-fluid' alt='' />
            </div>
          </div>
        </div>
      </section>

      <footer className='footer'>
        <section className='footer-top'>
          <div className='container'>
            <div className='content-box'>
              <div className='row'>
                <div className='col-lg-6 offset-lg-6'>
                  <h3 className='text-white mb-4'>
                    Call us {PHONE_NUMBER} or ask a quote online. We accept all cards, cash and installments.
                  </h3>
                  <div className='row align-items-center'>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <input
                          ref={licenseRef}
                          type='text'
                          className='form-control'
                          placeholder='Vehicle Registration Number...'
                          onChange={patternMatch}
                          maxLength={8}
                        />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <button onClick={directToCustomer} className='btn btn-et w-100'>
                        Get a Quote
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className='footer-content'>
          <div className='container'>
            <div className='content-box'>
              <div className='row'>
                <div className='col-md-2'>
                  <div className='f-logo mt-0'>
                    <a href='#'>
                      <img src={process.env.PUBLIC_URL + '/img/f-logo.png'} className='img-fluid' width='120' alt='' />
                    </a>
                  </div>
                </div>
                <div className='col-md-5'>
                  <h4 className='text-white'>About us</h4>
                  <p className='text-white mb-0'>
                    Wherever you are, whichever model you drive, we got you covered. We offer windscreen repairs and
                    replacements for passenger vehicles and vans. All jobs are done by professionals at your home or
                    work.
                  </p>
                </div>
                <div className='col-md-2 ps-lg-4'>
                  <ul className='list-f'>
                    <li>
                      <Link to='/services'>Services</Link>
                    </li>
                    <li>
                      <Link to='/contact'>Contact us</Link>
                    </li>
                  </ul>
                </div>
                <div className='col-md-3'>
                  <h4 className='text-white pd-top mb-3'>Quick Contact</h4>
                  <p className='mb-2'>
                    <img src={process.env.PUBLIC_URL + '/img/ph.svg'} className='img-fluid me-2' alt='' />{' '}
                    <a href='#' className='text-white text-decoration-none'>
                      {PHONE_NUMBER}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className='footer-btm py-3'>
          <div className='container'>
            <p className='mb-0'>Copyright by © FixGlass (Estglass Limited) Company No.11808031. All rights reserved.</p>
          </div>
        </section>
      </footer>
    </div>
  )
}
