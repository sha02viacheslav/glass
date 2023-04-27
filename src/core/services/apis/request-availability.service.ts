import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const requestAvailabilityService = async (
  qid: string,
  bookingDate: string,
  timeSlot: string,
): Promise<ApiResponse<boolean>> => {
  return await postApi('order/booking_request_availability', {
    fe_token: qid,
    request_booking_date: bookingDate,
    request_time_slot: timeSlot,
  })
}
