import React, { useState } from 'react'
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
import { ReadyQuote } from './ReadyQuote'
import { InstallmentBenefits } from '../Home/InstallmentBenefits'
import { LiveService } from '../Home/LiveService'
import { Testimonials } from '../Home/Testimonials'

export type PendingQuoteProps = {
  quoteDetails: Quote
  onContinue: () => void
}

export const PendingQuote: React.FC<PendingQuoteProps> = ({ quoteDetails, onContinue }) => {
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

  return (
    <>
      <Box sx={{ paddingX: 4, marginBottom: 32 }}>
        {quoteDetails.is_published ? (
          <Box sx={{ cursor: 'pointer' }} onClick={() => onContinue()}>
            <ReadyQuote quoteDetails={quoteDetails} />
          </Box>
        ) : (
          <CheckingQuote quoteDetails={quoteDetails} />
        )}

        <Box sx={{ padding: 3, marginTop: 8, marginBottom: 6 }}>
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
                sx={{ width: 24, height: 24 }}
                image={process.env.PUBLIC_URL + '/images/information-dark.svg'}
                alt='Minus'
              />
              <Typography
                sx={{
                  color: 'var(--Dark-Blue---Accent-800, #090221)',
                  fontWeight: '700',
                  lineHeight: '150%',
                  letterSpacing: '0.8px',
                }}
              >
                YOUR INFO IS CRUCIAL
              </Typography>
            </Box>
            <Typography sx={{ color: 'var(--Light-Blue---Primary-700, #081F44)', lineHeight: '170%' }}>
              Your input is key for selecting the right glass. Feel free to review and edit it anytime.
            </Typography>
          </Box>

          <Box sx={{ paddingBottom: 6, marginTop: 4, borderBottom: '1px solid var(--Gray-100, #f2f2f3)' }}>
            <Typography
              sx={{
                color: 'var(--Gray-600, #6A6B71)',
                fontSize: '12px',
                fontWeight: '700',
                lineHeight: '150%',
                letterSpacing: '0.84px',
                textTransform: 'uppercase',
              }}
            >
              CAR DETAILS
            </Typography>

            <Box sx={{ width: '94px', marginTop: 3 }}>
              <Box sx={{ zoom: 0.3 }}>
                <LicensePlate disabled={true} licenseNumber={quoteDetails.registration_number} />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, marginTop: 4 }}>
              {!!quoteDetails.vehicle_logo_url && (
                <CardMedia component='img' sx={{ width: 'auto', height: 20 }} image={quoteDetails.vehicle_logo_url} />
              )}
              <Typography
                sx={{
                  color: 'var(--Gray-800, #14151F)',
                  fontSize: '14px',
                  fontWeight: '400',
                  lineHeight: '150%',
                }}
              >
                {quoteDetails?.make}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ borderBottom: '1px solid var(--Gray-100, #f2f2f3)', paddingBottom: 6, marginTop: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography
                sx={{
                  color: 'var(--Gray-600, #6A6B71)',
                  fontSize: '12px',
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, fontSize: '14px', lineHeight: '150%' }}>
                <CardMedia
                  component='img'
                  sx={{ width: 20, height: 20 }}
                  image={process.env.PUBLIC_URL + '/images/wrench.svg'}
                />
                {workingPlaceLabel(quoteDetails.working_place)}
              </Box>
              <Box sx={{ display: 'flex', gap: 2, fontSize: '14px', lineHeight: '150%' }}>
                <CardMedia
                  component='img'
                  sx={{ width: 20, height: 20 }}
                  image={process.env.PUBLIC_URL + '/images/map-marker-blue.svg'}
                />
                {formatAddress(quoteDetails.delivery_address)}
              </Box>
            </Box>
          </Box>

          <Box sx={{ borderBottom: '1px solid var(--Gray-100, #f2f2f3)', paddingBottom: 6, marginTop: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography
                sx={{
                  color: 'var(--Gray-600, #6A6B71)',
                  fontSize: '12px',
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
                padding: 3,
                border: '1px solid var(--Gray-200, #EAEAEB)',
                borderRadius: 2,
                marginTop: 3,
                height: 75,
                overflow: 'hidden',
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

          <Box sx={{ borderBottom: '1px solid var(--Gray-100, #f2f2f3)', paddingBottom: 6, marginTop: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography
                sx={{
                  color: 'var(--Gray-600, #6A6B71)',
                  fontSize: '12px',
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
                fontSize: '14px',
                lineHeight: '150%',
                marginTop: 3,
              }}
            >
              Broken glass pictures or videos
            </Typography>
            <AddPictures attachments={quoteDetails.customer_attachments} disabled={true} />

            <Box sx={{ marginTop: 3 }}>
              <Typography sx={{ fontSize: '14px', fontWeight: '600', lineHeight: '150%' }}>
                Additional comments
              </Typography>
              <Typography
                sx={{
                  color: 'var(--Gray-600, #6A6B71)',
                  fontSize: '14px',
                  fontWeight: '600',
                  lineHeight: '150%',
                  marginTop: 1,
                }}
              >
                {quoteDetails.customer_comment}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ borderBottom: '1px solid var(--Gray-100, #f2f2f3)', paddingBottom: 6, marginTop: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography
                sx={{
                  color: 'var(--Gray-600, #6A6B71)',
                  fontSize: '12px',
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

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, fontSize: '14px', lineHeight: '150%' }}>
                <CardMedia
                  component='img'
                  sx={{ width: 20, height: 20 }}
                  image={process.env.PUBLIC_URL + '/images/account-blue.svg'}
                />
                {quoteDetails.customer_f_name} {quoteDetails.customer_s_name}
              </Box>
              <Box sx={{ display: 'flex', gap: 2, fontSize: '14px', lineHeight: '150%' }}>
                <CardMedia
                  component='img'
                  sx={{ width: 20, height: 20 }}
                  image={process.env.PUBLIC_URL + '/images/email-dark-blue.svg'}
                />
                {quoteDetails.customer_phone}
              </Box>
              <Box sx={{ display: 'flex', gap: 2, fontSize: '14px', lineHeight: '150%' }}>
                <CardMedia
                  component='img'
                  sx={{ width: 20, height: 20 }}
                  image={process.env.PUBLIC_URL + '/images/phone-dark-blue.svg'}
                />
                {quoteDetails.customer_email}
              </Box>
            </Box>
          </Box>

          <Box sx={{ marginTop: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography
                sx={{
                  color: 'var(--Gray-600, #6A6B71)',
                  fontSize: '12px',
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

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 3 }}>
              {quoteDetails.request_booking.map((item, index) => (
                <Typography key={index} sx={{ fontSize: 14, lineHeight: '20px', letterSpacing: '0.7px' }}>
                  {moment(item.request_booking_date).format('dddd')}{' '}
                  {SLOT_LEGENDS[slotTimeIndex(slotStartTime(item.request_booking_date, item.request_time_slot))].title},{' '}
                  {moment(item.request_booking_date).format('Do MMMM')}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>

        <Link to='/process'>
          <Button
            sx={{
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
            alignItems: 'stretch',
            gap: 6,
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
              padding: '16px 0 16px 12px',
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
              width: '127px',
              objectFit: 'cover',
              objectPosition: 'center',
              borderRadius: '0 2px 2px 0',
            }}
          />
        </Box>

        <Box sx={{ p: 8 }}></Box>

        <OurMethod beforeAfterType={BeforeAfterType.ALL} showVideos={false} />

        <Box sx={{ p: 8 }}></Box>

        <LiveService image='live-service-bg1.png' />

        <Box sx={{ p: 8 }}></Box>

        <InstallmentBenefits />

        <Box sx={{ p: 8 }}></Box>

        <Partners />

        <Box sx={{ p: 8 }}></Box>

        <Testimonials />
      </Box>

      {quoteDetails.is_published && (
        <Box
          sx={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            width: '100vw',
            zIndex: '100',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: 'var(--16, 16px) var(--16, 16px) 40px var(--16, 16px)',
            borderTop: '1px solid var(--Gray-100, #f2f2f3)',
            background: '#fff',
          }}
        >
          <button className='btn-raised w-100' type='button' onClick={() => onContinue()}>
            See the Quote
          </button>
        </Box>
      )}

      {!quoteDetails.is_published && (
        <>
          <QuickContact showReg={false} />
          <Footer />
        </>
      )}
    </>
  )
}
