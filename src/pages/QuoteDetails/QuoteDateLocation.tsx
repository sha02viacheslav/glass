import React from 'react'
import { Box, CardMedia, Typography } from '@mui/material'
import moment from 'moment'
import { SLOT_LEGENDS } from '@glass/constants'
import { Quote } from '@glass/models'
import { formatAddress } from '@glass/utils/format-address/format-address.util'
import { slotStartTime, slotTimeIndex, workingPlaceLabel } from '@glass/utils/index'

export type QuoteDateLocationProps = {
  quoteDetails: Quote
}

export const QuoteDateLocation: React.FC<QuoteDateLocationProps> = ({ quoteDetails }) => {
  return (
    <Box>
      <Typography sx={{ lineHeight: '170%' }}>Here information about repair location and time are shown.</Typography>

      <Box
        sx={{
          borderRadius: '2px',
          background: '#fff',
          boxShadow:
            '0px 3px 8px 0px rgba(45, 45, 45, 0.08), 0px 2px 4px 0px rgba(45, 45, 45, 0.10), 0px 1px 2px 0px rgba(45, 45, 45, 0.12)',
          padding: 3,
          marginTop: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: '600', lineHeight: '140%' }}>Service date and time</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <CardMedia sx={{ width: 20, height: 20 }} image={process.env.PUBLIC_URL + '/images/calendar.svg'} />
          <Typography sx={{ color: 'var(--Gray-600, #6A6B71)', fontSize: '14px', lineHeight: '150%' }}>
            {moment(quoteDetails.booking_date).format('dddd, DD.MM.')}{' '}
            <Typography
              component='span'
              sx={{
                color: 'var(--Gray-600, #6A6B71)',
                fontSize: '14px',
                lineHeight: '150%',
                textTransform: 'capitalize',
              }}
            >
              {SLOT_LEGENDS[slotTimeIndex(slotStartTime(quoteDetails.booking_date, quoteDetails.time_slot))]?.title}
            </Typography>{' '}
            {SLOT_LEGENDS[slotTimeIndex(slotStartTime(quoteDetails.booking_date, quoteDetails.time_slot))]?.time}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          borderRadius: '2px',
          background: '#fff',
          boxShadow:
            '0px 3px 8px 0px rgba(45, 45, 45, 0.08), 0px 2px 4px 0px rgba(45, 45, 45, 0.10), 0px 1px 2px 0px rgba(45, 45, 45, 0.12)',
          padding: 3,
          marginTop: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: '600', lineHeight: '140%' }}>Repair type and location</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, fontSize: '14px', lineHeight: '150%' }}>
            <CardMedia
              component='img'
              sx={{ width: 20, height: 20 }}
              image={process.env.PUBLIC_URL + '/images/wrench.svg'}
            />
            <Typography sx={{ color: 'var(--Gray-600, #6A6B71)', fontSize: '14px', lineHeight: '150%' }}>
              {workingPlaceLabel(quoteDetails.working_place)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, fontSize: '14px', lineHeight: '150%' }}>
            <CardMedia
              component='img'
              sx={{ width: 20, height: 20 }}
              image={process.env.PUBLIC_URL + '/images/map-marker-blue.svg'}
            />
            <Typography sx={{ color: 'var(--Gray-600, #6A6B71)', fontSize: '14px', lineHeight: '150%' }}>
              {formatAddress(quoteDetails.delivery_address)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
