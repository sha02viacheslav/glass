export type InquiryStep5Dto = {
  fe_token: string
  request_booking: { request_booking_date: string; request_time_slot: string }[]
  remove_request_booking_ids: number[]
}
