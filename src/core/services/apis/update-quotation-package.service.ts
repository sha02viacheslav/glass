import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const updateQuotationPackageService = async (qid: string, packageId: number): Promise<ApiResponse<boolean>> => {
  return await postApi('order/update_quotation_package', {
    fe_token: qid,
    quotation_package_id: packageId,
  })
}
