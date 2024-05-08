import { FC, memo, useCallback, useMemo, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import RoomIcon from '@mui/icons-material/Room'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { Button, Modal, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api'
import { DISTANCE_ALLOWED, GOOGLE_MAP_API_KEY } from '@glass/constants'
import { useMyLocation } from '@glass/hooks/useMyLocation'
import { Workshop, WorkshopMap } from '@glass/models'

type PropComponent = {
  workshops: Workshop[]
}
type PropComponentMap = {
  workshops: WorkshopMap[]
  can: boolean
}
const ZOOM = 16

const FullMapWorkshop: FC<PropComponentMap> = ({ workshops: markerWorkshops, can }) => {
  const [directions, setResponse] = useState<google.maps.DirectionsResult | null>(null)

  const [selected, setSelected] = useState(markerWorkshops[0])
  const { lat, lng } = useMyLocation()
  const myPosition = useMemo(() => {
    if (lat && lng) {
      return { lat, lng }
      // // dev
      // return { lat: 53.3992835498545, lng: -1.4479439364725315 }
    }
    return undefined
  }, [lat, lng])

  const handleMarkerClick = (markerItem: WorkshopMap) => {
    setSelected(markerItem)
  }

  const directionsCallback = useCallback(
    (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
      if (result !== null) {
        if (status === 'OK') {
          setResponse(result)
        } else {
          setResponse(null)
        }
      }
    },
    [],
  )
  const directionsServiceOptions = useMemo(() => {
    if (myPosition && selected) {
      return {
        destination: { lat: selected.lat, lng: selected.lng },
        origin: myPosition,
        travelMode: google.maps.TravelMode.DRIVING,
      }
    } else return undefined
  }, [selected, myPosition])

  const infoDistanceAndDuration = useMemo(() => {
    if (directions) {
      const route = directions.routes[0]
      const leg = route.legs[0]
      return {
        distance: leg.distance,
        duration: leg.duration,
        can: (leg.distance?.value ?? 4000000) < DISTANCE_ALLOWED,
      }
    } else return undefined
  }, [directions])

  return (
    <>
      <GoogleMap
        id='my_map'
        mapContainerStyle={{ height: '100vh', width: '100%' }}
        center={myPosition}
        zoom={ZOOM}
        options={{
          zoomControl: false,
          fullscreenControl: false,
          scaleControl: false,
          rotateControl: false,
          streetViewControl: false,
        }}
      >
        {!!myPosition && (
          <>
            <Marker
              key='my'
              position={myPosition}
              options={{
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: '#225FC2',
                  fillOpacity: 1,
                  strokeWeight: 10,
                  scale: 14,
                  strokeColor: '#133F85',
                  strokeOpacity: 0.3,
                },
              }}
            />
            {markerWorkshops.map((pos, idx) => (
              <Marker
                key={idx}
                position={{ lat: pos.lat, lng: pos.lng }}
                options={{
                  label: {
                    text: `${idx + 1}`,
                    color: 'white',
                  },
                }}
                onClick={() => handleMarkerClick(pos)}
              />
            ))}
          </>
        )}
        {directionsServiceOptions && (
          <DirectionsService options={directionsServiceOptions} callback={directionsCallback} />
        )}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: can ? '#4285F4' : '#FF0000', // Change the path color to red
              },
              markerOptions: {
                opacity: 0,
              },
            }}
          />
        )}
      </GoogleMap>
      {infoDistanceAndDuration && (
        <Box
          sx={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'white',
            borderRadius: 2,
            padding: '4px 8px',
            boxShadow: '0px 1px 3px 1px #00000026',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <DirectionsCarIcon sx={{ color: can ? '#133F85' : '#C22222' }} />
            <Typography variant='h5' sx={{ fontSize: 16, lineHeight: 1, color: can ? '#14151F' : '#C22222' }}>
              {infoDistanceAndDuration.duration?.text}
            </Typography>
          </Box>
          <Typography>{infoDistanceAndDuration.distance?.text}</Typography>
        </Box>
      )}
      {selected && (
        <Box
          sx={{
            position: 'absolute',
            left: 10,
            bottom: 10,
            width: 'calc(100vw - 20px)',
            backgroundColor: 'white',
            borderRadius: 2,
            padding: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0px 1px 7px 0px #93939317' }}>
            {can ? (
              <>
                <Box sx={{ backgroundColor: '#E8F0FE', borderRadius: 100, padding: 4 }}>
                  <ThumbUpIcon sx={{ color: '#133F85' }} />
                </Box>
                <Box>
                  <Typography variant='h4' sx={{ fontSize: 16, mb: 1 }}>
                    We can come and replace.
                  </Typography>
                  <Typography className='text-grey'>
                    <RoomIcon sx={{ color: '#7255DB' }} /> {selected.address}
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ backgroundColor: '#FEE8E8', borderRadius: 100, padding: 4 }}>
                  <img src='/images/dissatisfied.svg' />
                </Box>
                <Box>
                  <Typography variant='h4' sx={{ fontSize: 16, mb: 1 }}>
                    We can’t repair it at your place.
                  </Typography>
                  <Typography className='text-grey'>You are to far from us.</Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
    </>
  )
}

const MobileService: FC<PropComponent> = ({ workshops }) => {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [error, setError] = useState<boolean>()

  const markerWorkshops = useMemo<WorkshopMap[]>(
    () =>
      workshops.map((workshop) => ({ ...workshop, lat: Number(workshop.latitude), lng: Number(workshop.longitude) })),
    [workshops],
  )
  const { lat, lng } = useMyLocation()
  const selected = useMemo(() => {
    if (markerWorkshops.length && lat !== undefined && lng !== undefined) return markerWorkshops[0]
    return undefined
  }, [markerWorkshops, lat, lng])

  const myPosition = useMemo(() => {
    if (lat && lng) {
      return { lat, lng }
      // return { lat: 53.3992835498545, lng: -1.4479439364725315 }
    }
    return undefined
  }, [lat, lng])

  // direction
  const directionsCallback = useCallback(
    (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
      if (result !== null) {
        console.log(result, 'result')

        if (status === 'OK') {
          const route = result.routes[0]
          const leg = route.legs[0]
          setError((leg.distance?.value ?? 4000000) > DISTANCE_ALLOWED)
        } else {
          setError(true)
        }
      }
    },
    [],
  )
  const directionsServiceOptions = useMemo(() => {
    if (myPosition && selected) {
      return {
        destination: { lat: selected.lat, lng: selected.lng },
        origin: myPosition,
        travelMode: google.maps.TravelMode.DRIVING,
      }
    } else return undefined
  }, [selected, myPosition])

  return (
    <Box sx={{ mb: 2 }}>
      {error === true ? (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1, letterSpacing: '-1%' }}>
          <img src='/images/warning.svg' width={20} />
          <div>
            <Typography sx={{ mt: -1 }} className='text-red-500'>
              We can’t do the mobile service at this location.
            </Typography>
            <Typography sx={{ mb: 1 }} className='text-red-500'>
              Go with the workshop service.
            </Typography>
          </div>
        </Box>
      ) : (
        <Box>
          <Typography sx={{ mb: 0 }}>
            Location on map
            <span className='text-gray-600'> (tap to expand)</span>
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <img src='/images/thumb-up.svg' width={20} />
            <Typography sx={{ mb: 1 }} className='text-green-600'>
              We can come and replace.
            </Typography>
          </Box>
        </Box>
      )}
      <GoogleMap
        id='google_map'
        mapContainerStyle={{ width: '100%', height: '130px' }}
        center={selected ? { lat: selected?.lat, lng: selected.lng } : undefined}
        zoom={ZOOM}
        options={{
          zoomControl: false,
          fullscreenControl: false,
          scaleControl: false,
          rotateControl: false,
          streetViewControl: false,
        }}
        onClick={() => setIsFullScreen(true)}
      >
        {selected && (
          <Marker
            position={{ lat: selected?.lat, lng: selected.lng }}
            options={{
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#FFF',
                fillOpacity: 1,
                strokeWeight: 10,
                scale: 14,
                strokeColor: '#225FC2',
              },
            }}
          />
        )}
        {directionsServiceOptions && (
          <DirectionsService options={directionsServiceOptions} callback={directionsCallback} />
        )}
      </GoogleMap>
      {isFullScreen && (
        <Modal
          open={true}
          aria-labelledby='child-modal-title'
          disableAutoFocus={true}
          aria-describedby='child-modal-description'
        >
          <div className='custom-address-dialog p-0'>
            <Button
              variant='outlined'
              startIcon={<ArrowBackIcon />}
              sx={{
                position: 'absolute',
                top: 55,
                left: 10,
                zIndex: 99,
                backgroundColor: 'white',
                color: 'black',
                border: 'transparent',
              }}
              style={{ boxShadow: '0px 2px 6px 2px #00000026' }}
              onClick={() => setIsFullScreen(false)}
              type='button'
            >
              Back
            </Button>
            <FullMapWorkshop workshops={markerWorkshops} can={error !== true} />
          </div>
        </Modal>
      )}
    </Box>
  )
}

const MainMapMobileService: FC<PropComponent> = (props) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  })
  if (!isLoaded) return <div></div>
  else return <MobileService {...props} />
}

export default memo(MainMapMobileService)
