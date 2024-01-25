import { BeforeAfterType } from '@glass/enums'
import { ApiResponse, BeforeAfter } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const beforeAfterService = async (
  type: BeforeAfterType,
  registrationNumber = '',
  glassLocations: string[] = [],
  limit = 0,
  offset = 0,
): Promise<ApiResponse<BeforeAfter[]>> => {
  return await postApi(`image/before_after/${type}`, {
    limit,
    offset,
    registration_number: registrationNumber,
    glass_locations: glassLocations,
  })
}
