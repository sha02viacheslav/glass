import { PaymentMethodType } from '@glass/enums'

export const paymentMethodButton = (type: PaymentMethodType) => {
  switch (type) {
    case PaymentMethodType.ASSIST_FOUR_PAYMENT:
      return '4 month'
    case PaymentMethodType.ASSIST_SIX_PAYMENT:
      return '6 month'
    case PaymentMethodType.STRIPE:
      return 'Stripe'
    case PaymentMethodType.CASH:
      return 'Cash'
  }
}
