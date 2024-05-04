import { ApiResponse, InquiryStep1Dto } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const updateInquiryStep1Service = async (params: InquiryStep1Dto): Promise<ApiResponse<void>> => {
  return await postApi('order/update_inquiry_step_1', params)
}
