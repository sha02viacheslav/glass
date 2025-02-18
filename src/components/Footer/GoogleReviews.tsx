import './GoogleReviews.css'
import React from 'react'
import { Link } from 'react-router-dom'
import Slider, { CustomArrowProps } from 'react-slick'
import { GOOGLE_REVIEWS } from '@glass/constants'
import { pastTime } from '@glass/utils/past-time/past-time.util'

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
  dots: false,
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
  return (
    <div className='reviews-container'>
      <Slider {...settingsTestimonials}>
        {GOOGLE_REVIEWS.map((item, index) => (
          <div key={index} className='item h-100'>
            <div className='review-box'>
              <div className='header-wrap'>
                <Link to={item.author_url} target='_blank'>
                  <img src={item.profile_photo_url} className='review-author-img' alt='' />
                </Link>
                <div className='name-wrap'>
                  <div className='d-flex align-items-center justify-content-between'>
                    <Link to={item.author_url} target='_blank' className='name'>
                      {item.author_name}
                    </Link>

                    <img src={process.env.PUBLIC_URL + '/images/google-icon.svg'} className='img-fluid' alt='' />
                  </div>
                  <div className='d-flex align-items-center justify-content-between'>
                    <div className='d-flex align-items-center'>
                      {[1, 2, 3, 4, 5].map((index) => (
                        <img
                          key={index}
                          src={process.env.PUBLIC_URL + '/images/star.svg'}
                          className='img-fluid'
                          alt=''
                        />
                      ))}
                    </div>

                    <div className='date'> {pastTime(item.time * 1000)}</div>
                  </div>
                </div>
              </div>

              <div className='review-content'>{item.text}</div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}
