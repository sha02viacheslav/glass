export type DeliveryAddressDto = {
  customer_id: number
  address_id: number | undefined
  line_1: string
  line_2: string
  postcode: string
  latitude: string
  longitude: string
  town_or_city: string
  county: string
  country: string
}
