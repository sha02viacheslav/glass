import { ApiResponse, DeliveryAddressDto } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const updateDeliveryAddressService = async (
  params: DeliveryAddressDto,
): Promise<ApiResponse<{ fe_token: string }>> => {
  return await postApi('customer/address/update_delivery', params)
}
