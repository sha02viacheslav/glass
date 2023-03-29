import React from 'react'
import { Link } from 'react-router-dom'
import Slider, { CustomArrowProps } from 'react-slick'

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

  const settingsTestimonials = {
    dots: false,
    nextArrow: <SliderNextArrow />,
    prevArrow: <SliderPrevArrow />,
    infinite: true,
    variableWidth: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          mobileFirst: true,
        },
      },
    ],
  }

  return (
    <div id='footer-main'>
      <section className='sec-case-s section pt-md-0 '>
        <div className='container'>
          <h2 className='text-center text-blue mb-3 pt-md-5'>Before & after</h2>
          <p className='mb-0 slider-content'>
            Here you can describe what was the service about,
            <span className='d-lg-block'> what was the car brand and the model.</span>
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

      <section className='sec-testmonial-client bg-white pt-md-0 pt-5'>
        <div className='container-fluid'>
          <h2 className='text-blue text-center mb-md-5 mb-4'>Testimonials</h2>
          <Slider {...settingsTestimonials}>
            <div className='item '>
              <div className='testmon-box mb-4'>
                <div className='d-flex justify-content-between'>
                  <div className='avator'>
                    <p className='mb-0 text-purple'>
                      <img src={process.env.PUBLIC_URL + '/img/avator.png'} className='img-fluid me-2' alt='' />
                      Paul Neuer
                    </p>
                  </div>
                  <div className='star'>
                    <p className='fs-14 text-gray'>
                      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M17.2893 6.64918C17.2369 6.4949 17.1405 6.35934 17.0119 6.25923C16.8834 6.15912 16.7283 6.09884 16.5659 6.08584L11.8151 5.70834L9.75927 1.15751C9.6938 1.01094 9.5873 0.886447 9.45264 0.79906C9.31798 0.711673 9.16091 0.665127 9.00037 0.665039C8.83984 0.664951 8.68272 0.711325 8.54796 0.798564C8.4132 0.885802 8.30657 1.01018 8.24094 1.15668L6.1851 5.70834L1.43427 6.08584C1.27465 6.09849 1.12205 6.15685 0.994732 6.25395C0.867413 6.35105 0.770764 6.48278 0.716348 6.63337C0.661931 6.78396 0.652051 6.94704 0.687891 7.1031C0.72373 7.25916 0.803771 7.40158 0.918437 7.51334L4.42927 10.9358L3.1876 16.3125C3.1499 16.4753 3.16198 16.6456 3.22229 16.8014C3.28259 16.9572 3.38832 17.0913 3.52577 17.1862C3.66322 17.2812 3.82604 17.3326 3.99309 17.3339C4.16014 17.3352 4.32372 17.2862 4.4626 17.1933L9.0001 14.1683L13.5376 17.1933C13.6796 17.2876 13.847 17.3361 14.0173 17.3324C14.1876 17.3286 14.3528 17.2728 14.4904 17.1724C14.6281 17.0721 14.7318 16.9319 14.7874 16.7709C14.8431 16.6099 14.8481 16.4356 14.8018 16.2717L13.2776 10.9383L17.0576 7.53668C17.3051 7.31334 17.3959 6.96501 17.2893 6.64918Z'
                          fill='#FBC334'
                        />
                      </svg>
                      4.9
                    </p>
                  </div>
                </div>
                <p className='fs-12'>
                  Amet minim mollit non deserunt ullamco est sit est aliqua dolor do amet sint. Velit officia consequat
                  e duis enim velit mollit. Exercitation veniam onequat sunt nostrud amet 👍 🎯{' '}
                </p>
              </div>

              <div className='testmon-box mb-4 ms-md-5 '>
                <div className='d-flex justify-content-between'>
                  <div className='avator'>
                    <p className='mb-0 text-purple'>
                      <img src={process.env.PUBLIC_URL + '/img/avator.png'} className='img-fluid me-2' alt='' />
                      Paul Neuer
                    </p>
                  </div>
                  <div className='star'>
                    <p className='fs-14 text-gray'>
                      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M17.2893 6.64918C17.2369 6.4949 17.1405 6.35934 17.0119 6.25923C16.8834 6.15912 16.7283 6.09884 16.5659 6.08584L11.8151 5.70834L9.75927 1.15751C9.6938 1.01094 9.5873 0.886447 9.45264 0.79906C9.31798 0.711673 9.16091 0.665127 9.00037 0.665039C8.83984 0.664951 8.68272 0.711325 8.54796 0.798564C8.4132 0.885802 8.30657 1.01018 8.24094 1.15668L6.1851 5.70834L1.43427 6.08584C1.27465 6.09849 1.12205 6.15685 0.994732 6.25395C0.867413 6.35105 0.770764 6.48278 0.716348 6.63337C0.661931 6.78396 0.652051 6.94704 0.687891 7.1031C0.72373 7.25916 0.803771 7.40158 0.918437 7.51334L4.42927 10.9358L3.1876 16.3125C3.1499 16.4753 3.16198 16.6456 3.22229 16.8014C3.28259 16.9572 3.38832 17.0913 3.52577 17.1862C3.66322 17.2812 3.82604 17.3326 3.99309 17.3339C4.16014 17.3352 4.32372 17.2862 4.4626 17.1933L9.0001 14.1683L13.5376 17.1933C13.6796 17.2876 13.847 17.3361 14.0173 17.3324C14.1876 17.3286 14.3528 17.2728 14.4904 17.1724C14.6281 17.0721 14.7318 16.9319 14.7874 16.7709C14.8431 16.6099 14.8481 16.4356 14.8018 16.2717L13.2776 10.9383L17.0576 7.53668C17.3051 7.31334 17.3959 6.96501 17.2893 6.64918Z'
                          fill='#FBC334'
                        />
                      </svg>
                      4.9
                    </p>
                  </div>
                </div>
                <p className='fs-12'>
                  Amet minim mollit non deserunt ullamco est sit est aliqua dolor do amet sint. Velit officia consequat
                  e duis enim velit mollit. Exercitation veniam onequat sunt nostrud amet 👍 🎯{' '}
                </p>
              </div>
            </div>

            <div className='item '>
              <div className='testmon-box mb-4'>
                <div className='d-flex justify-content-between'>
                  <div className='avator'>
                    <p className='mb-0 text-purple'>
                      <img src={process.env.PUBLIC_URL + '/img/avator.png'} className='img-fluid me-2' alt='' />
                      Paul Neuer
                    </p>
                  </div>
                  <div className='star'>
                    <p className='fs-14 text-gray'>
                      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M17.2893 6.64918C17.2369 6.4949 17.1405 6.35934 17.0119 6.25923C16.8834 6.15912 16.7283 6.09884 16.5659 6.08584L11.8151 5.70834L9.75927 1.15751C9.6938 1.01094 9.5873 0.886447 9.45264 0.79906C9.31798 0.711673 9.16091 0.665127 9.00037 0.665039C8.83984 0.664951 8.68272 0.711325 8.54796 0.798564C8.4132 0.885802 8.30657 1.01018 8.24094 1.15668L6.1851 5.70834L1.43427 6.08584C1.27465 6.09849 1.12205 6.15685 0.994732 6.25395C0.867413 6.35105 0.770764 6.48278 0.716348 6.63337C0.661931 6.78396 0.652051 6.94704 0.687891 7.1031C0.72373 7.25916 0.803771 7.40158 0.918437 7.51334L4.42927 10.9358L3.1876 16.3125C3.1499 16.4753 3.16198 16.6456 3.22229 16.8014C3.28259 16.9572 3.38832 17.0913 3.52577 17.1862C3.66322 17.2812 3.82604 17.3326 3.99309 17.3339C4.16014 17.3352 4.32372 17.2862 4.4626 17.1933L9.0001 14.1683L13.5376 17.1933C13.6796 17.2876 13.847 17.3361 14.0173 17.3324C14.1876 17.3286 14.3528 17.2728 14.4904 17.1724C14.6281 17.0721 14.7318 16.9319 14.7874 16.7709C14.8431 16.6099 14.8481 16.4356 14.8018 16.2717L13.2776 10.9383L17.0576 7.53668C17.3051 7.31334 17.3959 6.96501 17.2893 6.64918Z'
                          fill='#FBC334'
                        />
                      </svg>
                      4.9
                    </p>
                  </div>
                </div>
                <p className='fs-12'>
                  Amet minim mollit non deserunt ullamco est sit est aliqua dolor do amet sint. Velit officia consequat
                  e duis enim velit mollit. Exercitation veniam onequat sunt nostrud amet 👍 🎯{' '}
                </p>
              </div>

              <div className='testmon-box mb-4 ms-md-5 '>
                <div className='d-flex justify-content-between'>
                  <div className='avator'>
                    <p className='mb-0 text-purple'>
                      <img src={process.env.PUBLIC_URL + '/img/avator.png'} className='img-fluid me-2' alt='' />
                      Paul Neuer
                    </p>
                  </div>
                  <div className='star'>
                    <p className='fs-14 text-gray'>
                      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M17.2893 6.64918C17.2369 6.4949 17.1405 6.35934 17.0119 6.25923C16.8834 6.15912 16.7283 6.09884 16.5659 6.08584L11.8151 5.70834L9.75927 1.15751C9.6938 1.01094 9.5873 0.886447 9.45264 0.79906C9.31798 0.711673 9.16091 0.665127 9.00037 0.665039C8.83984 0.664951 8.68272 0.711325 8.54796 0.798564C8.4132 0.885802 8.30657 1.01018 8.24094 1.15668L6.1851 5.70834L1.43427 6.08584C1.27465 6.09849 1.12205 6.15685 0.994732 6.25395C0.867413 6.35105 0.770764 6.48278 0.716348 6.63337C0.661931 6.78396 0.652051 6.94704 0.687891 7.1031C0.72373 7.25916 0.803771 7.40158 0.918437 7.51334L4.42927 10.9358L3.1876 16.3125C3.1499 16.4753 3.16198 16.6456 3.22229 16.8014C3.28259 16.9572 3.38832 17.0913 3.52577 17.1862C3.66322 17.2812 3.82604 17.3326 3.99309 17.3339C4.16014 17.3352 4.32372 17.2862 4.4626 17.1933L9.0001 14.1683L13.5376 17.1933C13.6796 17.2876 13.847 17.3361 14.0173 17.3324C14.1876 17.3286 14.3528 17.2728 14.4904 17.1724C14.6281 17.0721 14.7318 16.9319 14.7874 16.7709C14.8431 16.6099 14.8481 16.4356 14.8018 16.2717L13.2776 10.9383L17.0576 7.53668C17.3051 7.31334 17.3959 6.96501 17.2893 6.64918Z'
                          fill='#FBC334'
                        />
                      </svg>
                      4.9
                    </p>
                  </div>
                </div>
                <p className='fs-12'>
                  Amet minim mollit non deserunt ullamco est sit est aliqua dolor do amet sint. Velit officia consequat
                  e duis enim velit mollit. Exercitation veniam onequat sunt nostrud amet 👍 🎯{' '}
                </p>
              </div>
            </div>

            <div className='item '>
              <div className='testmon-box mb-4'>
                <div className='d-flex justify-content-between'>
                  <div className='avator'>
                    <p className='mb-0 text-purple'>
                      <img src={process.env.PUBLIC_URL + '/img/avator.png'} className='img-fluid me-2' alt='' />
                      Paul Neuer
                    </p>
                  </div>
                  <div className='star'>
                    <p className='fs-14 text-gray'>
                      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M17.2893 6.64918C17.2369 6.4949 17.1405 6.35934 17.0119 6.25923C16.8834 6.15912 16.7283 6.09884 16.5659 6.08584L11.8151 5.70834L9.75927 1.15751C9.6938 1.01094 9.5873 0.886447 9.45264 0.79906C9.31798 0.711673 9.16091 0.665127 9.00037 0.665039C8.83984 0.664951 8.68272 0.711325 8.54796 0.798564C8.4132 0.885802 8.30657 1.01018 8.24094 1.15668L6.1851 5.70834L1.43427 6.08584C1.27465 6.09849 1.12205 6.15685 0.994732 6.25395C0.867413 6.35105 0.770764 6.48278 0.716348 6.63337C0.661931 6.78396 0.652051 6.94704 0.687891 7.1031C0.72373 7.25916 0.803771 7.40158 0.918437 7.51334L4.42927 10.9358L3.1876 16.3125C3.1499 16.4753 3.16198 16.6456 3.22229 16.8014C3.28259 16.9572 3.38832 17.0913 3.52577 17.1862C3.66322 17.2812 3.82604 17.3326 3.99309 17.3339C4.16014 17.3352 4.32372 17.2862 4.4626 17.1933L9.0001 14.1683L13.5376 17.1933C13.6796 17.2876 13.847 17.3361 14.0173 17.3324C14.1876 17.3286 14.3528 17.2728 14.4904 17.1724C14.6281 17.0721 14.7318 16.9319 14.7874 16.7709C14.8431 16.6099 14.8481 16.4356 14.8018 16.2717L13.2776 10.9383L17.0576 7.53668C17.3051 7.31334 17.3959 6.96501 17.2893 6.64918Z'
                          fill='#FBC334'
                        />
                      </svg>
                      4.9
                    </p>
                  </div>
                </div>
                <p className='fs-12'>
                  Amet minim mollit non deserunt ullamco est sit est aliqua dolor do amet sint. Velit officia consequat
                  e duis enim velit mollit. Exercitation veniam onequat sunt nostrud amet 👍 🎯{' '}
                </p>
              </div>

              <div className='testmon-box mb-4 ms-md-5 '>
                <div className='d-flex justify-content-between'>
                  <div className='avator'>
                    <p className='mb-0 text-purple'>
                      <img src={process.env.PUBLIC_URL + '/img/avator.png'} className='img-fluid me-2' alt='' />
                      Paul Neuer
                    </p>
                  </div>
                  <div className='star'>
                    <p className='fs-14 text-gray'>
                      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M17.2893 6.64918C17.2369 6.4949 17.1405 6.35934 17.0119 6.25923C16.8834 6.15912 16.7283 6.09884 16.5659 6.08584L11.8151 5.70834L9.75927 1.15751C9.6938 1.01094 9.5873 0.886447 9.45264 0.79906C9.31798 0.711673 9.16091 0.665127 9.00037 0.665039C8.83984 0.664951 8.68272 0.711325 8.54796 0.798564C8.4132 0.885802 8.30657 1.01018 8.24094 1.15668L6.1851 5.70834L1.43427 6.08584C1.27465 6.09849 1.12205 6.15685 0.994732 6.25395C0.867413 6.35105 0.770764 6.48278 0.716348 6.63337C0.661931 6.78396 0.652051 6.94704 0.687891 7.1031C0.72373 7.25916 0.803771 7.40158 0.918437 7.51334L4.42927 10.9358L3.1876 16.3125C3.1499 16.4753 3.16198 16.6456 3.22229 16.8014C3.28259 16.9572 3.38832 17.0913 3.52577 17.1862C3.66322 17.2812 3.82604 17.3326 3.99309 17.3339C4.16014 17.3352 4.32372 17.2862 4.4626 17.1933L9.0001 14.1683L13.5376 17.1933C13.6796 17.2876 13.847 17.3361 14.0173 17.3324C14.1876 17.3286 14.3528 17.2728 14.4904 17.1724C14.6281 17.0721 14.7318 16.9319 14.7874 16.7709C14.8431 16.6099 14.8481 16.4356 14.8018 16.2717L13.2776 10.9383L17.0576 7.53668C17.3051 7.31334 17.3959 6.96501 17.2893 6.64918Z'
                          fill='#FBC334'
                        />
                      </svg>
                      4.9
                    </p>
                  </div>
                </div>
                <p className='fs-12'>
                  Amet minim mollit non deserunt ullamco est sit est aliqua dolor do amet sint. Velit officia consequat
                  e duis enim velit mollit. Exercitation veniam onequat sunt nostrud amet 👍 🎯{' '}
                </p>
              </div>
            </div>

            <div className='item '>
              <div className='testmon-box mb-4'>
                <div className='d-flex justify-content-between'>
                  <div className='avator'>
                    <p className='mb-0 text-purple'>
                      <img src={process.env.PUBLIC_URL + '/img/avator.png'} className='img-fluid me-2' alt='' />
                      Paul Neuer
                    </p>
                  </div>
                  <div className='star'>
                    <p className='fs-14 text-gray'>
                      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M17.2893 6.64918C17.2369 6.4949 17.1405 6.35934 17.0119 6.25923C16.8834 6.15912 16.7283 6.09884 16.5659 6.08584L11.8151 5.70834L9.75927 1.15751C9.6938 1.01094 9.5873 0.886447 9.45264 0.79906C9.31798 0.711673 9.16091 0.665127 9.00037 0.665039C8.83984 0.664951 8.68272 0.711325 8.54796 0.798564C8.4132 0.885802 8.30657 1.01018 8.24094 1.15668L6.1851 5.70834L1.43427 6.08584C1.27465 6.09849 1.12205 6.15685 0.994732 6.25395C0.867413 6.35105 0.770764 6.48278 0.716348 6.63337C0.661931 6.78396 0.652051 6.94704 0.687891 7.1031C0.72373 7.25916 0.803771 7.40158 0.918437 7.51334L4.42927 10.9358L3.1876 16.3125C3.1499 16.4753 3.16198 16.6456 3.22229 16.8014C3.28259 16.9572 3.38832 17.0913 3.52577 17.1862C3.66322 17.2812 3.82604 17.3326 3.99309 17.3339C4.16014 17.3352 4.32372 17.2862 4.4626 17.1933L9.0001 14.1683L13.5376 17.1933C13.6796 17.2876 13.847 17.3361 14.0173 17.3324C14.1876 17.3286 14.3528 17.2728 14.4904 17.1724C14.6281 17.0721 14.7318 16.9319 14.7874 16.7709C14.8431 16.6099 14.8481 16.4356 14.8018 16.2717L13.2776 10.9383L17.0576 7.53668C17.3051 7.31334 17.3959 6.96501 17.2893 6.64918Z'
                          fill='#FBC334'
                        />
                      </svg>
                      4.9
                    </p>
                  </div>
                </div>
                <p className='fs-12'>
                  Amet minim mollit non deserunt ullamco est sit est aliqua dolor do amet sint. Velit officia consequat
                  e duis enim velit mollit. Exercitation veniam onequat sunt nostrud amet 👍 🎯{' '}
                </p>
              </div>

              <div className='testmon-box mb-4 ms-md-5 '>
                <div className='d-flex justify-content-between'>
                  <div className='avator'>
                    <p className='mb-0 text-purple'>
                      <img src={process.env.PUBLIC_URL + '/img/avator.png'} className='img-fluid me-2' alt='' />
                      Paul Neuer
                    </p>
                  </div>
                  <div className='star'>
                    <p className='fs-14 text-gray'>
                      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M17.2893 6.64918C17.2369 6.4949 17.1405 6.35934 17.0119 6.25923C16.8834 6.15912 16.7283 6.09884 16.5659 6.08584L11.8151 5.70834L9.75927 1.15751C9.6938 1.01094 9.5873 0.886447 9.45264 0.79906C9.31798 0.711673 9.16091 0.665127 9.00037 0.665039C8.83984 0.664951 8.68272 0.711325 8.54796 0.798564C8.4132 0.885802 8.30657 1.01018 8.24094 1.15668L6.1851 5.70834L1.43427 6.08584C1.27465 6.09849 1.12205 6.15685 0.994732 6.25395C0.867413 6.35105 0.770764 6.48278 0.716348 6.63337C0.661931 6.78396 0.652051 6.94704 0.687891 7.1031C0.72373 7.25916 0.803771 7.40158 0.918437 7.51334L4.42927 10.9358L3.1876 16.3125C3.1499 16.4753 3.16198 16.6456 3.22229 16.8014C3.28259 16.9572 3.38832 17.0913 3.52577 17.1862C3.66322 17.2812 3.82604 17.3326 3.99309 17.3339C4.16014 17.3352 4.32372 17.2862 4.4626 17.1933L9.0001 14.1683L13.5376 17.1933C13.6796 17.2876 13.847 17.3361 14.0173 17.3324C14.1876 17.3286 14.3528 17.2728 14.4904 17.1724C14.6281 17.0721 14.7318 16.9319 14.7874 16.7709C14.8431 16.6099 14.8481 16.4356 14.8018 16.2717L13.2776 10.9383L17.0576 7.53668C17.3051 7.31334 17.3959 6.96501 17.2893 6.64918Z'
                          fill='#FBC334'
                        />
                      </svg>
                      4.9
                    </p>
                  </div>
                </div>
                <p className='fs-12'>
                  Amet minim mollit non deserunt ullamco est sit est aliqua dolor do amet sint. Velit officia consequat
                  e duis enim velit mollit. Exercitation veniam onequat sunt nostrud amet 👍 🎯{' '}
                </p>
              </div>
            </div>

            <div className='item '>
              <div className='testmon-box mb-4'>
                <div className='d-flex justify-content-between'>
                  <div className='avator'>
                    <p className='mb-0 text-purple'>
                      <img src={process.env.PUBLIC_URL + '/img/avator.png'} className='img-fluid me-2' alt='' />
                      Paul Neuer
                    </p>
                  </div>
                  <div className='star'>
                    <p className='fs-14 text-gray'>
                      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M17.2893 6.64918C17.2369 6.4949 17.1405 6.35934 17.0119 6.25923C16.8834 6.15912 16.7283 6.09884 16.5659 6.08584L11.8151 5.70834L9.75927 1.15751C9.6938 1.01094 9.5873 0.886447 9.45264 0.79906C9.31798 0.711673 9.16091 0.665127 9.00037 0.665039C8.83984 0.664951 8.68272 0.711325 8.54796 0.798564C8.4132 0.885802 8.30657 1.01018 8.24094 1.15668L6.1851 5.70834L1.43427 6.08584C1.27465 6.09849 1.12205 6.15685 0.994732 6.25395C0.867413 6.35105 0.770764 6.48278 0.716348 6.63337C0.661931 6.78396 0.652051 6.94704 0.687891 7.1031C0.72373 7.25916 0.803771 7.40158 0.918437 7.51334L4.42927 10.9358L3.1876 16.3125C3.1499 16.4753 3.16198 16.6456 3.22229 16.8014C3.28259 16.9572 3.38832 17.0913 3.52577 17.1862C3.66322 17.2812 3.82604 17.3326 3.99309 17.3339C4.16014 17.3352 4.32372 17.2862 4.4626 17.1933L9.0001 14.1683L13.5376 17.1933C13.6796 17.2876 13.847 17.3361 14.0173 17.3324C14.1876 17.3286 14.3528 17.2728 14.4904 17.1724C14.6281 17.0721 14.7318 16.9319 14.7874 16.7709C14.8431 16.6099 14.8481 16.4356 14.8018 16.2717L13.2776 10.9383L17.0576 7.53668C17.3051 7.31334 17.3959 6.96501 17.2893 6.64918Z'
                          fill='#FBC334'
                        />
                      </svg>
                      4.9
                    </p>
                  </div>
                </div>
                <p className='fs-12'>
                  Amet minim mollit non deserunt ullamco est sit est aliqua dolor do amet sint. Velit officia consequat
                  e duis enim velit mollit. Exercitation veniam onequat sunt nostrud amet 👍 🎯{' '}
                </p>
              </div>

              <div className='testmon-box mb-4 ms-md-5 '>
                <div className='d-flex justify-content-between'>
                  <div className='avator'>
                    <p className='mb-0 text-purple'>
                      <img src={process.env.PUBLIC_URL + '/img/avator.png'} className='img-fluid me-2' alt='' />
                      Paul Neuer
                    </p>
                  </div>
                  <div className='star'>
                    <p className='fs-14 text-gray'>
                      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M17.2893 6.64918C17.2369 6.4949 17.1405 6.35934 17.0119 6.25923C16.8834 6.15912 16.7283 6.09884 16.5659 6.08584L11.8151 5.70834L9.75927 1.15751C9.6938 1.01094 9.5873 0.886447 9.45264 0.79906C9.31798 0.711673 9.16091 0.665127 9.00037 0.665039C8.83984 0.664951 8.68272 0.711325 8.54796 0.798564C8.4132 0.885802 8.30657 1.01018 8.24094 1.15668L6.1851 5.70834L1.43427 6.08584C1.27465 6.09849 1.12205 6.15685 0.994732 6.25395C0.867413 6.35105 0.770764 6.48278 0.716348 6.63337C0.661931 6.78396 0.652051 6.94704 0.687891 7.1031C0.72373 7.25916 0.803771 7.40158 0.918437 7.51334L4.42927 10.9358L3.1876 16.3125C3.1499 16.4753 3.16198 16.6456 3.22229 16.8014C3.28259 16.9572 3.38832 17.0913 3.52577 17.1862C3.66322 17.2812 3.82604 17.3326 3.99309 17.3339C4.16014 17.3352 4.32372 17.2862 4.4626 17.1933L9.0001 14.1683L13.5376 17.1933C13.6796 17.2876 13.847 17.3361 14.0173 17.3324C14.1876 17.3286 14.3528 17.2728 14.4904 17.1724C14.6281 17.0721 14.7318 16.9319 14.7874 16.7709C14.8431 16.6099 14.8481 16.4356 14.8018 16.2717L13.2776 10.9383L17.0576 7.53668C17.3051 7.31334 17.3959 6.96501 17.2893 6.64918Z'
                          fill='#FBC334'
                        />
                      </svg>
                      4.9
                    </p>
                  </div>
                </div>
                <p className='fs-12'>
                  Amet minim mollit non deserunt ullamco est sit est aliqua dolor do amet sint. Velit officia consequat
                  e duis enim velit mollit. Exercitation veniam onequat sunt nostrud amet 👍 🎯{' '}
                </p>
              </div>
            </div>

            <div className='item '>
              <div className='testmon-box mb-4'>
                <div className='d-flex justify-content-between'>
                  <div className='avator'>
                    <p className='mb-0 text-purple'>
                      <img src={process.env.PUBLIC_URL + '/img/avator.png'} className='img-fluid me-2' alt='' />
                      Paul Neuer
                    </p>
                  </div>
                  <div className='star'>
                    <p className='fs-14 text-gray'>
                      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M17.2893 6.64918C17.2369 6.4949 17.1405 6.35934 17.0119 6.25923C16.8834 6.15912 16.7283 6.09884 16.5659 6.08584L11.8151 5.70834L9.75927 1.15751C9.6938 1.01094 9.5873 0.886447 9.45264 0.79906C9.31798 0.711673 9.16091 0.665127 9.00037 0.665039C8.83984 0.664951 8.68272 0.711325 8.54796 0.798564C8.4132 0.885802 8.30657 1.01018 8.24094 1.15668L6.1851 5.70834L1.43427 6.08584C1.27465 6.09849 1.12205 6.15685 0.994732 6.25395C0.867413 6.35105 0.770764 6.48278 0.716348 6.63337C0.661931 6.78396 0.652051 6.94704 0.687891 7.1031C0.72373 7.25916 0.803771 7.40158 0.918437 7.51334L4.42927 10.9358L3.1876 16.3125C3.1499 16.4753 3.16198 16.6456 3.22229 16.8014C3.28259 16.9572 3.38832 17.0913 3.52577 17.1862C3.66322 17.2812 3.82604 17.3326 3.99309 17.3339C4.16014 17.3352 4.32372 17.2862 4.4626 17.1933L9.0001 14.1683L13.5376 17.1933C13.6796 17.2876 13.847 17.3361 14.0173 17.3324C14.1876 17.3286 14.3528 17.2728 14.4904 17.1724C14.6281 17.0721 14.7318 16.9319 14.7874 16.7709C14.8431 16.6099 14.8481 16.4356 14.8018 16.2717L13.2776 10.9383L17.0576 7.53668C17.3051 7.31334 17.3959 6.96501 17.2893 6.64918Z'
                          fill='#FBC334'
                        />
                      </svg>
                      4.9
                    </p>
                  </div>
                </div>
                <p className='fs-12'>
                  Amet minim mollit non deserunt ullamco est sit est aliqua dolor do amet sint. Velit officia consequat
                  e duis enim velit mollit. Exercitation veniam onequat sunt nostrud amet 👍 🎯{' '}
                </p>
              </div>

              <div className='testmon-box mb-4 ms-md-5 '>
                <div className='d-flex justify-content-between'>
                  <div className='avator'>
                    <p className='mb-0 text-purple'>
                      <img src={process.env.PUBLIC_URL + '/img/avator.png'} className='img-fluid me-2' alt='' />
                      Paul Neuer
                    </p>
                  </div>
                  <div className='star'>
                    <p className='fs-14 text-gray'>
                      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M17.2893 6.64918C17.2369 6.4949 17.1405 6.35934 17.0119 6.25923C16.8834 6.15912 16.7283 6.09884 16.5659 6.08584L11.8151 5.70834L9.75927 1.15751C9.6938 1.01094 9.5873 0.886447 9.45264 0.79906C9.31798 0.711673 9.16091 0.665127 9.00037 0.665039C8.83984 0.664951 8.68272 0.711325 8.54796 0.798564C8.4132 0.885802 8.30657 1.01018 8.24094 1.15668L6.1851 5.70834L1.43427 6.08584C1.27465 6.09849 1.12205 6.15685 0.994732 6.25395C0.867413 6.35105 0.770764 6.48278 0.716348 6.63337C0.661931 6.78396 0.652051 6.94704 0.687891 7.1031C0.72373 7.25916 0.803771 7.40158 0.918437 7.51334L4.42927 10.9358L3.1876 16.3125C3.1499 16.4753 3.16198 16.6456 3.22229 16.8014C3.28259 16.9572 3.38832 17.0913 3.52577 17.1862C3.66322 17.2812 3.82604 17.3326 3.99309 17.3339C4.16014 17.3352 4.32372 17.2862 4.4626 17.1933L9.0001 14.1683L13.5376 17.1933C13.6796 17.2876 13.847 17.3361 14.0173 17.3324C14.1876 17.3286 14.3528 17.2728 14.4904 17.1724C14.6281 17.0721 14.7318 16.9319 14.7874 16.7709C14.8431 16.6099 14.8481 16.4356 14.8018 16.2717L13.2776 10.9383L17.0576 7.53668C17.3051 7.31334 17.3959 6.96501 17.2893 6.64918Z'
                          fill='#FBC334'
                        />
                      </svg>
                      4.9
                    </p>
                  </div>
                </div>
                <p className='fs-12'>
                  Amet minim mollit non deserunt ullamco est sit est aliqua dolor do amet sint. Velit officia consequat
                  e duis enim velit mollit. Exercitation veniam onequat sunt nostrud amet 👍 🎯{' '}
                </p>
              </div>
            </div>
            {/* </div> */}
          </Slider>
        </div>
      </section>

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
                  <h3 className='text-white mb-4'>Lorem ipsum dolor sit amet adicipling elit ullamco euismod</h3>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <input type='text' className='form-control' placeholder='Vehicle Registration Number...' />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <Link to='/customer' className='btn btn-et w-100'>
                        Get a Quote
                      </Link>
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
                    Wherever you are, whichever model you drive, we got you covered. We offer nationwide windscreen
                    repairs and replacements for passenger vehicles and vans. All jobs are done by professionals at your
                    home or work.
                  </p>
                </div>
                <div className='col-md-2 ps-lg-4'>
                  <ul className='list-f'>
                    <li>
                      <Link to='/services'>Services</Link>
                    </li>
                    <li>
                      <Link to='/pricing'>Pricing</Link>
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
                    <a href='#' className='text-white'>
                      contact@estglass.com
                    </a>
                  </p>
                  <p>
                    <img src={process.env.PUBLIC_URL + '/img/em.svg'} className='img-fluid me-2' alt='' />{' '}
                    <a href='#' className='text-white text-decoration-none'>
                      0776 6374 005
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className='footer-btm py-3'>
          <div className='container'>
            <p className='mb-0'>Copyright by © Est Glass. All rights reserved.</p>
          </div>
        </section>
      </footer>
    </div>
  )
}
