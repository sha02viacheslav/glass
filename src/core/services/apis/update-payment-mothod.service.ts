import { PaymentMethodType } from '@glass/enums'
import { ApiResponse, Invoice } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const updatePaymentMethod = async (
  qid: string,
  paymentMethodType: PaymentMethodType,
): Promise<ApiResponse<Invoice>> => {
  return await postApi('order/payment_method', {
    fe_token: qid,
    payment_method: paymentMethodType,
  })
}
