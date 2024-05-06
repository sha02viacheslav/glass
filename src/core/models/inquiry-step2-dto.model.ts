import { Characteristic } from './inquiry.model'

export type InquiryStep2Dto = {
  fe_token: string
  glass_location: string[]
  inquiry_characteristics: Characteristic[]
}
