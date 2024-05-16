import { ApiResponse, Characteristic } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const getCharacteristicService = async (
  registrationNumber: string,
  glassLocations: string[] = [
    'backlight non-privacy',
    'backlight privacy',
    'backlight: left barn door non-privacy',
    'backlight: left barn door privacy',
    'backlight: right barn door non-privacy',
    'backlight: right barn door privacy',
    'front windscreen',
    'left front door/drop',
    'left front quarter (vent)',
    'left middle quarter non-privacy',
    'left middle quarter privacy',
    'left rear body quarter non-privacy',
    'left rear body quarter privacy',
    'left rear door vent non-privacy',
    'left rear door vent privacy',
    'left rear door/drop non-privacy',
    'left rear door/drop privacy',
    'right front door/drop',
    'right front quarter (vent)',
    'right middle quarter non-privacy',
    'right middle quarter privacy',
    'right rear body quarter non-privacy',
    'right rear body quarter privacy',
    'right rear door vent non-privacy',
    'right rear door vent privacy',
    'right rear door/drop non-privacy',
    'right rear door/drop privacy,',
  ],
): Promise<ApiResponse<{ [key: string]: Characteristic[] }>> => {
  return await postApi('order/get_characteristic', {
    registration_number: registrationNumber,
    glass_location: glassLocations,
  })
}
