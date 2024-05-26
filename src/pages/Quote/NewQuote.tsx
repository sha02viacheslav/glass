import React, { useEffect, useState } from 'react'
import { Box, Button, CardMedia, Typography } from '@mui/material'
import moment from 'moment'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AddPictures } from '@glass/components/AddPictures'
import { Footer } from '@glass/components/Footer'
import { LicensePlate } from '@glass/components/LicensePlate'
import { OurMethod } from '@glass/components/OurMethod'
import { Partners } from '@glass/components/Partners/Partners'
import { QuickContact } from '@glass/components/QuickContact'
import { WindowSelector } from '@glass/components/WindowSelector'
import { SLOT_LEGENDS } from '@glass/constants'
import { BeforeAfterType, CarType, InquiryStep } from '@glass/enums'
import { useRetrieveVehData } from '@glass/hooks/useRetrieveVehData'
import { Quote } from '@glass/models'
import { formatAddress } from '@glass/utils/format-address/format-address.util'
import { slotStartTime, slotTimeIndex, workingPlaceLabel } from '@glass/utils/index'
import { CheckingQuote } from './CheckingQuote'
import { InstallmentBenefits } from '../Home/InstallmentBenefits'
import { LiveService } from '../Home/LiveService'
import { Testimonials } from '../Home/Testimonials'

export type NewQuoteProps = {
  quoteDetails: Quote
}

