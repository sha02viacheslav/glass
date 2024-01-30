import './Ourmethod.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import React, { useEffect, useState } from 'react'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import Slider, { CustomArrowProps } from 'react-slick'
import { BeforeAfterType } from '@glass/enums'
import { REACT_APP_API_DOMAIN_URL } from '@glass/envs'
import { BeforeAfter } from '@glass/models'
import { beforeAfterService } from '@glass/services/apis/before-after.service'

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

export type OurMethodProps = {
  beforeAfterType?: BeforeAfterType
  beforeAfterImages?: BeforeAfter[]
  showTitle?: boolean
  showVideos?: boolean
}

export const OurMethod: React.FC<OurMethodProps> = ({
  beforeAfterType,
  beforeAfterImages,
  showTitle = true,
  showVideos = true,
}) => {
  const settings = {
    dots: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SliderNextArrow />,
    prevArrow: <SliderPrevArrow />,
    beforeChange: () => {
      setShowDetails(undefined)
    },
  }

  const videos = [
    {
      videoId: '1750125599635468648',
      title: 'Ford Transit 2015 Windscreen Replacement',
    },
    {
      videoId: '1750125069769056477',
      title: 'KIA EV6 windscreen replacement',
    },
  ]

  const [showDetails, setShowDetails] = useState<number>()
  const [beforeAfterItems, setBeforeAfterItems] = useState<BeforeAfter[]>([])

  const handleTouchStartSlider = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  const getBeforeAfterImages = () => {
    if (beforeAfterType) {
      beforeAfterService(beforeAfterType).then((res) => {
        if (res.success) {
          setBeforeAfterItems(res.data)
        }
      })
    }
  }

  useEffect(() => {
    if (beforeAfterImages?.length) {
      setBeforeAfterItems(beforeAfterImages)
    } else if (beforeAfterType) {
      getBeforeAfterImages()
    }
  }, [beforeAfterType, beforeAfterImages])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <section className='sec-our-method'>
      <div className='container p-0'>
        {showTitle && (
          <h1 className='fnt-48 fnt-md-60 fw-n text-dark px-4 px-md-5 pt-3 pt-md-0 mb-4 mb-md-5'>Our Method</h1>
        )}
        {showVideos && (
          <div className='row'>
            {videos.map((item, index) => (
              <div key={index} className='col-md-6 mb-3'>
                <div>
                  <blockquote className='twitter-tweet' data-media-max-width='648'>
                    <a href={'https://twitter.com/fix_glass_/status/' + item.videoId + '?ref_src=twsrc%5Etfw'}></a>
                  </blockquote>
                </div>
                <label className='text-primary fnt-20 fnt-md-28 ms-2 mt-2'>{item.title}</label>
              </div>
            ))}
          </div>
        )}
        <div className='mt-2 mt-md-5'>
          <div className='position-relative'>
            <Slider {...settings}>
              {beforeAfterItems.map((item, index) => (
                <div key={index} className='item'>
                  <div className='row g-0'>
                    <div className='col-lg-8'>
                      <div className='before-after-img-wrap' onTouchStart={(e) => handleTouchStartSlider(e)}>
                        <ReactCompareSlider
                          itemOne={
                            <ReactCompareSliderImage
                              src={REACT_APP_API_DOMAIN_URL + item.before_880_url}
                              alt='Image one'
                            />
                          }
                          itemTwo={
                            <ReactCompareSliderImage
                              src={REACT_APP_API_DOMAIN_URL + item.after_880_url}
                              alt='Image two'
                            />
                          }
                        />
                      </div>
                    </div>
                    <div
                      className={
                        'col-lg-4 bg-grey bg-md-white repair-details' + (showDetails === index ? ' fadeIn' : '')
                      }
                    >
                      <div className='p-3 p-md-4 p-lg-5'>
                        <div className='fnt-20 fnt-md-28 text-primary mb-3'>{item.description}</div>
                        <div className='d-flex flex-column gap-3'>
                          <img
                            key='before-image'
                            src={REACT_APP_API_DOMAIN_URL + item.before_880_url}
                            className='img-fluid extra-image'
                            alt=''
                          />
                          <img
                            key='after-image'
                            src={REACT_APP_API_DOMAIN_URL + item.after_880_url}
                            className='img-fluid extra-image'
                            alt=''
                          />
                        </div>
                      </div>
                    </div>
                    <div className='d-flex d-lg-none justify-content-center p-4'>
                      {showDetails === index ? (
                        <button className='btn-stroked round transparent' onClick={() => setShowDetails(undefined)}>
                          Hide Repair Details
                          <i className='fa-solid fa-caret-up ms-2 mt-1 fnt-20'></i>
                        </button>
                      ) : (
                        <button className='btn-stroked round transparent' onClick={() => setShowDetails(index)}>
                          Repair Details
                          <i className='fa-solid fa-caret-down ms-2 fnt-20'></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Slider>

            <div className='fnt-20 text-primary prev-next d-md-none'>Prev // Next</div>
          </div>
        </div>
      </div>
    </section>
  )
}
