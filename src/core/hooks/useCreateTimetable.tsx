import { useEffect } from 'react'
import moment from 'moment'
import { CALENDAR_LENGTH, CALENDAR_START_TIME, CALENDAR_TIME_INTERVAL, CALENDAR_TIME_SLOTS } from '@glass/constants'
import { BookingOccupy, OrderState } from '@glass/enums'
import { BookingDate, TimeRow } from '@glass/models'
import { getCalendarService } from '@glass/services/apis/get-calendar.service'

export const useCreateTimetable = (timetableToClient: (value: TimeRow[]) => void) => {
  const createTimetable = () => {
    // initialize with today's entry
    const newTimetable: TimeRow[] = [
      {
        date: moment().format('YYYY-MM-DD'),
        schedules: Array(CALENDAR_TIME_SLOTS).fill(BookingOccupy.EMPTY),
      },
    ]

    // set correct dates for following CALENDAR_LENGTH days from current date
    const tomorrow = new Date()
    for (let i = 1; i < CALENDAR_LENGTH; i++) {
      tomorrow.setDate(tomorrow.getDate() + 1)
      newTimetable.push({
        date: moment(tomorrow).format('YYYY-MM-DD'),
        schedules: Array(CALENDAR_TIME_SLOTS).fill(BookingOccupy.EMPTY),
      })
    }
    retrieveBookings(tomorrow, newTimetable)
  }

  const retrieveBookings = (nextDate: Date, timetable: TimeRow[]) => {
    // get past bookings
    getCalendarService(new Date(), nextDate).then((res) => {
      if (res.success && res.data?.length) {
        fillTimeslots(
          timetable,
          res.data.filter((item) => item.time_slot),
        )
      }
    })
  }

  const fillTimeslots = (times: TimeRow[], bookingData: BookingDate[]) => {
    // find indexes of booked slots
    times.forEach((row) => {
      bookingData.forEach((booking) => {
        const bookingTime = Number(booking.time_slot.split('_')[0])
        if (moment(row.date).format('YYYY-MM-DD') === moment(booking.booking_date).format('YYYY-MM-DD')) {
          // find what time the booking is and mark
          for (let k = 0; k < CALENDAR_TIME_SLOTS; k++) {
            if (k != CALENDAR_TIME_SLOTS - 1 && bookingTime >= CALENDAR_START_TIME + (k + 1) * CALENDAR_TIME_INTERVAL)
              continue
            if (k != 0 && bookingTime < CALENDAR_START_TIME + k * CALENDAR_TIME_INTERVAL) continue
            // - if status = won -> it's Fully booked
            // - if status = open/confirm -> it's Half booked
            const occupy = booking.order_state === OrderState.WON ? BookingOccupy.FULL : BookingOccupy.HALF
            if (occupy == row.schedules[k]) continue
            if (row.schedules[k] == BookingOccupy.FULL) continue
            row.schedules[k] = occupy
          }
        }
      })
    })

    timetableToClient(times)
  }

  useEffect(() => {
    createTimetable()
  }, [])
}
