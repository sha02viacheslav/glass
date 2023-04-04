import { PaymentStatus } from '@glass/enums'

export const paymentStatusText = (status: PaymentStatus | undefined) => {
  switch (status) {
    case PaymentStatus.NOT_PAID:
      return 'Not Paid'
    case PaymentStatus.PAID:
      return 'Paid'
    default:
      return ''
  }
}
