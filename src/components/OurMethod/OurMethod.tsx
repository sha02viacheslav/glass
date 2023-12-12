import './Ourmethod.css'
import React from 'react'
import Slider, { CustomArrowProps } from 'react-slick'
import { BeforeAfter } from '@glass/models'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

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

function BeforeAfterImageSliderNextArrow(props: CustomArrowProps) {
  const { onClick } = props
  return (
    <button className='slide-arrow next-arrow before-after-slick-arrow' onClick={onClick}>
      <i className='fa fa-caret-right' aria-hidden='true'></i>
    </button>
  )
}

function BeforeAfterImageSliderPrevArrow(props: CustomArrowProps) {
  const { onClick } = props
  return (
    <button className='slide-arrow prev-arrow before-after-slick-arrow' onClick={onClick}>
      <i className='fa fa-caret-left' aria-hidden='true'></i>
    </button>
  )
}

export type OurMethodProps = { showTitle?: boolean }

export const OurMethod: React.FC<OurMethodProps> = ({ showTitle = true }) => {
  const settings = {
    dots: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SliderNextArrow />,
    prevArrow: <SliderPrevArrow />,
  }

  const imageSliderSettings = {
    dots: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <BeforeAfterImageSliderNextArrow />,
    prevArrow: <BeforeAfterImageSliderPrevArrow />,
  }

  const videos = [
    {
      videoId: 'E23mQ-SrRpI',
      title: 'Ford Transit 2015 Windscreen Replacement',
    },
    {
      videoId: 'OsT-qAPEs4Q',
      title: 'KIA EV6 windscreen replacement',
    },
  ]

  const beforeAfterItems: BeforeAfter[] = [
    {
      beforeAfterImages: [
        process.env.PUBLIC_URL + '/img/gallery/before1.jpg',
        process.env.PUBLIC_URL + '/img/gallery/after1.jpg',
      ],
      title: 'Glass Replacement',
      description:
        'Sa que con comniatur, aut facep ipsum fugiam volorerum nost dignis sin etume con experspernat abo. Dus erovid modiorum rerferibus. Voloreperum faci volupta tibus. Sa que con comniatur, aut facep volorerum nost dignis sin etume con experspernat abo. Dus erovid modiorum rerferibus. Voloreper faci volupta tibus.',
      extraImages: [
        process.env.PUBLIC_URL + '/img/gallery/before1.jpg',
        process.env.PUBLIC_URL + '/img/gallery/after1.jpg',
      ],
    },
    {
      beforeAfterImages: [
        process.env.PUBLIC_URL + '/img/gallery/before1.jpg',
        process.env.PUBLIC_URL + '/img/gallery/after1.jpg',
      ],
      title: 'Glass Replacement',
      description:
        'Sa que con comniatur, aut facep ipsum fugiam volorerum nost dignis sin etume con experspernat abo. Dus erovid modiorum rerferibus. Voloreperum faci volupta tibus. Sa que con comniatur, aut facep volorerum nost dignis sin etume con experspernat abo. Dus erovid modiorum rerferibus. Voloreper faci volupta tibus.',
      extraImages: [
        process.env.PUBLIC_URL + '/img/gallery/before1.jpg',
        process.env.PUBLIC_URL + '/img/gallery/after1.jpg',
      ],
    },
  ]

  return (
    <section className='sec-our-method'>
      <div className='container p-0'>
        {showTitle && (
          <h1 className='fnt-48 fnt-md-60 fw-n text-dark px-4 px-md-5 pt-3 pt-md-0 mb-4 mb-md-5'>Our Method</h1>
        )}
        <div className='row'>
          {videos.map((item, index) => (
            <div key={index} className='col-md-6 mb-3'>
              <iframe
                width='100%'
                className='video-iframe'
                src={'https://www.youtube.com/embed/' + item.videoId}
                frameBorder='0'
                allowFullScreen
              ></iframe>
              <label className='text-primary fnt-20 fnt-md-28 ms-2 mt-2'>{item.title}</label>
            </div>
          ))}
        </div>
        <div className='mt-2 mt-md-5'>
          <div className='position-relative'>
            <Slider {...settings}>
              {beforeAfterItems.map((item, index) => (
                <div key={index} className='item'>
                  <div className='row g-0'>
                    <div className='col-12 col-md-8'>
                      <Slider {...imageSliderSettings} className='before-after-slider'>
                        {item.beforeAfterImages.map((beforeAfterImage, beforeAfterImageIdx) => (
                          <img key={beforeAfterImageIdx} src={beforeAfterImage} className='before-after-img' alt='' />
                        ))}
                      </Slider>
                    </div>
                    <div className='col-md-4 bg-grey bg-md-white'>
                      <div className='p-3 p-md-5'>
                        <div className='fnt-20 fnt-md-28 text-primary mb-3'>{item.title}</div>
                        <div className='fnt-14 fnt-md-16 text-grey mb-3'>{item.description}</div>
                        <div className='d-flex flex-column gap-3'>
                          {item.extraImages.map((extraImage, imageIdx) => (
                            <img key={imageIdx} src={extraImage} className='img-fluid extra-image' alt='' />
                          ))}
                        </div>
                      </div>
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
