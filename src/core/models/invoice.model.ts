import { PaymentMethodType } from '@glass/enums'

export type Invoice = {
  invoice_number: string
  amount_total: number
  payment_method_type: PaymentMethodType
}
