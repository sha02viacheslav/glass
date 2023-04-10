import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const createIndentService = async (qid: string): Promise<ApiResponse<{ clientSecret: string }>> => {
  return await postApi('invoice/payment/stripe/create_indent', {
    fe_token: qid,
  })
}
