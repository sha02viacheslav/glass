import moment from 'moment/moment'
import { CALENDAR_START_TIME, CALENDAR_TIME_INTERVAL } from '@glass/constants'

export const slotTimeIndex = (bookingStartDate: string | Date | undefined): number => {
  // We can book every 2 hours from 08:00 AM
  if (!bookingStartDate) return 0
  return (moment(bookingStartDate).toDate().getHours() - CALENDAR_START_TIME) / CALENDAR_TIME_INTERVAL
}
