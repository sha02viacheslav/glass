import React, { useEffect, useState } from 'react'
import { Box, CardMedia, Radio, Typography } from '@mui/material'
import moment from 'moment'
import { trackPromise } from 'react-promise-tracker'
import { useParams } from 'react-router-dom'
import { SLOT_LEGENDS } from '@glass/constants'
import { AvailableBookingTimeView } from '@glass/models'
import { getAvailableBookingTimeService } from '@glass/services/apis/get-available-booking-time.service'
import { bookingEndTime, bookingStartTime, slotStartTime, slotTimeIndex } from '@glass/utils/index'

export type BookingTimesProps = {
  reserveBookingId: number
  formError: string | boolean | undefined
  onCheckReserveBooking: (value: AvailableBookingTimeView) => void
}

export const BookingTimes: React.FC<BookingTimesProps> = ({ reserveBookingId, formError, onCheckReserveBooking }) => {
  const { id: quoteId } = useParams()

  const [availableBookingTimes, setAvailableBookingTimes] = useState<AvailableBookingTimeView[] | undefined>(undefined)

  const getAvailableBookingTimes = () => {
    if (quoteId) {
      trackPromise(
        getAvailableBookingTimeService(quoteId).then((res) => {
          if (res.success) {
            const availableBookingTimes = res.data
            const bookingTimes: AvailableBookingTimeView[] = []

            Object.keys(availableBookingTimes).forEach((bookingDate) => {
              availableBookingTimes[bookingDate].forEach((availableBooking) => {
                const times = availableBooking.time_slot_visual.split('_')
                const timeSlot = `${times[0].slice(0, 2)}_${times[1].slice(0, 2)}`
                bookingTimes.push({
                  reserve_booking_id: availableBooking.reserve_booking_id,
                  system_suggestion: availableBooking.system_suggestion,
                  time_slot: timeSlot,
                  timeSlotIndex: slotTimeIndex(slotStartTime(bookingDate, timeSlot)),
                  booking_date: bookingDate,
                  daysFromNow: moment(bookingDate).diff(moment(), 'days'),
                })
              })
            })
            setAvailableBookingTimes(bookingTimes)
          }
        }),
      )
    }
  }

  useEffect(() => {
    if (quoteId && !availableBookingTimes) {
      getAvailableBookingTimes()
    }
  }, [availableBookingTimes])

  return (
    <>
      <Typography
        sx={{
          color: !!formError ? 'var(--Red---Semantic-500, #C22222)' : 'var(--Gray-800, #14151F)',
          fontSize: { xs: 16, lg: 20 },
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
          flexWrap: { xs: 'nowrap', lg: 'wrap' },
          gap: 3,
          marginX: -4,
          padding: '8px 16px 12px',
          overflowX: 'auto',
        }}
      >
        {(availableBookingTimes || []).map((element, index) => (
          <Box
            key={index}
            sx={{
              minWidth: { xs: 180, lg: 'calc(50% - 6px)' },
              padding: { xs: 4, lg: 8 },
              borderRadius: '4px',
              border: reserveBookingId === element.reserve_booking_id ? '2px solid #225FC2' : '',
              background: '#FFF',
              boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
              cursor: 'pointer',
            }}
            onClick={() => {
              onCheckReserveBooking(element)
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Radio checked={reserveBookingId === element.reserve_booking_id} size='small' sx={{ padding: 0 }} />
                <Box sx={{ marginLeft: 2 }}>
                  <Typography
                    sx={{
                      fontSize: { xs: 16, lg: 20 },
                      fontWeight: '600',
                      lineHeight: { xs: '20px', lg: '120%' },
                      letterSpacing: '-0.16px',
                    }}
                  >
                    {moment(element.booking_date).format('dddd')}, {moment(element.booking_date).format('DD.MM.')}
                  </Typography>

                  <Typography
                    sx={{
                      color: 'var(--Gray-700, #474747)',
                      fontSize: { xs: 12, lg: 16 },
                      fontWeight: '400',
                      lineHeight: '150%',
                      letterSpacing: '-0.12px',
                    }}
                  >
                    {!!element.daysFromNow ? element.daysFromNow + ' days from now' : 'Today'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, marginTop: { xs: 2, lg: 4 } }}>
              <CardMedia
                component='img'
                sx={{ width: 24, height: 24 }}
                image={process.env.PUBLIC_URL + '/images/' + SLOT_LEGENDS[element.timeSlotIndex].icon}
              />

              <Box>
                <Typography
                  sx={{
                    color: 'var(--Gray-700, #474747)',
                    fontSize: { xs: 12, lg: 20 },
                    lineHeight: 'normal',
                    letterSpacing: '-0.12px',
                    textTransform: 'capitalize',
                  }}
                >
                  {SLOT_LEGENDS[element.timeSlotIndex].title}
                </Typography>

                <Typography
                  sx={{
                    color: 'var(--Gray-700, #474747)',
                    fontSize: { xs: 12, lg: 16 },
                    fontWeight: '300',
                    lineHeight: '150%',
                    letterSpacing: '-0.12px',
                  }}
                >
                  ({moment(bookingStartTime(element.booking_date, element.time_slot)).format('h:mm a')} -{' '}
                  {moment(bookingEndTime(element.booking_date, element.time_slot)).format('h:mm a')})
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
