import { WorkingPlace } from '@glass/enums'

export type InquiryStep1Dto = {
  fe_token: string
  customer_address?: {
    postcode: string
    latitude?: string
    longitude?: string
    line_1?: string
    line_2?: string
    line_3?: string
    line_4?: string
    locality?: string
    town_or_city?: string
    county?: string
    district?: string
    country?: string
  }
  working_place: WorkingPlace
  workshop_id: boolean | number
}
