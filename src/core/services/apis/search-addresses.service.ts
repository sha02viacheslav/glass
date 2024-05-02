import { ApiResponse, SearchAddress } from '@glass/models'
import { fetchApi } from '@glass/services/apis/api.service'

export const searchAddressesService = async (
  postcode: string,
): Promise<ApiResponse<{ suggestions: SearchAddress[] }>> => {
  return await fetchApi(
    `https://api.getaddress.io/autocomplete/${postcode}?api-key=${process.env.REACT_APP_AUTOCOMPLETE}`,
  )
}
