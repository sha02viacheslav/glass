import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const cancelBookingService = async (qid: string, reasonCancelBooking = ''): Promise<ApiResponse<boolean>> => {
  return await postApi('order/cancel_booking', {
    fe_token: qid,
    reason_cancel_booking: reasonCancelBooking,
  })
}
