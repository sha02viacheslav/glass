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
    <Box>
      <Typography
        sx={{
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
            fontSize: '12px',
            fontWeight: '700',
            lineHeight: '150%',
            letterSpacing: '0.84px',
            textTransform: 'uppercase',
          }}
        >
          CAR REGISTRATION NUMBER
        </Typography>

        <Box sx={{ width: '124px', marginTop: 3 }}>
          <Box sx={{ zoom: 0.4 }}>
            <LicensePlate licenseNumber={inquiry.step_1.registration_number} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, marginTop: 4 }}>
          {!!inquiry.step_1.vehicle_logo_url && (
            <CardMedia component='img' sx={{ width: 'auto', height: 20 }} image={inquiry.step_1.vehicle_logo_url} />
          )}
          <Typography
            sx={{
              color: 'var(--Gray-800, #14151F)',
              fontSize: '14px',
              fontWeight: '400',
              lineHeight: '150%',
            }}
          >
            {inquiry?.Make}
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
          <button type='button' className='btn-link small' onClick={() => onEdit(InquiryStep.STEP1)}>
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
          <button type='button' className='btn-link small' onClick={() => onEdit(InquiryStep.STEP2)}>
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
          <button type='button' className='btn-link small' onClick={() => onEdit(InquiryStep.STEP3)}>
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
        <AddPictures attachments={inquiry.step_3.customer_attachments} disabled={true} />

        <Box sx={{ marginTop: 3 }}>
          <Typography sx={{ fontSize: '14px', fontWeight: '600', lineHeight: '150%' }}>Additional comments</Typography>
          <Typography
            sx={{
              color: 'var(--Gray-600, #6A6B71)',
              fontSize: '14px',
              fontWeight: '600',
              lineHeight: '150%',
              marginTop: 1,
            }}
          >
            {inquiry.step_3.customer_comment}
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
          <button type='button' className='btn-link small' onClick={() => onEdit(InquiryStep.STEP4)}>
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
              image={process.env.PUBLIC_URL + '/images/email-dark-blue.svg'}
            />
            {inquiry.step_4.customer_phone}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, fontSize: '14px', lineHeight: '150%' }}>
            <CardMedia
              component='img'
              sx={{ width: 20, height: 20 }}
              image={process.env.PUBLIC_URL + '/images/phone-dark-blue.svg'}
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
          <button type='button' className='btn-link small' onClick={() => onEdit(InquiryStep.STEP5)}>
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
  )
}
