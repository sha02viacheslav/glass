import { ApiResponse, Invoice } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const getInvoiceService = async (qid: string): Promise<ApiResponse<Invoice>> => {
  return await postApi('invoice/get_invoice', {
    fe_token: qid,
  })
}
