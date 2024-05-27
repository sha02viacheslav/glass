import './Customer.css'
import React from 'react'
import { Box, CardMedia, Typography } from '@mui/material'
import moment from 'moment'
import { AddPictures } from '@glass/components/AddPictures'
import { LicensePlate } from '@glass/components/LicensePlate'
import { WindowSelector } from '@glass/components/WindowSelector'
import { SLOT_LEGENDS } from '@glass/constants'
import { CarType, InquiryStep } from '@glass/enums'
import { Inquiry } from '@glass/models'
import { formatAddress } from '@glass/utils/format-address/format-address.util'
import { slotStartTime, slotTimeIndex, workingPlaceLabel } from '@glass/utils/index'

export type FinalCheckProps = {
  selectedCarType: CarType
  inquiry: Inquiry
  onEdit: (value: InquiryStep) => void
}

export const FinalCheck: React.FC<FinalCheckProps> = ({ selectedCarType, inquiry, onEdit }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 6, lg: 24 } }}>
      <Box sx={{ flex: '1' }}>
        <Typography
          sx={{
            fontSize: { xs: 16, lg: 30 },
            fontWeight: '600',
            lineHeight: '150%',
            letterSpacing: '-0.16px',
          }}
        >
          Let&apos;s check the information before sending. You will be able to edit all the info later also.
        </Typography>

        <div className='padding-32'></div>

        <Box sx={{ paddingBottom: 6, borderBottom: '1px solid var(--Gray-100, #f2f2f3)' }}>
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
            CAR REGISTRATION NUMBER
          </Typography>

          <Box sx={{ width: '94px', marginTop: 3 }}>
            <Box sx={{ zoom: { xs: 0.3, lg: 0.75 } }}>
              <LicensePlate disabled={true} licenseNumber={inquiry.step_1.registration_number} />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, marginTop: 4 }}>
            {!!inquiry.step_1.vehicle_logo_url && (
              <CardMedia
                component='img'
                sx={{ width: 'auto', height: { xs: 20, lg: 45 } }}
                image={inquiry.step_1.vehicle_logo_url}
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
              {inquiry?.Make} {inquiry?.Model}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ flex: '1' }}>
        <Box sx={{ borderBottom: '1px solid var(--Gray-100, #f2f2f3)', paddingBottom: 6 }}>
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
            <button type='button' className='btn-link xs' onClick={() => onEdit(InquiryStep.STEP1)}>
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
              {workingPlaceLabel(inquiry.step_1.working_place)}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, fontSize: '14px', lineHeight: '150%' }}>
              <CardMedia
                component='img'
                sx={{ width: 20, height: 20 }}
                image={process.env.PUBLIC_URL + '/images/map-marker-blue.svg'}
              />
              {formatAddress(inquiry.step_1.delivery_address)}
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
            <button type='button' className='btn-link xs' onClick={() => onEdit(InquiryStep.STEP2)}>
              EDIT
            </button>
          </Box>
          <Box
            sx={{
              padding: 3,
              border: '1px solid var(--Gray-200, #EAEAEB)',
              borderRadius: 2,
              marginTop: 3,
            }}
          >
            <WindowSelector
              disabled={true}
              carType={selectedCarType}
              registrationNumber={inquiry.step_1.registration_number}
              selectedGlasses={inquiry.step_2.glass_location}
              id='map_win_final_check'
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
            <button type='button' className='btn-link xs' onClick={() => onEdit(InquiryStep.STEP3)}>
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
          {!!inquiry.step_3.customer_attachments.length ? (
            <AddPictures attachments={inquiry.step_3.customer_attachments} disabled={true} />
          ) : (
            <Box
              sx={{
                px: 4,
                py: 3,
                borderRadius: '4px',
                border: '1px solid var(--Yellow---Semantic-500, #FBBC05)',
                background: '#FFF9C6',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <CardMedia
                  sx={{ width: 24, height: 24 }}
                  image={process.env.PUBLIC_URL + '/images/alert-rhombus.svg'}
                />
                <Typography
                  sx={{
                    color: 'var(--WF-Base-800, #2D3648)',
                    fontWeight: '500',
                    lineHeight: '150%',
                    letterSpacing: '-0.16px',
                  }}
                >
                  You didn&apos;t added any image
                </Typography>
              </Box>{' '}
              <Typography
                sx={{
                  color: 'var(--Gray-700, #474747)',
                  lineHeight: '150%',
                  letterSpacing: '-0.16px',
                  mt: 1,
                }}
              >
                It will take longer for us to make the quote. You can add images here.
              </Typography>
            </Box>
          )}

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
              {inquiry.step_3.customer_comment || 'No Comment'}
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
            <button type='button' className='btn-link xs' onClick={() => onEdit(InquiryStep.STEP4)}>
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
              {inquiry.step_4.customer_f_name} {inquiry.step_4.customer_s_name}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, fontSize: '14px', lineHeight: '150%' }}>
              <CardMedia
                component='img'
                sx={{ width: 20, height: 20 }}
                image={process.env.PUBLIC_URL + '/images/phone-dark-blue.svg'}
              />
              {inquiry.step_4.customer_phone}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, fontSize: '14px', lineHeight: '150%' }}>
              <CardMedia
                component='img'
                sx={{ width: 20, height: 20 }}
                image={process.env.PUBLIC_URL + '/images/email-dark-blue.svg'}
              />
              {inquiry.step_4.customer_email}
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
              Preferred repair dates
            </Typography>
            <button type='button' className='btn-link xs' onClick={() => onEdit(InquiryStep.STEP5)}>
              EDIT
            </button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 3 }}>
            {inquiry.step_5.request_booking.map((item, index) => (
              <Typography key={index} sx={{ fontSize: 14, lineHeight: '20px', letterSpacing: '0.7px' }}>
                {moment(item.request_booking_date).format('dddd')}{' '}
                {SLOT_LEGENDS[slotTimeIndex(slotStartTime(item.request_booking_date, item.request_time_slot))].title},{' '}
                {moment(item.request_booking_date).format('Do MMMM')}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
