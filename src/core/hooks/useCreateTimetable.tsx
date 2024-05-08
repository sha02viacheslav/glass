import { useEffect } from 'react'
import moment from 'moment'
import {
  CALENDAR_LENGTH,
  CALENDAR_START_TIME,
  CALENDAR_TIME_INTERVAL,
  CALENDAR_TIME_SLOTS,
  CALENDAR_TIME_UNIT,
} from '@glass/constants'
import { BookingOccupy, SlotStatus } from '@glass/enums'
import { BookingDate, TimeRow } from '@glass/models'
import { getCalendarService } from '@glass/services/apis/get-calendar.service'
import { slot2Hours } from '@glass/utils/slot-to-hours/slot-to-hours.util'

export const useCreateTimetable = (timetableToClient: (value: TimeRow[]) => void) => {
  const createEmptySchedules = () => {
    const schedules = []
    for (let i = 0; i < CALENDAR_TIME_SLOTS; i++) {
      schedules.push({
        occupy: BookingOccupy.EMPTY,
        bookings: Array(CALENDAR_TIME_INTERVAL / CALENDAR_TIME_UNIT).fill(0),
      })
    }
    return schedules
  }
  const createTimetable = () => {
    const firstDay = moment().startOf('week').toDate()
    // initialize with today's entry
    const newTimetable: TimeRow[] = [
      {
        date: moment(firstDay).format('YYYY-MM-DD'),
        schedules: createEmptySchedules(),
      },
    ]

    // set correct dates for following CALENDAR_LENGTH days from current date
    for (let i = 1; i < CALENDAR_LENGTH; i++) {
      firstDay.setDate(firstDay.getDate() + 1)
      newTimetable.push({
        date: moment(firstDay).format('YYYY-MM-DD'),
        schedules: createEmptySchedules(),
      })
    }
    retrieveBookings(firstDay, newTimetable)
  }

  const retrieveBookings = (nextDate: Date, timetable: TimeRow[]) => {
    // get past bookings
    getCalendarService(moment().startOf('week').toDate(), nextDate).then((res) => {
      if (res.success && res.data) {
        fillTimeSlots(timetable, res.data)
      }
    })
  }

  const fillTimeSlots = (times: TimeRow[], bookingData: { [key: string]: BookingDate }) => {
    // find indexes of booked slots
    times.forEach((row) => {
      const booking = bookingData[moment(row.date).format('YYYY-MM-DD')]

      Object.keys(booking.time_slot).forEach((timeSlot) => {
        const slotStatus = booking.time_slot[timeSlot]
        if (slotStatus !== SlotStatus.BOOKED) return

        const startHour = slot2Hours(timeSlot.split('_')[0])
        const endHour = slot2Hours(timeSlot.split('_')[1])

        if (!startHour || !endHour) return

        // find what time the booking is and mark
        for (let feSlotIdx = 0; feSlotIdx < CALENDAR_TIME_SLOTS; feSlotIdx++) {
          const feSlotStartTime = CALENDAR_START_TIME + feSlotIdx * CALENDAR_TIME_INTERVAL
          for (let timeUnitIdx = 0; timeUnitIdx < CALENDAR_TIME_INTERVAL / CALENDAR_TIME_UNIT; timeUnitIdx++) {
            if (startHour >= feSlotStartTime + (timeUnitIdx + 1) * CALENDAR_TIME_UNIT) continue
            if (endHour <= feSlotStartTime + timeUnitIdx * CALENDAR_TIME_UNIT) continue
            row.schedules[feSlotIdx].bookings[timeUnitIdx] += 1
          }
        }
      })
    })

    times.map((row) => {
      row.schedules.map((schedule) => {
        const cnt = schedule.bookings.filter((item) => item > 0).length
        if (cnt == schedule.bookings.length) {
          schedule.occupy = BookingOccupy.FULL
        } else if (cnt > 0) {
          schedule.occupy = BookingOccupy.HALF
        }
      })
    })

    timetableToClient(times)
  }

  useEffect(() => {
    createTimetable()
  }, [])
}
