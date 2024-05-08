import { FC, useCallback, useMemo, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import { Button, Divider, Modal, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DirectionsRenderer, DirectionsService, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { useMyLocation } from '@glass/hooks/useMyLocation'
import { Workshop, WorkshopMap } from '@glass/models'
import { WorkshopCard } from '@glass/pages/Customer/WorkshopCard'

const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY || ''
const ZOOM = 16
const DISTANCE_ALLOWED = 5000 // 5000m

type PropComponent = {
  onDismiss?: () => void
  workshops: Workshop[]
  onError?: () => void
}

const MapWorkshop: FC<PropComponent> = ({ workshops, onError = () => undefined }) => {
  const [directions, setResponse] = useState<google.maps.DirectionsResult | null>(null)

  const markerWorkshops = useMemo<WorkshopMap[]>(
    () =>
      workshops.map((workshop) => ({ ...workshop, lat: Number(workshop.latitude), lng: Number(workshop.longitude) })),
    [workshops],
  )
  const [selected, setSelected] = useState(markerWorkshops[0])
  const { lat, lng } = useMyLocation()
  const myPosition = useMemo(() => {
    if (lat && lng) {
      // return { lat, lng }
      return { lat: 53.3992835498545, lng: -1.4479439364725315 }
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
          onError()
          setResponse(result)
        } else {
          onError()
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
                strokeColor: infoDistanceAndDuration?.can ? '#4285F4' : '#FF0000', // Change the path color to red
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
            <DirectionsCarIcon sx={{ color: infoDistanceAndDuration.can ? '#133F85' : '#C22222' }} />
            <Typography
              variant='h5'
              sx={{ fontSize: 16, lineHeight: 1, color: infoDistanceAndDuration.can ? '#14151F' : '#C22222' }}
            >
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
          <WorkshopCard workshop={selected} selectable={false} />
          <Divider sx={{ my: 5 }} />
          <Typography variant='h4' sx={{ fontSize: 16, mb: 2, mt: -1 }}>
            About workshop
          </Typography>
          <Typography className='text-grey'>
            FixGlass in Sheffield S4 7PZ provides top-notch glass repair services for automotive, residential, and
            commercial needs with expertise and efficiency.
          </Typography>
        </Box>
      )}
    </>
  )
}

export const Workshops: FC<PropComponent> = ({ onDismiss = () => undefined, ...props }) => {
  if (!GOOGLE_MAP_API_KEY) return <></>
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  })
  if (!isLoaded) return <div></div>
  else
    return (
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
            onClick={onDismiss}
            type='button'
          >
            Back
          </Button>
          <MapWorkshop key={+new Date()} {...props} />
        </div>
      </Modal>
    )
}
