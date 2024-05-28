import { OrderState, PaymentMethodType, WorkingPlace } from '@glass/enums'
import { Address } from './address.model'
import { Attachment } from './attachment.model'
import { BeforeAfter } from './before-after.model'
import { RequestBooking } from './inquiry.model'
import { Invoice } from './invoice.model'
import { Offer } from './offer.model'
import { OptionalOrderLine } from './optional-order-line.model'
import { PaTransaction } from './pa-transaction.model'
import { Workshop } from './workshop.model'

export interface QuotePackage {
  quotation_package_id: number
  quotation_package_price_total: number
  quotation_package_description: string
  quotation_package_details: QuotePackageDetail[]
}

export interface QuotePackageDetail {
  order_line_added: boolean
  price_total: number
  product: string
}

export interface FieldServiceAttachment {
  attachment_id: number
  attachment_url: string
}

export interface FieldServiceState {
  sequence: number
  name: string
  date: string
  attachment_ids: FieldServiceAttachment[]
}
export interface FieldService {
  fs_id: number
  fs_name: string
  traccar_device_id: string
  state: FieldServiceState[]
}

export type Quote = {
  customer_id: number
  registration_number: string
  customer_f_name: string
  customer_s_name: string
  customer_name: string
  customer_email: string
  customer_phone: string
  glass_location: string[]
  invoice_address: Address
  delivery_address: Address
  booking_date: string
  time_slot: string
  request_booking_date: string
  request_time_slot: string
  date_order: string
  c_address: string
  c_postalcode: string
  order_lines?: Offer[]
  optional_order_lines?: OptionalOrderLine[]
  order_state: OrderState
  is_published: boolean
  invoice_data: Invoice
  payment_method_type: PaymentMethodType
  make: string
  model: string
  DoorPlanLiteral: string
  vehicle_logo_url: string
  customer_comment: string
  customer_attachments: Attachment[]
  request_booking: RequestBooking[]
  payment_transaction: {
    [key: string]: PaTransaction[]
  }
  customer_chat_state: string
  live_chat_url: string
  live_chat_route: string
  working_place: WorkingPlace
  workshop_address: string
  workshop: Workshop
  images_gallery: BeforeAfter[]
  quotation_packages: { [key: string]: QuotePackage }
  tracking_delivery: FieldService[]
  payment_in_1h_end_date: string
  payment_in_1h_start_date: string
}
