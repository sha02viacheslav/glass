import { ApiResponse, InquiryFinalCheckDto } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const updateInquiryFinalCheckService = async (params: InquiryFinalCheckDto): Promise<ApiResponse<void>> => {
  return await postApi('order/update_final_check', params)
}
