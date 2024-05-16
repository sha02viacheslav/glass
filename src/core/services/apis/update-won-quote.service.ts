import { ApiResponse, UpdateWonQuoteDto } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const updateWonQuoteService = async (params: UpdateWonQuoteDto): Promise<ApiResponse<{ fe_token: string }>> => {
  return await postApi('order/update_won_quotation', params)
}