export const NewQuote: React.FC<NewQuoteProps> = ({ quoteDetails }) => {
  const { id: quoteId } = useParams()
  const navigate = useNavigate()

  const [selectedCarType, setSelectedCarType] = useState<CarType>(CarType.THREE_DOOR)

  useRetrieveVehData(quoteDetails?.DoorPlanLiteral, (data: CarType) => {
    setSelectedCarType(data)
  })

  const backToEditQuote = (step: InquiryStep) => {
    const licenseReg = quoteDetails?.registration_number.replace(' ', '')
    navigate(`/customer/edit/${licenseReg}/${quoteId}/${step}`)
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <Box sx={{ marginBottom: 32 }} className='container'>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 8, lg: 24 } }}>
          <Box sx={{ flex: '1' }}>
            <CheckingQuote quoteDetails={quoteDetails} />

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Link to='/process'>
                <Button
                  sx={{
                    display: { xs: 'none', lg: 'inline-flex' },
                    paddingX: 6,
                    paddingY: 3,
                    fontSize: 18,
                    fontWeight: '700',
                    lineHeight: '24px',
                    letterSpacing: '0.18px',
                    color: 'var(--Light-Blue---Primary-600, #133F85)',
                    background: 'var(--Light-Blue---Primary-000, #E8F0FE)',
                    boxShadow:
                      '0px 3px 8px 0px rgba(88, 86, 94, 0.08), 0px 2px 4px 0px rgba(88, 86, 94, 0.10), 0px 1px 2px 0px rgba(88, 86, 94, 0.12)',
                    marginTop: 12,
                  }}
                >
                  How our process works
                  <CardMedia
                    component='img'
                    sx={{ width: 24, height: 24, marginLeft: 2 }}
                    image={process.env.PUBLIC_URL + '/images/arrow-right-light-blue.svg'}
                    alt='Minus'
                  />
                </Button>
              </Link>
            </Box>
          </Box>

          <Box
            sx={{
              flex: '1',
              padding: { xs: 3, lg: 12 },
              marginBottom: 6,
              borderRadius: '16px',
              background: { lg: '#fff' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: 'var(--12, 12px) var(--16, 16px)',
                alignItems: 'flex-start',
                gap: 1,
                borderRadius: '2px',
                border: '1px solid var(--Dark-Blue---Accent-500, #4522C2)',
                background:
                  'linear-gradient(0deg, var(--Dark-Blue---Accent-00, #ECE8FE) 0%, var(--Dark-Blue---Accent-00, #ECE8FE) 100%), #F7F9FC',
              }}
            >
              <Box sx={{ display: 'flex', gap: 'var(--8, 8px)' }}>
                <CardMedia
                  component='img'
                  sx={{ width: { xs: 24, lg: 32 }, height: { xs: 24, lg: 32 } }}
                  image={process.env.PUBLIC_URL + '/images/information-dark.svg'}
                />
                <Typography
                  sx={{
                    color: 'var(--Dark-Blue---Accent-800, #090221)',
                    fontSize: { xs: 16, lg: 20 },
                    fontWeight: '700',
                    lineHeight: '150%',
                    letterSpacing: '0.8px',
                  }}
                >
                  YOUR INFO IS CRUCIAL
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: 'var(--Light-Blue---Primary-700, #081F44)',
                  fontSize: { xs: 16, lg: 20 },
                  lineHeight: '170%',
                }}
              >
                Your input is key for selecting the right glass. Feel free to review and edit it anytime.
              </Typography>
            </Box>

            <Box
              sx={{
                paddingBottom: { xs: 6, lg: 12 },
                marginTop: { xs: 4, lg: 6 },
                borderBottom: '1px solid var(--Gray-100, #f2f2f3)',
              }}
            >
              <Typography
                sx={{
                  color: 'var(--Gray-600, #6A6B71)',
                  fontSize: { xs: 12, lg: 16 },
                  fontWeight: '700',
                  lineHeight: '150%',
                  letterSpacing: '0.84px',
                  textTransform: 'uppercase',
                }}
              >
                CAR DETAILS
              </Typography>

              <Box sx={{ width: '94px', marginTop: 3 }}>
                <Box sx={{ zoom: { xs: 0.3, lg: 0.75 } }}>
                  <LicensePlate disabled={true} licenseNumber={quoteDetails.registration_number} />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, marginTop: 4 }}>
                {!!quoteDetails.vehicle_logo_url && (
                  <CardMedia
                    component='img'
                    sx={{ width: 'auto', height: { xs: 20, lg: 45 } }}
                    image={quoteDetails.vehicle_logo_url}
                  />
                )}
                <Typography
                  sx={{
                    color: 'var(--Gray-800, #14151F)',
                    fontSize: { xs: 14, lg: 30 },
                    fontWeight: '400',
                    lineHeight: '150%',
                  }}
                >
                  {quoteDetails?.make} {quoteDetails?.model}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                borderBottom: '1px solid var(--Gray-100, #f2f2f3)',
                paddingBottom: { xs: 6, lg: 12 },
                marginTop: { xs: 6, lg: 12 },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  sx={{
                    color: 'var(--Gray-600, #6A6B71)',
                    fontSize: { xs: 12, lg: 16 },
                    fontWeight: '700',
                    lineHeight: '150%',
                    letterSpacing: '0.84px',
                    textTransform: 'uppercase',
                  }}
                >
                  Service type and location
                </Typography>
                <button
                  type='button'
                  className='btn-link xs'
                  onClick={() => {
                    backToEditQuote(InquiryStep.STEP1)
                  }}
                >
                  EDIT
                </button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: { xs: 3, lg: 6 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: { xs: 2, lg: 4 },
                    fontSize: { xs: 14, lg: 20 },
                    lineHeight: { xs: '150%', lg: '120%' },
                  }}
                >
                  <CardMedia
                    component='img'
                    sx={{ width: { xs: 20, lg: 24 }, height: { xs: 20, lg: 24 } }}
                    image={process.env.PUBLIC_URL + '/images/wrench.svg'}
                  />
                  {workingPlaceLabel(quoteDetails.working_place)}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: { xs: 2, lg: 4 },
                    fontSize: { xs: 14, lg: 20 },
                    lineHeight: { xs: '150%', lg: '120%' },
                  }}
                >
                  <CardMedia
                    component='img'
                    sx={{ width: { xs: 20, lg: 24 }, height: { xs: 20, lg: 24 } }}
                    image={process.env.PUBLIC_URL + '/images/map-marker-blue.svg'}
                  />
                  {formatAddress(quoteDetails.delivery_address)}
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                borderBottom: '1px solid var(--Gray-100, #f2f2f3)',
                paddingBottom: { xs: 6, lg: 12 },
                marginTop: { xs: 6, lg: 12 },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  sx={{
                    color: 'var(--Gray-600, #6A6B71)',
                    fontSize: { xs: 12, lg: 16 },
                    fontWeight: '700',
                    lineHeight: '150%',
                    letterSpacing: '0.84px',
                    textTransform: 'uppercase',
                  }}
                >
                  Broken glass
                </Typography>
                <button
                  type='button'
                  className='btn-link xs'
                  onClick={() => {
                    backToEditQuote(InquiryStep.STEP2)
                  }}
                >
                  EDIT
                </button>
              </Box>
              <Box
                sx={{
                  padding: { xs: 3, lg: 6 },
                  border: '1px solid var(--Gray-200, #EAEAEB)',
                  borderRadius: 2,
                  marginTop: { xs: 3, lg: 6 },
                }}
              >
                <WindowSelector
                  disabled={true}
                  carType={selectedCarType}
                  registrationNumber={quoteDetails.registration_number}
                  selectedGlasses={quoteDetails.glass_location}
                />
              </Box>
            </Box>

            <Box
              sx={{
                borderBottom: '1px solid var(--Gray-100, #f2f2f3)',
                paddingBottom: { xs: 6, lg: 12 },
                marginTop: { xs: 6, lg: 12 },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  sx={{
                    color: 'var(--Gray-600, #6A6B71)',
                    fontSize: { xs: 12, lg: 16 },
                    fontWeight: '700',
                    lineHeight: '150%',
                    letterSpacing: '0.84px',
                    textTransform: 'uppercase',
                  }}
                >
                  Your images and comment
                </Typography>
                <button
                  type='button'
                  className='btn-link xs'
                  onClick={() => {
                    backToEditQuote(InquiryStep.STEP3)
                  }}
                >
                  EDIT
                </button>
              </Box>

              <Typography
                sx={{
                  fontSize: { xs: 14, lg: 20 },
                  lineHeight: '150%',
                  marginTop: { xs: 3, lg: 6 },
                }}
              >
                Broken glass pictures or videos
              </Typography>
              <AddPictures attachments={quoteDetails.customer_attachments} disabled={true} />

              <Box sx={{ marginTop: 3 }}>
                <Typography sx={{ fontSize: { xs: 14, lg: 20 }, fontWeight: '600', lineHeight: '150%' }}>
                  Additional comments
                </Typography>
                <Typography
                  sx={{
                    color: 'var(--Gray-600, #6A6B71)',
                    fontSize: { xs: 14, lg: 20 },
                    fontWeight: '600',
                    lineHeight: '150%',
                    marginTop: 1,
                  }}
                >
                  {quoteDetails.customer_comment}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                borderBottom: '1px solid var(--Gray-100, #f2f2f3)',
                paddingBottom: { xs: 6, lg: 12 },
                marginTop: { xs: 6, lg: 12 },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  sx={{
                    color: 'var(--Gray-600, #6A6B71)',
                    fontSize: { xs: 12, lg: 16 },
                    fontWeight: '700',
                    lineHeight: '150%',
                    letterSpacing: '0.84px',
                    textTransform: 'uppercase',
                  }}
                >
                  Your personal info
                </Typography>
                <button
                  type='button'
                  className='btn-link xs'
                  onClick={() => {
                    backToEditQuote(InquiryStep.STEP4)
                  }}
                >
                  EDIT
                </button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: { xs: 3, lg: 6 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: { xs: 2, lg: 4 },
                    fontSize: { xs: 14, lg: 20 },
                    lineHeight: { xs: '150%', lg: '120%' },
                  }}
                >
                  <CardMedia
                    component='img'
                    sx={{ width: { xs: 20, LG: 24 }, height: { XS: 20, LG: 24 } }}
                    image={process.env.PUBLIC_URL + '/images/account-blue.svg'}
                  />
                  {quoteDetails.customer_f_name} {quoteDetails.customer_s_name}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: { xs: 2, lg: 4 },
                    fontSize: { xs: 14, lg: 20 },
                    lineHeight: { xs: '150%', lg: '120%' },
                  }}
                >
                  <CardMedia
                    component='img'
                    sx={{ width: { xs: 20, LG: 24 }, height: { XS: 20, LG: 24 } }}
                    image={process.env.PUBLIC_URL + '/images/email-dark-blue.svg'}
                  />
                  {quoteDetails.customer_phone}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: { xs: 2, lg: 4 },
                    fontSize: { xs: 14, lg: 20 },
                    lineHeight: { xs: '150%', lg: '120%' },
                  }}
                >
                  <CardMedia
                    component='img'
                    sx={{ width: { xs: 20, LG: 24 }, height: { XS: 20, LG: 24 } }}
                    image={process.env.PUBLIC_URL + '/images/phone-dark-blue.svg'}
                  />
                  {quoteDetails.customer_email}
                </Box>
              </Box>
            </Box>

            <Box sx={{ marginTop: { xs: 6, lg: 12 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  sx={{
                    color: 'var(--Gray-600, #6A6B71)',
                    fontSize: { xs: 12, lg: 16 },
                    fontWeight: '700',
                    lineHeight: '150%',
                    letterSpacing: '0.84px',
                    textTransform: 'uppercase',
                  }}
                >
                  Preferred repair dates
                </Typography>
                <button
                  type='button'
                  className='btn-link xs'
                  onClick={() => {
                    backToEditQuote(InquiryStep.STEP5)
                  }}
                >
                  EDIT
                </button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: { xs: 3, lg: 6 } }}>
                {quoteDetails.request_booking.map((item, index) => (
                  <Typography
                    key={index}
                    sx={{ fontSize: { xs: 14, lg: 20 }, lineHeight: '20px', letterSpacing: '0.7px' }}
                  >
                    {moment(item.request_booking_date).format('dddd')}{' '}
                    {
                      SLOT_LEGENDS[slotTimeIndex(slotStartTime(item.request_booking_date, item.request_time_slot))]
                        .title
                    }
                    , {moment(item.request_booking_date).format('Do MMMM')}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        <Link to='/process'>
          <Button
            sx={{
              display: { xs: 'inline-flex', lg: 'none' },
              width: '100%',
              paddingX: 6,
              paddingY: 3,
              fontSize: 18,
              fontWeight: '700',
              lineHeight: '24px',
              letterSpacing: '0.18px',
              color: 'var(--Light-Blue---Primary-600, #133F85)',
              background: 'var(--Light-Blue---Primary-000, #E8F0FE)',
              boxShadow:
                '0px 3px 8px 0px rgba(88, 86, 94, 0.08), 0px 2px 4px 0px rgba(88, 86, 94, 0.10), 0px 1px 2px 0px rgba(88, 86, 94, 0.12)',
              marginTop: 12,
            }}
          >
            How our process works
            <CardMedia
              component='img'
              sx={{ width: 24, height: 24, marginLeft: 2 }}
              image={process.env.PUBLIC_URL + '/images/arrow-right-light-blue.svg'}
              alt='Minus'
            />
          </Button>
        </Link>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { lg: 'row-reverse' },
            alignItems: 'stretch',
            gap: { xs: 6, lg: 15 },
            borderRadius: '2px',
            background: '#fff',
            boxShadow:
              '0px 4px 17px 0px rgba(147, 147, 147, 0.04), 0px 2px 12px 0px rgba(147, 147, 147, 0.07), 0px 1px 7px 0px rgba(147, 147, 147, 0.09)',
            marginTop: 16,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              padding: { xs: '16px 0 16px 12px', lg: '64px 64px 64px 0' },
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 'var(--8, 8px)',
              flex: '1 0 0',
              alignSelf: 'stretch',
            }}
          >
            <Typography
              sx={{
                color: 'var(--Gray-800, #14151f)',
                fontSize: { xs: 16, lg: 36 },
                fontWeight: '700',
                lineHeight: '140%',
                textTransform: 'uppercase',
              }}
            >
              Free gift is coming!
            </Typography>
            <Typography
              sx={{
                color: 'var(--Gray-600, #6a6b71)',
                fontSize: { xs: 16, lg: 24 },
                lineHeight: '170%',
                letterSpacing: '-0.16px',
                marginTop: 2,
              }}
            >
              We prepared a free gift for you! You’ll find out soon.
            </Typography>
          </Box>
          <CardMedia
            component='img'
            image={process.env.PUBLIC_URL + '/images/free-gift.png'}
            sx={{
              width: { xs: 128, lg: 276 },
              objectFit: 'cover',
              objectPosition: 'center',
              borderRadius: '0 2px 2px 0',
            }}
          />
        </Box>

        <Box sx={{ p: 8 }}></Box>

        <OurMethod beforeAfterType={BeforeAfterType.ALL} showVideos={false} />

        <Box sx={{ p: 8 }}></Box>

        <LiveService />

        <Box sx={{ p: 8 }}></Box>

        <InstallmentBenefits />

        <Box sx={{ p: 8 }}></Box>

        <Partners />

        <Box sx={{ p: 8 }}></Box>

        <Testimonials />
      </Box>

      <QuickContact showReg={false} />
      <Footer />
    </>
  )
}
