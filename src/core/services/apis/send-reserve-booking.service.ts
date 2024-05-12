import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const sendReserveBookingService = async (
  qid: string,
  reserveBookingId: number,
): Promise<ApiResponse<boolean>> => {
  return await postApi('order/reserve_booking', {
    fe_token: qid,
    reserve_booking_id: reserveBookingId,
  })
}
