import { ApiResponse, InquiryStep5Dto } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const updateInquiryStep5Service = async (params: InquiryStep5Dto): Promise<ApiResponse<void>> => {
  return await postApi('order/update_inquiry_step_5', params)
}
