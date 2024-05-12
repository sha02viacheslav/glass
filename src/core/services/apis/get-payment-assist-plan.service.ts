import { PaymentMethodType } from '@glass/enums'
import { ApiResponse, MonthlyPayment } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const getPaymentAssistPlanService = async (
  qid: string,
  paymentMethodType: PaymentMethodType,
): Promise<ApiResponse<MonthlyPayment>> => {
  return await postApi('invoice/payment/assist/plan', {
    fe_token: qid,
    fixglass_payment_method_type: paymentMethodType,
  })
}
