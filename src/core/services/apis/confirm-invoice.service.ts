import { ApiResponse, CustomerDetail } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const confirmInvoiceService = async (qid: string): Promise<ApiResponse<CustomerDetail>> => {
  return await postApi('invoice/confirm', {
    fe_token: qid,
  })
}
