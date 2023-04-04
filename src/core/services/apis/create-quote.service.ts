import { ApiResponse, QuoteDto } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const createQuoteService = async (params: QuoteDto): Promise<ApiResponse<{ fe_token: string }>> => {
  return await postApi('order/create_quotation', params)
}
