import moment from 'moment/moment'

export const formatSlotId = (bookingStartDate: string | Date | undefined): string => {
  // We can book every 2 hours from 08:00 AM
  const BOOKING_START = 8
  const BOOKING_PERIOD = 2
  if (!bookingStartDate) return ''
  return moment(bookingStartDate)
    .format('MMMDD')
    .concat(((moment(bookingStartDate).toDate().getHours() - BOOKING_START) / BOOKING_PERIOD).toString())
}
