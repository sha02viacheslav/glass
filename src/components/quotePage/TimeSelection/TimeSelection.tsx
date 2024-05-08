import './time-select-new.css'
import React, { useEffect, useState } from 'react'
import { Box, CardMedia, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'
import moment from 'moment'
import { BOOKING_DATE_FORMAT, CALENDAR_DAYS, CALENDAR_TIME_INTERVAL, SLOT_LABELS } from '@glass/constants'
import { BookingOccupy } from '@glass/enums'
import { useCreateTimetable } from '@glass/hooks/useCreateTimetable'
import { RequestBooking, TimeRow, TimeSlot } from '@glass/models'
import { formatSlotId } from '@glass/utils/format-slot-id/format-slot-id.util'
import { slotStartTime, slotTimeIndex } from '@glass/utils/index'

const passedSlots = [12, 16, 20]
const fullMonthValues = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export type TimeSelectionProps = {
  bookingEnabled?: boolean
  onChangeBookingEnabled?: (value: boolean) => void
  onChangeTimeSlot?: (value: RequestBooking[]) => void
  requestBookings?: RequestBooking[]
  formError?: string | string[] | never[] | undefined
}

export const TimeSelection: React.FC<TimeSelectionProps> = ({
  bookingEnabled = true,
  onChangeBookingEnabled = () => {},
  onChangeTimeSlot = () => {},
  requestBookings = [],
  formError,
}) => {
  const [showCalendar, setShowCalendar] = useState<boolean>(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([])
  const [timeData, setTimeData] = useState<TimeRow[]>([])
  const [slots, setSlots] = useState<TimeRow[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pages, setPages] = useState<number[]>([])
  const currentMonth = fullMonthValues[selectedDate.getMonth()]
  const currentHour = new Date().getHours()
  const currentYear = new Date().getFullYear()

  const legends = [
    {
      icon: 'morning.svg',
      title: 'morning',
      abbreviation: 'M',
      description: 'Morning hours',
      time: '(8 am - 12 am)',
    },
    {
      icon: 'afternoon.svg',
      title: 'afternoon',
      abbreviation: 'A',
      description: 'Afternoon hours',
      time: '(12 am - 4 pm)',
    },
    {
      icon: 'evening.svg',
      title: 'evening',
      abbreviation: 'E',
      description: 'Evening hours',
      time: '(4 pm - 7 pm)',
    },
  ]

  useCreateTimetable(getTimeData)

  function getTimeData(data: TimeRow[]) {
    setTimeData(data)
  }

  // function to select a given time slot
  const selectSlot = (monthSelected: string, daySelected: string, timeSelected: number, occupy: BookingOccupy) => {
    // save the data
    let odooDay = daySelected
    if (odooDay.length === 1) {
      odooDay = '0' + odooDay
    }
    // for sending slot info to odoo, slot starting time
    const startDate = moment(
      `${monthSelected} ${odooDay}, ${currentYear} ${8 + timeSelected * CALENDAR_TIME_INTERVAL}:00:00`,
    ).format(BOOKING_DATE_FORMAT)

    const existingIndex = selectedSlots.findIndex(
      (item) => slotStartTime(item.booking_date, item.time_slot) === startDate,
    )
    if (existingIndex > -1) {
      selectedSlots.splice(existingIndex, 1)
    } else {
      selectedSlots.push({
        id: 0,
        booking_date: moment(startDate).format('YYYY-MM-DD'),
        time_slot: `${moment(startDate).format('HH')}_${moment(startDate)
          .add(CALENDAR_TIME_INTERVAL, 'hours')
          .format('HH')}`,
        isFull: occupy === BookingOccupy.FULL,
      })
    }

    setSelectedSlots([...selectedSlots])

    onChangeTimeSlot(
      selectedSlots.map((item) => ({
        request_booking_id: item.id,
        request_booking_date: item.booking_date,
        request_time_slot: item.time_slot,
      })),
    )
  }

  const changePage = (navValue: string) => {
    if (navValue === 'next' && pages.includes(currentPage + 1)) {
      setCurrentPage(currentPage + 1)
      setSelectedDate((prev) => moment(prev).add(3, 'days').toDate())
    } else if (navValue === 'prev' && pages.includes(currentPage - 1)) {
      setCurrentPage(currentPage - 1)
      setSelectedDate((prev) => moment(prev).subtract(3, 'days').toDate())
    }
  }

  const handleChangeBookingAvailable = (value: boolean) => {
    onChangeBookingEnabled(value)
    setShowCalendar(value)
    if (!value && onChangeTimeSlot) {
      onChangeTimeSlot([])
    }
  }

  const isActive = (element: TimeRow, timeIndex: number) => {
    return (
      selectedSlots.findIndex(
        (item) =>
          formatSlotId(slotStartTime(item.booking_date, item.time_slot)) ===
          moment(element.date).format('MMMDD') + timeIndex.toString(),
      ) > -1
    )
  }

  const isPast = (element: TimeRow, timeIndex: number) => {
    const timeCheck = passedSlots[timeIndex] - currentHour
    if (moment(element.date).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) return true
    return moment(element.date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') && timeCheck <= 0
  }

  useEffect(() => {
    setCurrentPage(Math.floor(moment(selectedDate).startOf('date').diff(moment().startOf('date'), 'days') / 3 + 1))
  }, [selectedDate])

  // navigating calendar pages and disable passed slots
  useEffect(() => {
    setSlots(timeData.slice(CALENDAR_DAYS * currentPage - CALENDAR_DAYS, CALENDAR_DAYS * currentPage))
  }, [currentPage, timeData])

  useEffect(() => {
    if (requestBookings.length) {
      setSelectedSlots(
        requestBookings.map((item) => ({
          id: item.request_booking_id,
          booking_date: item.request_booking_date,
          time_slot: item.request_time_slot,
          isFull: false,
        })),
      )
    }
  }, [requestBookings])

  useEffect(() => {
    setShowCalendar(bookingEnabled)
  }, [bookingEnabled])

  useEffect(() => {
    // determine if table is viewed in mobile view and set cols in display accordingly
    const pageCount = []
    setSlots(timeData.slice(0, CALENDAR_DAYS))
    for (let i = 0; i < timeData.length / CALENDAR_DAYS; i++) {
      pageCount.push(i + 1)
    }
    setPages([...new Set(pageCount)])
  }, [timeData])

  return (
    <Box>
      <Box>
        <Typography
          sx={{
            fontWeight: '600',
            lineHeight: '150%',
            letterSpacing: '-0.16px',
          }}
        >
          Would you like to pick to pick your preferred date and time?
        </Typography>

        <RadioGroup row value={showCalendar} onChange={(_, value) => handleChangeBookingAvailable(value === 'true')}>
          <FormControlLabel value={true} control={<Radio />} label='Yes, I Would' />
          <FormControlLabel value={false} control={<Radio />} label="No, I'm flexible" />
        </RadioGroup>
      </Box>

      {showCalendar ? (
        <Box sx={{ marginTop: 10 }}>
          <Box
            sx={{
              display: 'flex',
              padding: 'var(--12, 12px) var(--16, 16px)',
              alignItems: 'flex-start',
              gap: 'var(--8, 8px)',
              borderRadius: '2px',
              border: '1px solid var(--Dark-Blue---Accent-500, #4522C2)',
              background:
                'linear-gradient(0deg, var(--Dark-Blue---Accent-00, #ECE8FE) 0%, var(--Dark-Blue---Accent-00, #ECE8FE) 100%), #F7F9FC',
            }}
          >
            <CardMedia
              component='img'
              sx={{ width: 16, height: 16, marginTop: 1 }}
              image={process.env.PUBLIC_URL + '/images/information-dark.svg'}
              alt='Minus'
            />
            <Typography
              sx={{
                color: 'var(--Light-Blue---Primary-700, #081F44)',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: '400',
                lineHeight: '170%',
                letterSpacing: '-0.14px',
              }}
            >
              Please select multiple dates. Choose a single date only if urgent, as we may be fully booked that day. You
              pick the date by tapping on it.
            </Typography>
          </Box>

          <Box
            sx={{
              borderRadius: '4px',
              background: '#fff',
              boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
              border: !!formError ? '1px solid var(--Red---Semantic-500, #C22222)' : '',
              marginTop: 4,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                padding: 'var(--4, 4px) var(--12, 12px) var(--4, 4px) var(--16, 16px)',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'stretch',
                boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.1)',
                borderRadius: '4px 4px 0 0',
              }}
            >
              <Typography
                sx={{
                  fontWeight: '700',
                  lineHeight: '20px',
                  letterSpacing: '0.1px',
                  padding: '10px 8px',
                }}
              >
                week 9{' '}
                <Typography sx={{ color: 'var(--Gray-600, #6A6B71)' }} component='span'>
                  ({currentMonth})
                </Typography>
              </Typography>

              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ padding: 2, cursor: 'pointer' }}>
                  <CardMedia
                    component='img'
                    sx={{ width: 24, height: 24 }}
                    image={process.env.PUBLIC_URL + '/images/chevron-left-gray.svg'}
                    onClick={() => changePage('prev')}
                  />
                </Box>
                <Box sx={{ padding: 2, cursor: 'pointer' }}>
                  <CardMedia
                    sx={{ width: 24, height: 24 }}
                    component='img'
                    image={process.env.PUBLIC_URL + '/images/chevron-right-gray.svg'}
                    onClick={() => changePage('next')}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ margin: '0 1px', overflow: 'auto' }}>
              {timeData.length > 0 && (
                <table className='ts-table' id='calendar'>
                  {/* map time headers on left side */}
                  <tbody>
                    {/* map slots and dates */}
                    {slots.map((element, index) => (
                      <tr key={index}>
                        {/* first row maps dates */}
                        <td>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 2,
                              padding: 3,
                            }}
                          >
                            <Typography
                              sx={{
                                color:
                                  moment(element.date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
                                    ? 'var(--Dark-Blue---Accent-400, #7255DB)'
                                    : moment(element.date).format('YYYY-MM-DD') ===
                                      moment().startOf('week').format('YYYY-MM-DD')
                                    ? 'var(--Gray-800, #14151F)'
                                    : 'var(--Gray-600, #6A6B71)',
                                textAlign: 'center',
                                lineHeight: '24px',
                                letterSpacing: '0.5px',
                              }}
                            >
                              {moment(element.date).format('ddd').slice(0, 1)}
                            </Typography>
                            <Typography
                              sx={{
                                color:
                                  moment(element.date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
                                    ? 'var(--Dark-Blue---Accent-500, #4522C2)'
                                    : 'var(--Gray-800, #14151F)',
                                textAlign: 'center',
                                lineHeight: '24px',
                                letterSpacing: '0.5px',
                              }}
                            >
                              {moment(element.date).format('D')}
                            </Typography>
                          </Box>
                        </td>
                        {/* subsequent rows map timeslots */}
                        {element.schedules.map((schedule, time) => (
                          <td id={moment(element.date).format('MMMDD') + time.toString()} key={time}>
                            <Box
                              key={index}
                              sx={{
                                padding: '0 6px',
                                borderRadius: '4px',
                                border: isActive(element, time)
                                  ? '1px solid var(--Light-Blue---Primary-500, #225FC2)'
                                  : '1px solid var(--Gray-200, #EAEAEB)',
                                background: isActive(element, time)
                                  ? 'var(--Light-Blue---Primary-000, #E8F0FE)'
                                  : '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                margin: '4px 8px',
                                justifyContent: 'center',
                                width: '46px',
                                cursor: isPast(element, time) ? 'not-allowed' : 'pointer',
                                opacity: isPast(element, time) ? '0.4' : '1',
                              }}
                              onClick={() =>
                                selectSlot(
                                  moment(element.date).format('MMM'),
                                  moment(element.date).format('DD'),
                                  time,
                                  schedule.occupy as BookingOccupy,
                                )
                              }
                            >
                              <CardMedia
                                component='img'
                                sx={{ width: 24, height: 24 }}
                                image={process.env.PUBLIC_URL + '/images/' + legends[time].icon}
                              />
                              <Typography
                                sx={{
                                  color: 'var(--Gray-700, #474747)',
                                  lineHeight: 'normal',
                                  letterSpacing: '-0.16px',
                                }}
                              >
                                {SLOT_LABELS[time]}
                              </Typography>
                            </Box>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                width: '100%',
                paddingX: 3,
                paddingY: 2,
                boxShadow: '0px -2px 12px 0px rgba(0, 0, 0, 0.08)',
                borderRadius: '0 0 4px 4px',
              }}
            >
              {legends.map((legend, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CardMedia
                    component='img'
                    sx={{ width: 24, height: 24 }}
                    image={process.env.PUBLIC_URL + '/images/' + legend.icon}
                  />
                  <Typography
                    sx={{
                      color: 'var(--Gray-700, #474747)',
                      fontSize: '12px',
                      lineHeight: 'normal',
                      letterSpacing: '-0.12px',
                    }}
                  >
                    <Typography
                      component='span'
                      sx={{
                        color: 'var(--Gray-700, #474747)',
                        fontSize: '12px',
                        fontWeight: '700',
                        lineHeight: 'normal',
                        letterSpacing: '-0.12px',
                      }}
                    >
                      {legend.abbreviation}
                    </Typography>{' '}
                    - {legend.description}{' '}
                    <Typography
                      component='span'
                      sx={{
                        color: 'var(--Gray-700, #474747)',
                        fontSize: '12px',
                        fontWeight: '300',
                        lineHeight: 'normal',
                        letterSpacing: '-0.12px',
                      }}
                    >
                      {legend.time}
                    </Typography>
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <small className='form-error'>{formError}</small>

          <Box sx={{ marginTop: 6 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--8, 8px)',
                marginBottom: 3,
              }}
            >
              <CardMedia
                component='img'
                sx={{ width: 20, height: 20 }}
                image={process.env.PUBLIC_URL + '/images/calendar.svg'}
                alt='Minus'
              />
              <Typography
                sx={{
                  color: 'var(--Gray-600, #6A6B71)',
                  fontSize: '12px',
                  fontWeight: '700',
                  lineHeight: '20px',
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                }}
              >
                Dates selected
              </Typography>
            </Box>
            {!!selectedSlots?.length ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedSlots.map((item, index) => (
                  <Typography
                    key={index}
                    sx={{
                      lineHeight: '20px',
                      letterSpacing: '0.8px',
                    }}
                  >
                    {moment(item.booking_date).format('dddd')}{' '}
                    {legends[slotTimeIndex(slotStartTime(item.booking_date, item.time_slot))].title},{' '}
                    {moment(item.booking_date).format('Do MMMM')}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography
                sx={{
                  color: 'var(--Gray-600, #6A6B71)',
                  lineHeight: '20px',
                  letterSpacing: '0.8px',
                }}
              >
                No date selected
              </Typography>
            )}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            padding: 'var(--24, 24px)',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 'var(--4, 4px)',
            background: '#FFF',
            marginTop: 10,
          }}
        >
          <Typography
            sx={{
              color: 'var(--Gray-700, #474747)',
              textAlign: 'center',
              fontSize: '18px',
              lineHeight: '170%',
            }}
          >
            We will send you some available dates and times for the appointment in the quote.
          </Typography>
        </Box>
      )}
    </Box>
  )
}
