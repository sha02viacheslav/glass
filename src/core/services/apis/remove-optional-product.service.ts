import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const removeOptionalProductService = async (
  qid: string,
  orderLineId: number,
  optionalLineId: number,
): Promise<ApiResponse<boolean>> => {
  return await postApi('order/remove_optional_product', {
    fe_token: qid,
    order_line_id: orderLineId,
    optional_line_id: optionalLineId,
  })
}
