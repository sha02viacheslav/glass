import moment from 'moment/moment'
import { BOOKING_DATE_FORMAT } from '@glass/constants'

export const slotStartTime = (bookingDate: string, timeSlot: string): string => {
  return moment(bookingDate)
    .add(timeSlot.split('_')?.[0]?.slice(0, 2) || 0, 'hours')
    .format(BOOKING_DATE_FORMAT)
}
