import { useEffect, useState } from 'react'

export const useMyLocation = () => {
  const [lat, setLat] = useState<number>()
  const [lng, setLng] = useState<number>()

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude)
          setLng(position.coords.longitude)
        },
        (error) => {
          console.error('useMyLocation: ', error)
        },
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }, [])

  return {
    lat,
    lng,
  }
}
