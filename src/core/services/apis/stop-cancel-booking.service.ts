import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const stopCancelBookingService = async (qid: string): Promise<ApiResponse<boolean>> => {
  return await postApi('order/stop_booking_cancelation', {
    fe_token: qid,
  })
}
