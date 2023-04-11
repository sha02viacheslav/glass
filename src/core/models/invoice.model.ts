import { PaymentStatus } from '@glass/enums'

export type Invoice = {
  invoice_date: string
  invoice_number: string
  payment_date: string
  payment_gateway: string
  payment_ref: string
  payment_state: PaymentStatus
}
