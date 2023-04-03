import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const addOptionalProductService = async (qid: string, optionalLineId: number): Promise<ApiResponse<boolean>> => {
  return await postApi('order/add_optional_product', {
    fe_token: qid,
    optional_line_id: optionalLineId,
  })
}
