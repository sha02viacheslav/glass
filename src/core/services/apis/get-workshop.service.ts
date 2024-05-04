import { ApiResponse, Workshop } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const getWorkshopService = async (): Promise<ApiResponse<Workshop[]>> => {
  return await postApi('order/get_workshop', {})
}
