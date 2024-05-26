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
      <Typography sx={{ fontSize: { xs: 16, lg: 30 }, lineHeight: '170%', maxWidth: 593 }}>
        Here information about repair location and time are shown.
      </Typography>

      <Box sx={{ maxWidth: 544 }}>
        <Box
          sx={{
            borderRadius: '2px',
            background: '#fff',
            boxShadow:
              '0px 3px 8px 0px rgba(45, 45, 45, 0.08), 0px 2px 4px 0px rgba(45, 45, 45, 0.10), 0px 1px 2px 0px rgba(45, 45, 45, 0.12)',
            padding: { xs: 3, lg: 6 },
            marginTop: { xs: 3, lg: 6 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: { xs: 16, lg: 20 }, fontWeight: '600', lineHeight: '140%' }}>
              Service date and time
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <CardMedia
              sx={{ width: { xs: 20, lg: 24 }, height: { xs: 20, lg: 24 } }}
              image={process.env.PUBLIC_URL + '/images/calendar.svg'}
            />
            <Typography
              sx={{
                color: 'var(--Gray-600, #6A6B71)',
                fontSize: { xs: 14, lg: 20 },
                lineHeight: { xs: '150%', lg: '120%' },
              }}
            >
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
            padding: { xs: 3, lg: 6 },
            marginTop: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: { xs: 16, lg: 20 }, fontWeight: '600', lineHeight: '140%' }}>
              Repair type and location
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, lg: 3 }, marginTop: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <CardMedia
                component='img'
                sx={{ width: { xs: 20, lg: 24 }, height: { xs: 20, lg: 24 } }}
                image={process.env.PUBLIC_URL + '/images/wrench.svg'}
              />
              <Typography
                sx={{
                  color: 'var(--Gray-600, #6A6B71)',
                  fontSize: { xs: 14, lg: 20 },
                  lineHeight: { xs: '150%', lg: '120%' },
                }}
              >
                {workingPlaceLabel(quoteDetails.working_place)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <CardMedia
                component='img'
                sx={{ width: { xs: 20, lg: 24 }, height: { xs: 20, lg: 24 } }}
                image={process.env.PUBLIC_URL + '/images/map-marker-blue.svg'}
              />
              <Typography
                sx={{
                  color: 'var(--Gray-600, #6A6B71)',
                  fontSize: { xs: 14, lg: 20 },
                  lineHeight: { xs: '150%', lg: '120%' },
                }}
              >
                {formatAddress(quoteDetails.delivery_address)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
