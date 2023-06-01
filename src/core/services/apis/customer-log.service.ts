import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const customerLogService = async (qid: string, message: string): Promise<ApiResponse<void>> => {
  return await postApi('order/customer/log', {
    fe_token: qid,
    message,
  })
}
