import { ApiResponse, PrePaymentApproveDto } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const preApprovePaymentService = async (
  preApprovePaymentDTO: PrePaymentApproveDto,
): Promise<ApiResponse<{ approved: boolean }>> => {
  return await postApi('invoice/payment/assist/preappoval', preApprovePaymentDTO)
}
