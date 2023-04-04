import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const updatePaymentMethod = async (
  paymentIntentId: string,
  clientSecret: string | null,
): Promise<ApiResponse<boolean>> => {
  return await postApi('invoice/payment/stripe/success', {
    payment_intent: paymentIntentId,
    redirect_status: 'success',
    payment_intent_client_secret: clientSecret,
  })
}
