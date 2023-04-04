import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const updatePaymentStatusService = async (
  paymentIntentId: string,
  clientSecret: string | null,
  status: 'success' | 'Failed',
): Promise<ApiResponse<boolean>> => {
  return await postApi('invoice/payment/stripe/success', {
    payment_intent: paymentIntentId,
    redirect_status: status,
    payment_intent_client_secret: clientSecret,
  })
}
