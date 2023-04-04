import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const beginPaymentAssistService = async (
  qid: string,
  invoiceNumber: string,
): Promise<ApiResponse<{ url: string }>> => {
  return await postApi('invoice/payment/assist/begin', {
    fe_token: qid,
    invoice_number: invoiceNumber,
  })
}
