import { AddressType } from '@glass/enums'

export type Address = {
  address_id?: number
  address_type?: AddressType
  line_1: string
  line_2: string
  line_3: string
  line_4: string
  locality: string
  postcode: string
  latitude: string
  longitude: string
  town_or_city: string
  county: string
  district: string
  country: string
  formatted_address: string[]
}

export type ManualAddress = {
  flatNumber: string
  buildingNumber: string
  buildingName: string
  street: string
  city: string
  county: string
}
