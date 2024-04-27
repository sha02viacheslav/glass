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
              <div className='d-flex justify-content-between'>
                <div className='name-wrap'>
                  <Link to={item.author_url} target='_blank'>
                    <img src={item.profile_photo_url} className='review-author-img' alt='' />
                  </Link>
                  <div>
                    <Link to={item.author_url} target='_blank' className='name'>
                      {item.author_name}
                    </Link>
                    <div className='d-flex align-items-center'>
                      <img src={process.env.PUBLIC_URL + '/images/star.svg'} className='img-fluid' alt='' />
                      <img src={process.env.PUBLIC_URL + '/images/star.svg'} className='img-fluid' alt='' />
                      <img src={process.env.PUBLIC_URL + '/images/star.svg'} className='img-fluid' alt='' />
                      <img src={process.env.PUBLIC_URL + '/images/star.svg'} className='img-fluid' alt='' />
                      <img src={process.env.PUBLIC_URL + '/images/star.svg'} className='img-fluid' alt='' />
                    </div>
                  </div>
                </div>
                <div className='d-flex flex-column align-items-end justify-content-between'>
                  <img src={process.env.PUBLIC_URL + '/images/google-icon.svg'} className='img-fluid' alt='' />
                  <div className='date'> {pastTime(item.time * 1000)}</div>
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
