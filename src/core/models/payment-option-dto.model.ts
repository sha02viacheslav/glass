import { PaymentOptionEnum, QuoteAction } from '@glass/enums'

export type PaymentOptionDto = {
  p_option: PaymentOptionEnum
  detail: QuoteAction
}
