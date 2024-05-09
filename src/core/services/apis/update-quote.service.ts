import { ApiResponse, UpdateQuoteDto } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const updateQuoteService = async (params: UpdateQuoteDto): Promise<ApiResponse<{ fe_token: string }>> => {
  return await postApi('order/update_quotation', params)
}
