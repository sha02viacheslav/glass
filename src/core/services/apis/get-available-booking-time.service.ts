import { ApiResponse, AvailableBookingTimes } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const getAvailableBookingTimeService = async (qid: string): Promise<ApiResponse<AvailableBookingTimes>> => {
  return await postApi('order/get_available_booking_time', {
    fe_token: qid,
  })
}
