import { ApiResponse, InvoicePdf } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const getInvoicePdfService = async (qid: string): Promise<ApiResponse<InvoicePdf>> => {
  return await postApi('invoice/get_pdf', {
    fe_token: qid,
  })
}
