import { useEffect } from 'react'
import moment from 'moment'
import { BookingDate, TimeRow } from '@glass/models'
import { getCalendar } from '@glass/services/apis/calendar.service'

export const useCreateTimetable = (timetableToClient: (value: string[][]) => void) => {
  const createTimetable = () => {
    // initialize with today's entry
    const newTimetable: TimeRow[] = [
      {
        date: moment().format('YYYY-MM-DD'),
        schedules: [0, 0, 0, 0, 0, 0, 0],
      },
    ]

    // set correct dates for following 21 days from current date
    const tomorrow = new Date()
    for (let i = 1; i < 21; i++) {
      tomorrow.setDate(tomorrow.getDate() + 1)
      newTimetable.push({
        date: moment(tomorrow).format('YYYY-MM-DD'),
        schedules: [0, 0, 0, 0, 0, 0, 0],
      })
    }
    retrieveBookings(tomorrow, newTimetable)
  }

  const retrieveBookings = (nextDate: Date, timetable: TimeRow[]) => {
    // get past bookings
    getCalendar(new Date(), nextDate).then((res) => {
      if (res.success) {
        fillTimeslots(timetable, res.data)
      }
    })
  }

  const fillTimeslots = (times: TimeRow[], bookingData: BookingDate[]) => {
    // format bookings data into usable form
    const bookings: string[][] = []
    for (let i = 0; i < bookingData.length; i++) {
      const booking = bookingData[i].booking_start_date
      const bookingYear = booking.slice(0, 4)
      const bookingMonth = booking.slice(5, 7)
      const bookingDay = booking.slice(8, 10)
      const bookingStart = booking.slice(11, 13)
      bookings.push([bookingYear, bookingMonth, bookingDay, bookingStart])
    }
    // find indexes of booked slots
    for (let i = 0; i < times.length; i++) {
      const row = times[i]
      for (let j = 0; j < bookings.length; j++) {
        const booking = bookings[j]
        const bookingMonth = booking[1]
        const bookingDay = booking[2]
        const bookingTime = Number(booking[3])
        if (moment(row.date).format('MMM') === bookingMonth) {
          if (moment(row.date).format('DD') === bookingDay) {
            // find what time the booking is and mark
            for (let k = 0; k < 7; k++) {
              if (k != 6 && bookingTime > 10 + k * 2) continue
              if (k != 0 && bookingTime <= 10 + (k - 1) * 2) continue
              row.schedules[k] += 1
            }
          }
        }
      }
    }
    // set timeslot status based on number of slots filled: 0 -> empty, 1-2 -> half, 3+ -> full
    const newTimeTable: string[][] = []
    for (let i = 0; i < times.length; i++) {
      const row = times[i]
      const data: string[] = [moment(row.date).format('MMM'), moment(row.date).format('DD')]
      for (let j = 0; j < row.schedules.length; j++) {
        const element = row.schedules[j]
        if (element === 0 || element === 1) {
          data.push('Empty')
        } else if (element == 2) {
          data.push('Half')
        } else if (element >= 3) {
          data.push('Full')
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
