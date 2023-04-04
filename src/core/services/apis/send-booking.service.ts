import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const sendBookingService = async (
  qid: string,
  booking_start_date: string,
  booking_end_date: string,
): Promise<ApiResponse<boolean>> => {
  return await postApi('order/booking', {
    fe_token: qid,
    booking_start_date: booking_start_date,
    booking_end_date: booking_end_date,
  })
}
