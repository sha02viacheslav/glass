import { Characteristic } from './inquiry.model'
import { CommentAttachment } from './quote-dto.model'
import { WorkingPlace } from '../enums/working-place.enum'

export type InquiryFinalCheckDto = {
  fe_token: string

  // Step 1
  customer_address?: {
    address_id: number
    postcode: string
    latitude?: string
    longitude?: string
    line_1?: string
    line_2?: string
    line_3?: string
    line_4?: string
    locality?: string
    town_or_city?: string
    county?: string
    district?: string
    country?: string
  }
  working_place: WorkingPlace
  workshop_id: boolean | number

  // Step 2
  glass_location: string[]
  inquiry_characteristics: Characteristic[]

  // Step 3
  customer_comment: string
  customer_attachments: CommentAttachment[]
  remove_attachment_ids: number[]

  // Step 4
  customer_f_name: string
  customer_s_name: string
  customer_phone: string
  customer_email: string

  // Step 5
  request_booking: { request_booking_date: string; request_time_slot: string }[]
  remove_request_booking_ids: number[]
}
