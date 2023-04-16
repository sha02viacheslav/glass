import { PaymentStatus } from '@glass/enums'
import { Quote } from '@glass/models'

export const paymentStatusText = (quote: Quote | undefined) => {
  if (!quote?.is_published) return 'Processing'
  switch (quote?.invoice_data?.payment_state) {
    case PaymentStatus.NOT_PAID:
      return 'Not Paid'
    case PaymentStatus.PAID:
      return 'PAID'
    default:
      return ''
  }
}
