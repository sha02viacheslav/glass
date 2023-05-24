import moment from 'moment'

export const pastTime = (date: Date | string | number): string => {
  if (!date) return ''

  date = new Date(date)
  if (moment().diff(moment(date), 'months') < 6) {
    return moment(date, 'YYYYMMDD').fromNow()
  } else {
    return moment(date).format('MMM DD, YYYY')
  }
}
