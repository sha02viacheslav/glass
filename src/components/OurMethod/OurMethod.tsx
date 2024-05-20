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
  }

  const videos = [
    {
      videoId: '1750125599635468648',
      title: 'Ford Transit 2015 Windscreen Replacement',
    },
    // {
    //   videoId: '1750125069769056477',
    //   title: 'KIA EV6 windscreen replacement',
    // },
  ]

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
        {showTitle && <h1 className='title'>Examples of our work</h1>}

        <div className='mt-2 mt-md-5'>
          <div className='example-work-container'>
            <Slider {...settings}>
              {beforeAfterItems.map((item, index) => (
                <div key={index} className='item'>
                  <div className='row g-0 example-work-card'>
                    <div className={'col-lg-4'}>
                      <div className='mb-3'>
                        <div className='d-flex align-items-center justify-content-between'>
                          <div className='example-work-title'>BMW 1 Series mk2</div>
                          <div className='model'>Model year 2011</div>
                        </div>
                        <div className='description'>{item.description}</div>
                        <div className='d-none d-lg-flex flex-column gap-3 mt-3'>
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
                  </div>
                </div>
              ))}
            </Slider>

            {/* <div className='fnt-20 text-primary prev-next d-md-none'>Prev // Next</div> */}
          </div>
        </div>

        {showVideos && (
          <div>
            <div className='padding-64'></div>
            <div className='sec-video'>
              <div className='sec-video-title'>Glass replacement in action</div>
              <div className='sec-video-description'>
                Watch as our skilled technicians expertly replace windshields with precision and care.
              </div>
              {videos.map((item, index) => (
                <div key={index} className='video-card'>
                  <label className='video-card-title'>{item.title}</label>
                  <div>
                    <blockquote className='twitter-tweet' data-media-max-width='648'>
                      <a href={'https://twitter.com/fix_glass_/status/' + item.videoId + '?ref_src=twsrc%5Etfw'}></a>
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
