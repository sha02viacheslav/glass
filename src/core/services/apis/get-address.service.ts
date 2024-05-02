import { Address, ApiResponse } from '@glass/models'
import { fetchApi } from '@glass/services/apis/api.service'

export const getAddressService = async (addressId: string): Promise<ApiResponse<Address>> => {
  return await fetchApi(`https://api.getaddress.io/get/${addressId}?api-key=${process.env.REACT_APP_AUTOCOMPLETE}`)
}
