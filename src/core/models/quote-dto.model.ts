import { CustomerChatState, WorkingPlace } from '@glass/enums'
import { Characteristic } from './inquiry.model'

export type CommentAttachment = {
  name: string
  datas: string
}

export type QuoteDto = {
  fe_token?: string
  customer_name: string
  customer_f_name: string
  customer_s_name: string
  customer_phone: string
  customer_email?: string
  customer_address?: {
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
  registration_number: string
  glass_location?: string[]
  customer_comment?: string
  customer_attachments?: CommentAttachment[]
  customer_chat_state?: CustomerChatState
  fe_requested_url?: string
  working_place?: WorkingPlace
  workshop_id?: boolean | number
}

export type UpdateQuoteDto = {
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
