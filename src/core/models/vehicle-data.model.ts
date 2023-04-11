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
