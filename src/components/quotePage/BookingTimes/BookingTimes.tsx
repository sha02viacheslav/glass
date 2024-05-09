import React from 'react'
import { Box, CardMedia, Radio, Typography } from '@mui/material'
import moment from 'moment'
import { SLOT_LEGENDS } from '@glass/constants'
import { RequestBooking } from '@glass/models'
import { slotStartTime, slotTimeIndex } from '@glass/utils/index'

export type BookingTimesProps = {
  requestBookings: RequestBooking[]
  onCheckRequestBooking: (value: RequestBooking) => void
  formError: string | boolean | undefined
}

export const BookingTimes: React.FC<BookingTimesProps> = ({ requestBookings, onCheckRequestBooking, formError }) => {
  return (
    <>
      <Typography
        sx={{
          color: !!formError ? 'var(--Red---Semantic-500, #C22222)' : 'var(--Gray-800, #14151F)',
          fontWeight: '600',
          lineHeight: '140%',
          marginBottom: 4,
        }}
      >
        Pick available time slot for booking
      </Typography>

      <Box
        sx={{
          background: !!formError ? 'var(--Red---Semantic-000, #FEE8E8)' : 'transparent',
          display: 'flex',
          gap: 3,
          marginX: -4,
          padding: '8px 16px 12px',
          overflowX: 'auto',
        }}
      >
        {requestBookings.map((element, index) => (
          <Box
            key={index}
            sx={{
              minWidth: 180,
              padding: 4,
              borderRadius: '4px',
              background: '#FFF',
              boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
              cursor: 'pointer',
            }}
            onClick={() => {
              onCheckRequestBooking(element)
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Radio checked={false} size='small' sx={{ padding: 0 }} />
                <Box sx={{ marginLeft: 2 }}>
                  <Typography sx={{ fontWeight: '600', lineHeight: '20px', letterSpacing: '-0.16px' }}>
                    {moment(element.request_booking_date).format('dddd')},{' '}
                    {moment(element.request_booking_date).format('DD.MM.')}
                  </Typography>

                  <Typography
                    sx={{
                      color: 'var(--Gray-700, #474747)',
                      fontSize: '12px',
                      fontWeight: '400',
                      lineHeight: '150%',
                      letterSpacing: '-0.12px',
                    }}
                  >
                    {moment(element.request_booking_date).diff(moment(), 'days')} days from now
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
              <CardMedia
                component='img'
                sx={{ width: 24, height: 24 }}
                image={
                  process.env.PUBLIC_URL +
                  '/images/' +
                  SLOT_LEGENDS[slotTimeIndex(slotStartTime(element.request_booking_date, element.request_time_slot))]
                    .icon
                }
              />

              <Box>
                <Typography
                  sx={{
                    color: 'var(--Gray-700, #474747)',
                    fontSize: '12px',
                    lineHeight: 'normal',
                    letterSpacing: '-0.12px',
                    textTransform: 'capitalize',
                  }}
                >
                  {
                    SLOT_LEGENDS[slotTimeIndex(slotStartTime(element.request_booking_date, element.request_time_slot))]
                      .title
                  }
                </Typography>

                <Typography
                  sx={{
                    color: 'var(--Gray-700, #474747)',
                    fontSize: '12px',
                    fontWeight: '300',
                    lineHeight: '150%',
                    letterSpacing: '-0.12px',
                  }}
                >
                  {
                    SLOT_LEGENDS[slotTimeIndex(slotStartTime(element.request_booking_date, element.request_time_slot))]
                      .time
                  }
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <small className='form-error'>{formError}</small>
    </>
  )
}
