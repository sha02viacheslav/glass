import { FC, useMemo, useState, useEffect, useCallback } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Button, Modal, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { GOOGLE_MAP_API_KEY } from 'src/core/constants'
import { useMyLocation } from '@glass/hooks/useMyLocation'
import { Workshop } from '@glass/models'
import { getWorkshopService } from '@glass/services/apis/get-workshop.service'

const ZOOM = 16

type PropComponent = {
  showOnModal?: boolean
  onDismiss?: () => void
}

type PropComponentMap = PropComponent & {
  workshop: Workshop
}

const MapTrackTechnician: FC<PropComponentMap> = ({ showOnModal, workshop }) => {
  const { lat, lng } = useMyLocation()
  const myPosition = useMemo(() => {
    if (lat && lng) {
      return { lat, lng }
      // // dev
      // return { lat: 53.3992835498545, lng: -1.4479439364725315 }
    }
    return undefined
  }, [lat, lng])

  const center = useMemo(() => {
    if (myPosition && workshop) {
      const lat_c = (Number(workshop.latitude) + myPosition.lat) / 2
      const lng_c = (Number(workshop.longitude) + myPosition.lng) / 2
      return {
        lat: lat_c,
        lng: lng_c,
      }
    }
    return undefined
  }, [myPosition, workshop])

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      const bounds = new window.google.maps.LatLngBounds()

      if (myPosition) bounds.extend(myPosition)
      bounds.extend({ lat: Number(workshop.latitude), lng: Number(workshop.longitude) })

      map.fitBounds(bounds)
    },
    [myPosition, workshop],
  )

  return (
    <>
      <GoogleMap
        id='my_map'
        mapContainerStyle={{
          height: showOnModal ? '100vh' : 'calc(100vh - 100px)',
          width: '100%',
        }}
        center={center}
        zoom={ZOOM}
        options={{
          zoomControl: false,
          fullscreenControl: false,
          scaleControl: false,
          rotateControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        }}
        onLoad={onLoad}
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
            <Marker position={{ lat: Number(workshop.latitude), lng: Number(workshop.longitude) }} />
          </>
        )}
      </GoogleMap>

      <Box
        sx={{
          position: 'absolute',
          left: { xs: 10, lg: 24 },
          top: { xs: 55, lg: 24 },
          width: { xs: 'calc(100vw - 20px)', lg: 476 },
          backgroundColor: '#ece8fe',
          borderRadius: 2,
          px: 4,
          py: 3,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#4522C2',
          display: 'flex',
          gap: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: '#090221',
            color: 'white',
            width: 20,
            height: 20,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          i
        </Box>
        <Typography className='text-grey flex-1' sx={{ color: '#081F44' }}>
          On delivery day, the technician&rsquo;s location will also be on the map so you can track it live.
        </Typography>
      </Box>
    </>
  )
}

export const TrackTechnician: FC<PropComponent> = ({ showOnModal = true, onDismiss = () => undefined, ...props }) => {
  if (!GOOGLE_MAP_API_KEY) return <></>
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  })
  const [workshops, setWorkshops] = useState<Workshop[]>([])

  useEffect(() => {
    getWorkshopService().then((res) => {
      if (res.success) {
        setWorkshops(res.data)
      }
    })
  }, [])

  if (!isLoaded || !workshops.length) return <div></div>
  else
    return (
      <>
        {showOnModal ? (
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
                  top: 10,
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
              <MapTrackTechnician key={+new Date()} {...props} workshop={workshops[0]} />
            </div>
          </Modal>
        ) : (
          <Box sx={{ position: 'relative' }}>
            <MapTrackTechnician key={+new Date()} {...props} workshop={workshops[0]} showOnModal={showOnModal} />
          </Box>
        )}
      </>
    )
}
