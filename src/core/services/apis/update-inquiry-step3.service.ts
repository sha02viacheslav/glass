import { ApiResponse, InquiryStep3Dto } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const updateInquiryStep3Service = async (params: InquiryStep3Dto): Promise<ApiResponse<void>> => {
  return await postApi('order/update_inquiry_step_3', params)
}
