import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  FormControlLabel,
  Link,
  Radio,
  RadioGroup,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { cloneDeep } from 'lodash'
import { ConfirmDialog } from '@glass/components/ConfirmDialog'
import { WindowMap } from '@glass/components/WindowSelector/WindowMap'
import { CAR_IMAGES, CAR_TINTED_IMAGES, CAR_TYPES, WINDOWS } from '@glass/constants'
import { CarType, WinLoc } from '@glass/enums'
import { WindowSelection } from '@glass/models'
import {
  getAskedTint,
  getAskedVan,
  getVanBodyType,
  setAskedVan,
  setVanBodyType,
} from '@glass/utils/session/session.util'
import { PickGlassDialog } from './PickGlassDialog'
import styles from './window-selection.module.css'

export type WindowSelectorProps = {
  carType: CarType
  setCarType: (value: CarType) => void
  brokenWindowsToCustomer?: (value: string[]) => void
  brokenWindowsToComponent?: string[]
}

export const WindowSelector: React.FC<WindowSelectorProps> = ({
  carType,
  setCarType,
  brokenWindowsToCustomer,
  brokenWindowsToComponent,
}) => {
  // display popup
  const [showSelectGlassGuide, setShowSelectGlassGuide] = useState<boolean>(true)
  const [showTintedConfirm, setShowTintedConfirm] = useState<boolean>(false)
  // determine if back windows are tinted
  const [tinted, setTinted] = useState(false)

  // determine if body is tailgater or barn door for the vans
  const [bodyValue, setBodyValue] = useState(getVanBodyType())
  const [isBarnDoor, setIsBarnDoor] = useState(false)
  const [bodyPopupConfirm, setBodyPopupConfirm] = useState(getAskedVan())
  const [showBodyPopup, setShowBodyPopup] = useState(false)

  // toggle first time popup appears, popup should show just once
  const [tintedConfirmed, setTintedConfirmed] = useState(getAskedTint())
  // array of possible window selections for Coupe
  const [brokenWindows, setBrokenWindows] = useState<WindowSelection[]>([])
  // special array for sending selected broken windows to customer page
  const [selectedWindows, setSelectedWindows] = useState<string[]>([])

  const frontWindscreenTop = useMemo(() => {
    switch (carType) {
      case CarType.THREE_DOOR:
        return '96px'
      case CarType.FIVE_DOOR:
        return '96px'
      case CarType.COUPE:
        return '96px'
      case CarType.ESTATE:
        return '102px'
      case CarType.SEDAN:
        return '112px'
      case CarType.BARN:
        return '44px'
      case CarType.TAILGATER:
        return '44px'
    }
  }, [carType])

  // handle window selection
  const selectWindow = (windowClicked: WinLoc) => {
    let index = 0
    if ((windowClicked === 'r_rear' || windowClicked === 'l_rear') && !isBarnDoor) {
      // Special case for vans
      index = brokenWindows.findIndex((element) => element.window === WinLoc.REAR)
    } else {
      index = brokenWindows.findIndex((element) => element.window === windowClicked)
    }
    // display popup if a window which can be tinted is clicked for the first time
    if (!tintedConfirmed && brokenWindows[index].hasTinted) {
      setShowTintedConfirm(true)
      return // don't allow back window selecting if popup is still active
    } else if (
      !bodyPopupConfirm &&
      (carType == CarType.BARN || carType == CarType.TAILGATER) &&
      brokenWindows[index].window === WinLoc.REAR
    ) {
      // Special case for vans
      setShowBodyPopup(true)
      return
    }
    // add to array which is sent to customer page
    if (brokenWindows[index].broken) {
      const index2 = selectedWindows.findIndex((element) => element === brokenWindows[index].name)
      const index3 = selectedWindows.findIndex(
        (element) => element === brokenWindows[index].name.concat(' non-privacy'),
      )
      const index4 = selectedWindows.findIndex((element) => element === brokenWindows[index].name.concat(' privacy'))
      // find if it was selected as a tinted glass or not and remove from array
      if (index2 >= 0) {
        selectedWindows.splice(index2, 1)
      }
      if (index3 >= 0) {
        selectedWindows.splice(index3, 1)
      }
      if (index4 >= 0) {
        selectedWindows.splice(index4, 1)
      }
    } else {
      if (brokenWindows[index].hasTinted) {
        if (tinted) {
          selectedWindows.push(brokenWindows[index].name + ' privacy')
        } else {
          selectedWindows.push(brokenWindows[index].name + ' non-privacy')
        }
      } else {
        selectedWindows.push(brokenWindows[index].name)
      }
    }
    setSelectedWindows((windows) => {
      return windows.slice()
    })
    // change main array
    brokenWindows[index].broken = !brokenWindows[index].broken
    setBrokenWindows((windows) => {
      return windows.slice()
    })
  }

  // handle tinted toggle button
  const tintedButtonHandle = (newValue: boolean) => {
    setTinted(newValue)
    if (!newValue) {
      // update tinted windows in brokenWindows array as not tinted
      for (let i = 0; i < selectedWindows.length; i++) {
        selectedWindows[i] = selectedWindows[i].replace('non-privacy', 'privacy').replace('privacy', 'non-privacy')
      }
      // update tinted windows in selectedWindows array as not tinted
      setSelectedWindows(selectedWindows.slice())
    } else {
      // update not tinted windows in brokenWindows array as tinted
      for (let i = 0; i < selectedWindows.length; i++) {
        selectedWindows[i] = selectedWindows[i].replace('non-privacy', 'privacy')
      }
      // update tinted windows in selectedWindows array as tinted
      setSelectedWindows(selectedWindows.slice())
    }
    setTintedConfirmed(true)
    setBrokenWindows(brokenWindows.slice())
  }

  // switch between barn door and tailgater
  const bodyChange = (isBarn: boolean) => {
    setIsBarnDoor(isBarn)
    if (isBarn) {
      setBodyValue(CarType.BARN)
      setVanBodyType(CarType.BARN)
      setCarType(CarType.BARN)
      if (brokenWindows[3].broken) {
        // disable tailgater back window
        brokenWindows[3].broken = false
        // find if any of the back windows are selected and remove them from array sent to customer if so
        const index2 = selectedWindows.findIndex((element) => element === 'Backlight non-privacy')
        const index3 = selectedWindows.findIndex((element) => element === 'Backlight privacy')
        if (index2 >= 0) {
          selectedWindows.splice(index2, 1)
        }
        if (index3 >= 0) {
          selectedWindows.splice(index3, 1)
        }
      }
    } else {
      setBodyValue(CarType.TAILGATER)
      setVanBodyType(CarType.TAILGATER)
      setCarType(CarType.TAILGATER)
      if (brokenWindows[1].broken) {
        brokenWindows[1].broken = false
        // find if any of the back windows are selected and remove them from array sent to customer if so
        const index2 = selectedWindows.findIndex((element) => element === 'Backlight: left barn door non-privacy')
        const index3 = selectedWindows.findIndex((element) => element === 'Backlight: left barn door privacy')
        if (index2 >= 0) {
          selectedWindows.splice(index2, 1)
        }
        if (index3 >= 0) {
          selectedWindows.splice(index3, 1)
        }
      }
      if (brokenWindows[2].broken) {
        brokenWindows[2].broken = false
        // find if any of the back windows are selected and remove them from array sent to customer if so
        const index2 = selectedWindows.findIndex((element) => element === 'Right barn door non-privacy')
        const index3 = selectedWindows.findIndex((element) => element === 'Right barn door privacy')
        if (index2 >= 0) {
          selectedWindows.splice(index2, 1)
        }
        if (index3 >= 0) {
          selectedWindows.splice(index3, 1)
        }
      }
    }
    setSelectedWindows((windows) => {
      return windows.slice()
    })
  }

  // handle popup for bodyType
  const handleBodyPopup = (isBarn: boolean) => {
    setIsBarnDoor(isBarn)
    setShowBodyPopup(false)
    setBodyPopupConfirm(true)
    bodyChange(isBarn)
    setAskedVan()
  }

  const isVan = useMemo(() => {
    return carType == CarType.BARN || carType == CarType.TAILGATER
  }, [carType])

  const checkIfPreviouslySelected = (selection: string) => {
    // currently not working with tinted windows
    if (selection.includes(' privacy')) {
      tintedButtonHandle(true)
    }
    const index = brokenWindows.findIndex(
      (element) => element.name === selection.replace(' non-privacy', '').replace(' privacy', ''),
    )
    if (index >= 0) {
      brokenWindows[index].broken = true
    }
  }

  useEffect(() => {
    if (brokenWindowsToCustomer) brokenWindowsToCustomer(selectedWindows)
  }, [selectedWindows, brokenWindows])

  useEffect(() => {
    if (carType) {
      const tempWindows = cloneDeep(WINDOWS[carType])
      tempWindows.map((item) => {
        if (
          selectedWindows.findIndex((x) => x.replace(' non-privacy', '').replace(' privacy', '') === item.name) > -1
        ) {
          item.broken = true
        }
      })
      setBrokenWindows(tempWindows)
    }
  }, [selectedWindows, carType])

  useEffect(() => {
    // preselect windows if previously selected
    if (brokenWindowsToComponent && brokenWindowsToComponent.length > 0) {
      brokenWindowsToComponent?.forEach((element) => checkIfPreviouslySelected(element))
      setSelectedWindows(brokenWindowsToComponent)
    }
    if (bodyValue === CarType.BARN) {
      setIsBarnDoor(true)
    } else {
      setIsBarnDoor(false)
    }
  }, [brokenWindowsToComponent])

  return (
    <div>
      <div className={styles.container}>
        {/* display popup */}

        {/* body type popup for vans */}
        {(carType == CarType.BARN || carType == CarType.TAILGATER) && showBodyPopup && (
          <ConfirmDialog
            title='Rear Windows'
            description='Do you have one or two rear windows?'
            confirmStr='Two'
            cancelStr='One'
            onConfirm={() => handleBodyPopup(true)}
            onCancel={() => handleBodyPopup(false)}
          />
        )}

        <div className={styles.imgContainer}>
          {/* display either car with tinted windows or normal */}
          <img className={!tinted ? styles.baseImage : styles.baseImageInactive} src={CAR_IMAGES[carType]} alt='' />
          <img
            className={tinted ? styles.baseImage : styles.baseImageInactive}
            src={CAR_TINTED_IMAGES[carType]}
            alt=''
          />

          {showSelectGlassGuide && (
            <Box
              sx={{
                position: 'absolute',
                top: frontWindscreenTop,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: '100',
              }}
            >
              <img src={process.env.PUBLIC_URL + '/images/hand.svg'} />
              <PickGlassDialog
                title='Picking glass'
                description='You can select multiple glasses.'
                onConfirm={() => setShowSelectGlassGuide(false)}
              />
            </Box>
          )}

          {/* broken glass displays */}
          {brokenWindows
            .filter((element) => element.broken)
            .map((element) => (
              <img
                key={element.window}
                className={carType == CarType.COUPE ? styles.brokenGlassAlt : styles.brokenGlass}
                src={tinted && element.hasTinted ? element.tintedSource : element.source}
                alt=''
              />
            ))}

          {/* transparent layer on top of all car-related images to maintain image map */}
          {/* You should create instances for all car types so that the image-map-resizer is working */}
          {CAR_TYPES.map((item, index) =>
            item == carType ? (
              <WindowMap key={index} carType={item} selectWindow={selectWindow} />
            ) : (
              <div key={index} className='d-none'></div>
            ),
          )}
        </div>
      </div>

      <Typography
        sx={{
          color: 'var(--Gray-800, #14151F)',
          fontSize: '14px',
          fontWeight: '400',
          lineHeight: '150%',
          letterSpacing: '-0.14px',
          marginTop: '16px',
        }}
      >
        Not sure how to pick broken glass?{' '}
        <Link sx={{ fontWeight: '700' }} onClick={() => {}}>
          Tap here
        </Link>
      </Typography>

      {showTintedConfirm && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '4px',
            padding: '12px 16px',
            border: '1px solid var(--Gray-100, #F2F2F3)',
            background: '#fff',
            marginTop: '24px',
          }}
        >
          <Typography
            sx={{
              color: 'var(--Gray-800, #14151F)',
              fontSize: '12px',
              fontWeight: '600',
              lineHeight: '150%',
              letterSpacing: '0.84px',
              textTransform: 'uppercase',
            }}
          >
            PRIVACY WINDOWS?
          </Typography>

          <RadioGroup row value={tinted} onChange={(_, value) => tintedButtonHandle(value === 'true')}>
            <FormControlLabel value={true} control={<Radio />} label='Yes' />
            <FormControlLabel value={false} control={<Radio />} label='No' />
          </RadioGroup>
        </Box>
      )}

      {brokenWindows
        .filter((item) => item.broken)
        .map((item, index) => (
          <Box key={index} sx={{ borderTop: '1px solid var(--Gray-100, #f2f2f3)', marginTop: '16px' }}>
            <Typography
              sx={{
                color: 'var(--Gray-600, #6A6B71)',
                fontSize: '12px',
                fontWeight: '700',
                lineHeight: '150%',
                letterSpacing: '0.84px',
                textTransform: 'uppercase',
                marginTop: '16px',
              }}
            >
              QUESTIONS ABOUT {item.name}
            </Typography>
            <Typography
              sx={{
                color: 'var(--Gray-800, #14151F)',
                fontSize: '16px',
                fontWeight: '400',
                lineHeight: '150%',
                letterSpacing: '-0.16px',
                marginTop: '16px',
              }}
            >
              We need some additional information related to your {item.name}{' '}
              <Typography
                sx={{
                  display: 'inline',
                  color: 'var(--Gray-600, #6A6B71)',
                }}
              >
                (Just {item.name.length} fast questions).
              </Typography>
              <Box
                sx={{
                  padding: '12px 16px',
                  borderRadius: '2px',
                  border: '1px solid var(--Dark-Blue---Accent-500, #4522C2)',
                  background: 'var(--Dark-Blue---Accent-00, #ECE8FE)',
                  marginTop: '24px',
                }}
              >
                <Typography
                  sx={{
                    color: 'var(--Dark-Blue---Accent-800, #090221)',
                    fontSize: '16px',
                    fontWeight: '700',
                    lineHeight: '150%',
                    letterSpacing: '0.8px',
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  <img src={process.env.PUBLIC_URL + '/images/information-dark.svg'} />
                  IMPORTANT
                </Typography>
                <Typography
                  sx={{
                    color: 'var(--Light-Blue---Primary-700, #081F44)',
                    fontSize: '16px',
                    fontWeight: '400',
                    lineHeight: '170%',
                    marginTop: '4px',
                  }}
                >
                  Pick &quot;I don&apos;t know&quot; if not sure and we&apos;ll check it later.
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: 'var(--Gray-600, #6A6B71)',
                  fontSize: '16px',
                  fontWeight: '400',
                  lineHeight: '24px',
                  letterSpacing: '-0.16px',
                  marginTop: '16px',
                }}
              >
                Question <Typography sx={{ display: 'inline', color: 'var(--Gray-800, #14151F)' }}>1</Typography>/5
              </Typography>
              <Box
                sx={{
                  padding: '12px',
                  borderRadius: '2px',
                  boxShadow:
                    '0px 4px 17px 0px rgba(147, 147, 147, 0.04), 0px 2px 12px 0px rgba(147, 147, 147, 0.07), 0px 1px 7px 0px rgba(147, 147, 147, 0.09)',
                  background: '#fff',
                  marginTop: '8px',
                }}
              >
                <Typography
                  sx={{
                    color: 'ar(--Gray-800, #14151F)',
                    fontSize: '16px',
                    fontWeight: '400',
                    lineHeight: '150%',
                    letterSpacing: '-0.16px',
                  }}
                >
                  Does your vehicle have rain/light sensors that automatically adjust wiper speed or headlight?
                </Typography>
                <RadioGroup
                  row
                  value={tinted}
                  onChange={(_, value) => tintedButtonHandle(value === 'true')}
                  sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}
                >
                  <FormControlLabel value={true} control={<Radio />} label='Yes' />
                  <FormControlLabel value={true} control={<Radio />} label='No' />
                  <FormControlLabel value={false} control={<Radio />} label="I don't know" />
                </RadioGroup>
              </Box>
            </Typography>
          </Box>
        ))}

      {isVan && (
        <div className='d-flex align-items-center mt-3 mt-md-4'>
          <div className={'fnt-16 fnt-md-28 text-primary ' + styles.windowSelectorToggleLabel}>Body type </div>
          <ToggleButtonGroup color='secondary' value={bodyValue} exclusive aria-label='Platform'>
            <ToggleButton
              className={styles.windowSelectorToggle}
              size='small'
              value={CarType.BARN}
              onClick={() => bodyChange(true)}
            >
              Barn door
            </ToggleButton>
            <ToggleButton
              className={styles.windowSelectorToggle}
              size='small'
              value={CarType.TAILGATER}
              onClick={() => bodyChange(false)}
            >
              Tailgater
            </ToggleButton>
            \{' '}
          </ToggleButtonGroup>
        </div>
      )}
    </div>
  )
}
