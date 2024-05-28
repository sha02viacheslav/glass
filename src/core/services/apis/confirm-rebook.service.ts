import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const confirmRebookService = async (
  qid: string,
  reserveBookingId: number,
  systemSuggestion: boolean,
): Promise<ApiResponse<boolean>> => {
  return await postApi('order/confirm_rebook', {
    fe_token: qid,
    reserve_booking_id: reserveBookingId,
    system_suggestion: systemSuggestion,
  })
}
