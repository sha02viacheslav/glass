import { ApiResponse, InquiryStep4Dto } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const updateInquiryStep4Service = async (params: InquiryStep4Dto): Promise<ApiResponse<void>> => {
  return await postApi('order/update_inquiry_step_4', params)
}
