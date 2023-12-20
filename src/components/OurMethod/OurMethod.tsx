import './Ourmethod.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import React from 'react'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import Slider, { CustomArrowProps } from 'react-slick'
import { BeforeAfter } from '@glass/models'

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
      beforeAfterImage: {
        before: process.env.PUBLIC_URL + '/images/before-after/1-before.JPEG',
        after: process.env.PUBLIC_URL + '/images/before-after/1-after.jpg',
      },
      juxtaposeUrl:
        'https://cdn.knightlab.com/libs/juxtapose/latest/embed/index.html?uid=4879b18e-9f32-11ee-9ddd-3f41531135b6',
      title: 'Glass Replacement',
      description:
        'Sa que con comniatur, aut facep ipsum fugiam volorerum nost dignis sin etume con experspernat abo. Dus erovid modiorum rerferibus. Voloreperum faci volupta tibus. Sa que con comniatur, aut facep volorerum nost dignis sin etume con experspernat abo. Dus erovid modiorum rerferibus. Voloreper faci volupta tibus.',
    },
    {
      beforeAfterImage: {
        before: process.env.PUBLIC_URL + '/images/before-after/2-before.jpg',
        after: process.env.PUBLIC_URL + '/images/before-after/2-after.jpg',
      },
      juxtaposeUrl:
        'https://cdn.knightlab.com/libs/juxtapose/latest/embed/index.html?uid=6d1160f4-9f33-11ee-9ddd-3f41531135b6',
      title: 'Glass Replacement',
      description:
        'Sa que con comniatur, aut facep ipsum fugiam volorerum nost dignis sin etume con experspernat abo. Dus erovid modiorum rerferibus. Voloreperum faci volupta tibus. Sa que con comniatur, aut facep volorerum nost dignis sin etume con experspernat abo. Dus erovid modiorum rerferibus. Voloreper faci volupta tibus.',
    },
    {
      beforeAfterImage: {
        before: process.env.PUBLIC_URL + '/images/before-after/3-before.jpg',
        after: process.env.PUBLIC_URL + '/images/before-after/3-after.jpg',
      },
      juxtaposeUrl:
        'https://cdn.knightlab.com/libs/juxtapose/latest/embed/index.html?uid=d0944696-9f33-11ee-9ddd-3f41531135b6',
      title: 'Glass Replacement',
      description:
        'Sa que con comniatur, aut facep ipsum fugiam volorerum nost dignis sin etume con experspernat abo. Dus erovid modiorum rerferibus. Voloreperum faci volupta tibus. Sa que con comniatur, aut facep volorerum nost dignis sin etume con experspernat abo. Dus erovid modiorum rerferibus. Voloreper faci volupta tibus.',
    },
    {
      beforeAfterImage: {
        before: process.env.PUBLIC_URL + '/images/before-after/4-before.jpg',
        after: process.env.PUBLIC_URL + '/images/before-after/4-after.jpg',
      },
      juxtaposeUrl:
        'https://cdn.knightlab.com/libs/juxtapose/latest/embed/index.html?uid=07f03492-9f34-11ee-9ddd-3f41531135b6',
      title: 'Glass Replacement',
      description:
        'Sa que con comniatur, aut facep ipsum fugiam volorerum nost dignis sin etume con experspernat abo. Dus erovid modiorum rerferibus. Voloreperum faci volupta tibus. Sa que con comniatur, aut facep volorerum nost dignis sin etume con experspernat abo. Dus erovid modiorum rerferibus. Voloreper faci volupta tibus.',
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
                    <div className='col-lg-8'>
                      <div className='before-after-img-wrap'>
                        <ReactCompareSlider
                          itemOne={<ReactCompareSliderImage src={item.beforeAfterImage.before} alt='Image one' />}
                          itemTwo={<ReactCompareSliderImage src={item.beforeAfterImage.after} alt='Image two' />}
                        />
                      </div>
                    </div>
                    <div className='col-lg-4 bg-grey bg-md-white'>
                      <div className='p-3 p-md-4 p-lg-5'>
                        <div className='fnt-20 fnt-md-28 text-primary mb-3'>{item.title}</div>
                        <div className='fnt-14 fnt-md-16 text-grey mb-3'>{item.description}</div>
                        <div className='d-flex flex-column gap-3'>
                          <img
                            key='before-image'
                            src={item.beforeAfterImage.before}
                            className='img-fluid extra-image'
                            alt=''
                          />
                          <img
                            key='after-image'
                            src={item.beforeAfterImage.after}
                            className='img-fluid extra-image'
                            alt=''
                          />
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
