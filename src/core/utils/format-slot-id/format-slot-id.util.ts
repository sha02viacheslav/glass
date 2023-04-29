import moment from 'moment/moment'
import { CALENDAR_START_TIME, CALENDAR_TIME_INTERVAL } from '@glass/constants'

export const formatSlotId = (bookingStartDate: string | Date | undefined): string => {
  // We can book every 2 hours from 08:00 AM
  if (!bookingStartDate) return ''
  return moment(bookingStartDate)
    .format('MMMDD')
    .concat(((moment(bookingStartDate).toDate().getHours() - CALENDAR_START_TIME) / CALENDAR_TIME_INTERVAL).toString())
}
