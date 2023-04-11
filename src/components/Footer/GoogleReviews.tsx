import './style.css'
import React, { useEffect, useState } from 'react'
import Slider, { CustomArrowProps } from 'react-slick'
import { Review } from '@glass/models'
import { getReviewsService } from '@glass/services/apis/get-reviews.service'

const SliderNextArrow = (props: CustomArrowProps) => {
  const { onClick } = props
  return (
    <button className='slide-arrow next-arrow slick-arrow' onClick={onClick}>
      <i className='fa fa-angle-right' aria-hidden='true'></i>
    </button>
  )
}

const SliderPrevArrow = (props: CustomArrowProps) => {
  const { onClick } = props
  return (
    <button className='slide-arrow prev-arrow slick-arrow' onClick={onClick}>
      <i className='fa fa-angle-left' aria-hidden='true'></i>
    </button>
  )
}

const settingsTestimonials = {
  dots: true,
  nextArrow: <SliderNextArrow />,
  prevArrow: <SliderPrevArrow />,
  infinite: true,
  variableWidth: true,
  speed: 300,
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    { breakpoint: 1199, settings: { slidesToShow: 3, slidesToScroll: 3, infinite: true } },
    { breakpoint: 991, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1, mobileFirst: true } },
  ],
}

export const GoogleReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([])

  const fetchVehData = () => {
    getReviewsService().then((res) => {
      if (res.success) {
        setReviews(res.data.reviews || [])
      }
    })
  }

  useEffect(() => {
    fetchVehData()
  }, [])

  return (
    <section className='sec-testmonial-client bg-white pt-md-0 pt-5'>
      <div className='container-fluid'>
        <h2 className='text-blue text-center mb-md-5 mb-4' onClick={() => fetchVehData()}>
          Testimonials
        </h2>
        <Slider {...settingsTestimonials}>
          {reviews.map((item, index) => (
            <div key={index} className='item h-100'>
              <div className='testmon-box mb-4 mx-4'>
                <div className='d-flex justify-content-between'>
                  <div className='avator'>
                    <p className='mb-0 text-purple'>
                      <img src={item.profile_photo_url} className='review-author-img img-fluid me-2' alt='' />
                      {item.author_name}
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
                      {item.rating}
                    </p>
                  </div>
                </div>
                <p className='fs-12'>{item.text}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  )
}
