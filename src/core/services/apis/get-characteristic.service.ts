import { ApiResponse, Characteristic } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const getCharacteristicService = async (
  registrationNumber: string,
  glassLocations: string[],
): Promise<ApiResponse<{ [key: string]: Characteristic[] }>> => {
  return await postApi('order/get_characteristic', {
    registration_number: registrationNumber,
    glass_location: glassLocations,
  })
}
