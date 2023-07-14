import { useEffect } from 'react'
import moment from 'moment'
import { CALENDAR_LENGTH, CALENDAR_START_TIME, CALENDAR_TIME_INTERVAL, CALENDAR_TIME_SLOTS } from '@glass/constants'
import { BookingOccupy } from '@glass/enums'
import { BookingDate, TimeRow } from '@glass/models'
import { getCalendarService } from '@glass/services/apis/get-calendar.service'
import { slot2Hours } from '@glass/utils/slot-to-hours/slot-to-hours.util'

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
          res.data.filter((item) => item.time_slot_visual),
        )
      }
    })
  }

  const fillTimeslots = (times: TimeRow[], bookingData: BookingDate[]) => {
    // find indexes of booked slots
    times.forEach((row) => {
      bookingData.forEach((booking) => {
        const startHour = slot2Hours(booking.time_slot_visual.split('_')[0])
        const endHour = slot2Hours(booking.time_slot_visual.split('_')[1])

        if (!startHour || !endHour) return
        if (moment(row.date).format('YYYY-MM-DD') !== moment(booking.booking_date).format('YYYY-MM-DD')) return

        // find what time the booking is and mark
        for (let k = 0; k < CALENDAR_TIME_SLOTS; k++) {
          if (k != CALENDAR_TIME_SLOTS - 1 && startHour >= CALENDAR_START_TIME + (k + 1) * CALENDAR_TIME_INTERVAL)
            continue
          if (k != 0 && endHour <= CALENDAR_START_TIME + k * CALENDAR_TIME_INTERVAL) continue
          if (row.schedules[k] == BookingOccupy.FULL) continue
          if (row.schedules[k] == BookingOccupy.HALF) row.schedules[k] = BookingOccupy.FULL
          if (row.schedules[k] == BookingOccupy.EMPTY) row.schedules[k] = BookingOccupy.HALF
        }
      })
    })

    timetableToClient(times)
  }

  useEffect(() => {
    createTimetable()
  }, [])
}
