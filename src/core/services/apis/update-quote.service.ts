import { ApiResponse, QuoteDto } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const updateQuoteService = async (params: QuoteDto): Promise<ApiResponse<{ fe_token: string }>> => {
  return await postApi('order/update_quotation', params)
}
