import moment from 'moment'
import { ApiResponse, BookingDate } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const getCalendarService = async (
  startDate: Date,
  endDate: Date,
  limit = 'all',
  offset = 0,
): Promise<ApiResponse<BookingDate[]>> => {
  return await postApi('order/get_calendar', {
    start_date: moment(startDate).format('YYYY-MM-DD'),
    end_date: moment(endDate).format('YYYY-MM-DD'),
    limit: limit,
    offset: offset,
  })
}
