export type VehicleRegistration = {
  DoorPlanLiteral: string
  Make: string
  Model: string
}

export type VehicleData = {
  YearMonthFirstRegistered: string
  Make: string
  Model: string
  YearOfManufacture: string
  VehicleRegistration: VehicleRegistration
  town_or_city: string
  county: string
  country: string
  formatted_address: string[]
}

export type ImageDetail = {
  ExpiryDate: string
  ImageUrl: string
  ViewPoint: string
}

export type VehicleImages = {
  ImageDetailsCount: number
  ImageDetailsList: ImageDetail[]
}

export type VehicleImageDataItems = { VehicleImages: VehicleImages }
