import { FixglassPaymentMethodTyp } from '@glass/enums'
import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const beginPaymentAssistService = async (
  qid: string,
  paymentMethodType: FixglassPaymentMethodTyp,
): Promise<ApiResponse<{ url: string }>> => {
  return await postApi('invoice/payment/assist/begin', {
    fe_token: qid,
    fixglass_payment_method_type: paymentMethodType,
  })
}
