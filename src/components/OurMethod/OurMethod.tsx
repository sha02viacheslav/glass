import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
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
    nextArrow: <SliderNextArrow />,
    prevArrow: <SliderPrevArrow />,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 991, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 575, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
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
    <Box>
      <Box className='container'>
        {showTitle && (
          <Typography
            component='h2'
            sx={{
              color: 'var(--Gray-800, #14151f)',
              textAlign: 'center',
              fontSize: { xs: 30, lg: 36 },
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '120%',
              letterSpacing: '-0.3px',
              marginBottom: { xs: 6, lg: 12 },
            }}
          >
            Examples of our work
          </Typography>
        )}

        <Box
          sx={{
            mx: { xs: 0, md: -3, lg: -6 },
            '.next-arrow': { transform: 'translate(-24px, 100%)' },
            '.prev-arrow': { transform: 'translate(calc(-100% - 24px), 100%)' },
          }}
        >
          <Slider {...settings}>
            {beforeAfterItems.map((item, index) => (
              <Box key={index}>
                <Box sx={{ mx: { xs: 0, md: 3, lg: 6 } }}>
                  <div className='mb-3'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <Typography sx={{ fontWeight: 700, lineHeight: '140%' }}>BMW 1 Series mk2</Typography>
                      <Typography
                        sx={{
                          color: 'var(--Gray-600, #6a6b71)',
                          fontSize: '12px',
                          fontWeight: 300,
                          lineHeight: '140%',
                        }}
                      >
                        Model year 2011
                      </Typography>
                    </div>
                    <Typography
                      sx={{
                        marginTop: '16px',
                        height: '54px',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: 'var(--Gray-700, #474747)',
                        fontSize: '16px',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        lineHeight: '170%',
                      }}
                    >
                      {item.description}
                    </Typography>
                  </div>
                  <Box
                    sx={{ width: '100%', height: '100%', display: 'flex' }}
                    onTouchStart={(e) => handleTouchStartSlider(e)}
                  >
                    <ReactCompareSlider
                      itemOne={
                        <ReactCompareSliderImage src={REACT_APP_API_DOMAIN_URL + item.before_880_url} alt='Image one' />
                      }
                      itemTwo={
                        <ReactCompareSliderImage src={REACT_APP_API_DOMAIN_URL + item.after_880_url} alt='Image two' />
                      }
                    />
                  </Box>
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>
      </Box>

      <Box sx={{ p: { xs: 8, lg: 12 } }}></Box>

      {showVideos && (
        <Box sx={{ p: { xs: '32px 0 24px', lg: '64px 0 128px' }, background: '#fff' }}>
          <Box className='container'>
            <Typography
              sx={{
                fontSize: { xs: 24, lg: 36 },
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: { xs: '120%', lg: '112%' },
                letterSpacing: '-0.24px',
                marginBottom: 3,
              }}
            >
              Glass replacement in action
            </Typography>
            <Typography
              sx={{
                color: 'var(--Gray-700, #474747)',
                fontSize: { xs: 16, lg: 20 },
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: { xs: '170%', lg: '150%' },
                marginBottom: { xs: 4, lg: 8 },
              }}
            >
              Watch as our skilled technicians expertly replace windshields with precision and care.
            </Typography>
            {videos.map((item, index) => (
              <Box key={index}>
                <Typography
                  sx={{
                    fontSize: { xs: 14, lg: 24 },
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: { xs: '16px', lg: '124%' },
                  }}
                >
                  {item.title}
                </Typography>
                <Box>
                  <blockquote className='twitter-tweet' data-media-max-width='1200'>
                    <a href={'https://twitter.com/fix_glass_/status/' + item.videoId + '?ref_src=twsrc%5Etfw'}></a>
                  </blockquote>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}
