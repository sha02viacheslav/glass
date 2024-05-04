import { ApiResponse, Inquiry } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const getInquiryService = async (registrationNumber: string): Promise<ApiResponse<Inquiry>> => {
  return await postApi('order/new_inquiry', {
    registration_number: registrationNumber,
  })
}
