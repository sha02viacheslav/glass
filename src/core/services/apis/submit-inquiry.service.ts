import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const submitInquiryService = async (qid: string): Promise<ApiResponse<void>> => {
  return await postApi('order/submit_inquiry', { fe_token: qid })
}
