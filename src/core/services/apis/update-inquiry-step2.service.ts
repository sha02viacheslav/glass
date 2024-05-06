import { ApiResponse, InquiryStep2Dto } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const updateInquiryStep2Service = async (params: InquiryStep2Dto): Promise<ApiResponse<void>> => {
  return await postApi('order/update_inquiry_step_2', params)
}
