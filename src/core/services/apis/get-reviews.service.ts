import { REACT_APP_GOOGLE_MAP_API_KEY } from '@glass/envs'
import { ApiResponse, Review } from '@glass/models'
import { fetchApi } from '@glass/services/apis/api.service'

export const getReviewsService = async (): Promise<ApiResponse<{ name: string; reviews: Review[] }>> => {
  console.warn('GOOGLE_MAP_API_KEY', REACT_APP_GOOGLE_MAP_API_KEY)
  return await fetchApi(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJdSIRFeUfdkgRE0nmOslBeRs&fields=name%2Creviews&key=${REACT_APP_GOOGLE_MAP_API_KEY}`,
  )
}
