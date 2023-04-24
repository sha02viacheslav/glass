import { OrderState, PaymentMethodType } from '@glass/enums'
import { Address } from './address.model'
import { Comment } from './comment.model'
import { Invoice } from './invoice.model'
import { Offer } from './offer.model'
import { OptionalOrderLine } from './optional-order-line.model'
import { PaTransaction } from './pa-transaction.model'

export type Quote = {
  fe_token?: string
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
  customer_comments: Comment[]
  payment_transaction: {
    assist_4_payment: PaTransaction[]
    stripe: PaTransaction[]
  }
}
