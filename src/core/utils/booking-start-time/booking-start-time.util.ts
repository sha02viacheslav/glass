import moment from 'moment/moment'
import { BOOKING_DATE_FORMAT } from '@glass/constants'

export const bookingStartTime = (bookingDate: string, timeSlot: string): string => {
  return moment(bookingDate)
    .add(timeSlot.split('_')?.[0]?.slice(0, 2) || 0, 'hours')
    .add(timeSlot.split('_')?.[0]?.slice(2, 4) || 0, 'minutes')
    .format(BOOKING_DATE_FORMAT)
}
