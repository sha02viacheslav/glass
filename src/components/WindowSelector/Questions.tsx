import React, { useEffect, useState } from 'react'
import { Box, CardMedia, Typography } from '@mui/material'
import { FormikErrors, FormikTouched } from 'formik'
import Slider from 'react-slick'
import { Characteristic } from '@glass/models'
import { CustomerForm, FormFieldIds } from '@glass/pages/Customer/Customer'
import { QuestionCard } from './QuestionCard'

export type QuestionsProps = {
  characteristics: Characteristic[]
  disabled?: boolean
  touched?: FormikTouched<CustomerForm>
  errors?: FormikErrors<CustomerForm>
  firstErrorIndex?: number
  onChange: (value: Characteristic[]) => void
  setActiveIndex?: (v: number) => void
}

export const Questions: React.FC<QuestionsProps> = ({
  characteristics,
  disabled = false,
  touched,
  errors,
  firstErrorIndex = 0,
  onChange,
  setActiveIndex = () => {},
}) => {
  let sliderRef: Slider | null = null
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const handleChangeIndex = (index: number) => {
    setActiveIndex(index)
    setCurrentIndex(index)
  }

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    afterChange: (index: number) => {
      handleChangeIndex(index)
    },
  }

  const handleChangeCharacteristic = (value: Characteristic) => {
    onChange(
      characteristics.map((item) => {
        if (item.id === value.id) {
          return value
        }
        return item
      }),
    )
  }

  useEffect(() => {
    handleChangeIndex(firstErrorIndex)
    sliderRef?.slickGoTo(firstErrorIndex)
  }, [firstErrorIndex])

  return (
    <>
      <Box id={FormFieldIds.CHARACTERISTICS} sx={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: 4 }}>
        <Typography
          sx={{
            color: 'var(--Gray-600, #6A6B71)',
            fontSize: '16px',
            fontWeight: '400',
            lineHeight: '24px',
            letterSpacing: '-0.16px',
          }}
        >
          Question{' '}
          <Typography sx={{ display: 'inline', color: 'var(--Gray-800, #14151F)' }} component='span'>
            {currentIndex + 1}
          </Typography>
          /{characteristics.length}
        </Typography>

        <Box sx={{ display: 'flex', gap: 5 }}>
          <CardMedia
            component='img'
            sx={{ width: 24, height: 24, cursor: 'pointer' }}
            image={process.env.PUBLIC_URL + '/images/chevron-left-gray.svg'}
            onClick={() => {
              sliderRef?.slickPrev()
            }}
          />
          <CardMedia
            component='img'
            sx={{ width: 24, height: 24, cursor: 'pointer' }}
            image={process.env.PUBLIC_URL + '/images/chevron-right-gray.svg'}
            onClick={() => {
              sliderRef?.slickNext()
            }}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Box
          sx={{
            position: 'relative',
            m: -2,
          }}
        >
          <Slider
            ref={(slider) => {
              sliderRef = slider
            }}
            {...sliderSettings}
          >
            {characteristics.map((item, index) => (
              <Box key={index}>
                <Box sx={{ m: 2 }}>
                  <QuestionCard
                    characteristic={item}
                    disabled={disabled}
                    hasError={touched?.characteristics && !!errors?.characteristics?.[index]}
                    onChange={(value) => handleChangeCharacteristic(value)}
                  ></QuestionCard>
                  {touched?.characteristics && !!errors?.characteristics?.[index] && (
                    <small className='form-error'>Please answer this question</small>
                  )}
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>
      </Box>
    </>
  )
}
