import { PaymentMethodType } from '@glass/enums'

export const paymentMethodButton = (type: PaymentMethodType) => {
  switch (type) {
    case PaymentMethodType.ASSIST_TWELVE_PAYMENT:
      return '12 month'
    case PaymentMethodType.STRIPE:
      return 'Stripe'
    case PaymentMethodType.CASH:
      return 'Cash'
  }
}
