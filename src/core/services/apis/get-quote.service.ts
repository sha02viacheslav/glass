import { ApiResponse, CustomerDetail } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const getQuoteService = async (qid: string): Promise<ApiResponse<CustomerDetail>> => {
  return await postApi('order/preview_quotation', {
    fe_token: qid,
  })
}
