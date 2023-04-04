import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const getInvoicePdfService = async (qid: string): Promise<ApiResponse<{ invoice_pdf_url: string }>> => {
  return await postApi('invoice/get_pdf', {
    fe_token: qid,
  })
}
