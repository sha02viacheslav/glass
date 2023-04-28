import { useEffect } from 'react'
import moment from 'moment'
import { CALENDAR_LENGTH, CALENDAR_START_TIME, CALENDAR_TIME_INTERVAL, CALENDAR_TIME_SLOTS } from '@glass/constants'
import { BookingOccupy, OrderState } from '@glass/enums'
import { BookingDate, TimeRow } from '@glass/models'
import { getCalendarService } from '@glass/services/apis/get-calendar.service'

export const useCreateTimetable = (timetableToClient: (value: string[][]) => void) => {
  const createTimetable = () => {
    // initialize with today's entry
    const newTimetable: TimeRow[] = [
      {
        date: moment().format('YYYY-MM-DD'),
        schedules: Array(CALENDAR_TIME_SLOTS).fill(0),
      },
    ]

    // set correct dates for following CALENDAR_LENGTH days from current date
    const tomorrow = new Date()
    for (let i = 1; i < CALENDAR_LENGTH; i++) {
      tomorrow.setDate(tomorrow.getDate() + 1)
      newTimetable.push({
        date: moment(tomorrow).format('YYYY-MM-DD'),
        schedules: Array(CALENDAR_TIME_SLOTS).fill(0),
      })
    }
    retrieveBookings(tomorrow, newTimetable)
  }

  const retrieveBookings = (nextDate: Date, timetable: TimeRow[]) => {
    // get past bookings
    getCalendarService(new Date(), nextDate).then((res) => {
      if (res.success) {
        fillTimeslots(timetable, res.data)
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
            row.schedules[k] = Math.max(booking.order_state === OrderState.WON ? 2 : 1, row.schedules[k])
          }
        }
      })
    })

    // set timeslot status based on number of slots filled: 0 -> empty, 1-2 -> half, 3+ -> full
    const newTimeTable: string[][] = []
    for (let i = 0; i < times.length; i++) {
      const row = times[i]
      const data: string[] = [moment(row.date).format('MMM'), moment(row.date).format('DD')]
      for (let j = 0; j < row.schedules.length; j++) {
        const element = row.schedules[j]
        if (element === 0) {
          data.push(BookingOccupy.EMPTY)
        } else if (element == 1) {
          data.push(BookingOccupy.HALF)
        } else if (element >= 2) {
          data.push(BookingOccupy.FULL)
        }
      }
      newTimeTable.push(data)
    }
    timetableToClient(newTimeTable)
  }

  useEffect(() => {
    createTimetable()
  }, [])
}
