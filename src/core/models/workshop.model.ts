export type Workshop = {
  id: number
  name: string
  address: string
  latitude: string
  longitude: string
  workshop_image_url: string
}

export type WorkshopMap = Workshop & {
  lat: number
  lng: number
}
