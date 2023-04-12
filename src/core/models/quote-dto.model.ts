import { VehicleData, VehicleImageDataItems } from './vehicle-data.model'

export type CommentAttachment = {
  name: string
  datas: string
}

export type QuoteDto = {
  customer_name: string
  customer_f_name: string
  customer_s_name: string
  customer_phone: string
  customer_email: string
  customer_order_postal_code: string
  customer_address: {
    postcode: string
    latitude: string
    longitude: string
    line_1: string
    line_2: string
    line_3: string
    line_4: string
    locality: string
    town_or_city: string
    county: string
    district: string
    country: string
  }
  registration_number: string
  registration_year: string
  make: string
  model: string
  body_type: string
  model_year: string
  glass_location: string[]
  VehicleData: { DataItems: VehicleData | undefined }
  VehicleImageData: { DataItems: VehicleImageDataItems | undefined }
  customer_comments: {
    comment: string
    attachments: CommentAttachment[]
  }
}
