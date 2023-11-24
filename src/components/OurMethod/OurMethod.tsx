import './Ourmethod.css'
import React from 'react'
import Slider, { CustomArrowProps } from 'react-slick'
import { PUBLIC_URL } from '@glass/envs'
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
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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

  const videos = [
    {
      url: PUBLIC_URL + '/images/poster.png',
      title: 'Video Title #01',
    },
    {
      url: PUBLIC_URL + '/images/poster.png',
      title: 'Video Title #01',
    },
  ]

  const beforeAfterItems: BeforeAfter[] = [
    {
      before: process.env.PUBLIC_URL + '/img/gallery/before1.jpg',
      after: process.env.PUBLIC_URL + '/img/gallery/after1.jpg',
      title: 'Glass Replacement',
      description:
        'Sa que con comniatur, aut facep ipsum fugiam volorerum nost dignis sin etume con experspernat abo. Dus erovid modiorum rerferibus. Voloreperum faci volupta tibus. Sa que con comniatur, aut facep volorerum nost dignis sin etume con experspernat abo. Dus erovid modiorum rerferibus. Voloreper faci volupta tibus.',
      extraImages: [
        process.env.PUBLIC_URL + '/img/gallery/before1.jpg',
        process.env.PUBLIC_URL + '/img/gallery/after1.jpg',
      ],
    },
    {
      before: process.env.PUBLIC_URL + '/img/gallery/before1.jpg',
      after: process.env.PUBLIC_URL + '/img/gallery/after1.jpg',
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
              <video width='100%' controls poster={item.url}>
                <source src='https://media.w3.org/2010/05/sintel/trailer_hd.mp4' type='video/mp4' />
              </video>
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
                    <div className='col-6 col-md-4'>
                      <div className='item-img odd animated fadeIn h-100'>
                        <img src={item.before} className='img-fluid h-100 before-after-img' alt='' />
                      </div>
                    </div>
                    <div className='col-6 col-md-4'>
                      <div className='item-img even animated fadeIn h-100'>
                        <img src={item.after} className='img-fluid h-100 before-after-img' alt='' />
                      </div>
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
