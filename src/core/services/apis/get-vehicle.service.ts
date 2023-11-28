import { ApiResponse, VehicleData } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const getVehicleService = async (registrationNumber: string): Promise<ApiResponse<VehicleData>> => {
  return await postApi('order/get_vehicle_data', {
    registration_number: registrationNumber,
  })
}
