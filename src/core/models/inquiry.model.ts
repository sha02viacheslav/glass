import { Address } from './address.model'
import { Attachment } from './attachment.model'
import { InquiryStep } from '../enums/inquiry-step.enum'
import { WorkingPlace } from '../enums/working-place.enum'

export type Characteristic = {
  id: number
  name: string
  answer_yes: boolean
  answer_no: boolean
  answer_not_know: boolean
}

export type RequestBooking = {
  request_booking_id: number
  request_booking_date: string
  request_time_slot: string
}

export type Inquiry = {
  DoorPlanLiteral: string
  Make: string
  Model: string
  Range: string
  request_phone_number: string
  fe_token: string
  order_state: InquiryStep
  step_1: {
    registration_number: string
    vehicle_logo_url: string
    vehicle_image_url: string
    delivery_address: Address
    working_place: WorkingPlace
    workshop_id: boolean | number
  }
  step_2: {
    glass_location?: string[]
    inquiry_characteristics?: Characteristic[]
  }
  step_3: {
    customer_comment: string
    customer_attachments: Attachment[]
  }
  step_4: {
    customer_id: string
    customer_name: string
    customer_f_name: string
    customer_s_name: string
    customer_phone: string
    customer_email: string
  }
  step_5: {
    request_booking: RequestBooking[]
  }
}
