import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const sendBookingService = async (
  qid: string,
  bookingDate: string,
  timeSlot: string,
): Promise<ApiResponse<boolean>> => {
  return await postApi('order/booking', {
    fe_token: qid,
    booking_date: bookingDate,
    time_slot: timeSlot,
  })
}
