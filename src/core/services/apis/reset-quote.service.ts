import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const resetQuoteService = async (qid: string): Promise<ApiResponse<void>> => {
  return await postApi('order/reset_quotation', { fe_token: qid })
}
