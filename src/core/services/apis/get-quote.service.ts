import { ApiResponse, Quote } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const getQuoteService = async (qid: string, quoteCount = true): Promise<ApiResponse<Quote>> => {
  return await postApi('order/preview_quotation', {
    fe_token: qid,
    quote_count: quoteCount,
  })
}
