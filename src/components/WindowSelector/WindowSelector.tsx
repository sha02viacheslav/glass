import React, { useEffect, useMemo, useState } from 'react'
import { Button, Dialog, DialogActions, DialogTitle, ToggleButton, ToggleButtonGroup } from '@mui/material'
import imageMapResize from 'image-map-resizer'
import { CAR_IMAGES, CAR_TINTED_IMAGES, COORDS, WINDOWS } from '@glass/constants'
import { CarType, WinLoc } from '@glass/enums'
import { WindowSelection } from '@glass/models'
import styles from './window-selection.module.css'

export type WindowSelectorProps = {
  carType: CarType
  brokenWindowsToCustomer?: (value: string[]) => void
  brokenWindowsToComponent?: string[]
}

export const WindowSelector: React.FC<WindowSelectorProps> = ({
  carType,
  brokenWindowsToCustomer,
  brokenWindowsToComponent,
}) => {
  // display popup
  const [popup, setPopup] = useState(false)
  // determine if back windows are tinted
  const [tinted, setTinted] = useState(false)
  const [tintedValue, setTintedValue] = useState('no')

  // determine if body is tailgater or barn door for the vans
  const [bodyValue, setBodyValue] = useState(
    JSON.parse(sessionStorage.getItem('vanBodyType') || `"${CarType.TAILGATER}"`),
  )
  const [isBarnDoor, setIsBarnDoor] = useState(false)
  const [bodyPopupConfirm, setBodyPopupConfirm] = useState(
    JSON.parse(sessionStorage.getItem('askedVanBody') || 'false'),
  )
  const [bodyPopup, setBodyPopup] = useState(false)
  const [showMap, setShowMap] = useState<boolean>(false)

  // toggle first time popup appears, popup should show just once
  const [popupConfirm, setPopupConfirm] = useState(JSON.parse(sessionStorage.getItem('askedTinted') || 'false'))
  // array of possible window selections for Coupe
  const [brokenWindows, setBrokenWindows] = useState<WindowSelection[]>([])
  // special array for sending selected broken windows to customer page
  const [selectedWindows, setSelectedWindows] = useState<string[]>([])

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
    if (!popupConfirm && brokenWindows[index].hasTinted) {
      setPopup(true)
      return // don't allow back window selecting if popup is still active
    } else if (
      !bodyPopupConfirm &&
      (carType == CarType.BARN || carType == CarType.TAILGATER) &&
      brokenWindows[index].window === WinLoc.REAR
    ) {
      // Special case for vans
      setBodyPopup(true)
      return
    }
    // add to array which is sent to customer page
    if (brokenWindows[index].broken) {
      const index2 = selectedWindows.findIndex((element) => element === brokenWindows[index].name)
      const index3 = selectedWindows.findIndex((element) => element === brokenWindows[index].name.concat(' privacy'))
      // find if it was selected as a tinted glass or not and remove from array
      if (index2 >= 0) {
        selectedWindows.splice(index2, 1)
      }
      if (index3 >= 0) {
        selectedWindows.splice(index3, 1)
      }
    } else {
      if (tinted && brokenWindows[index].hasTinted) {
        selectedWindows.push(brokenWindows[index].name + ' privacy')
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

  useEffect(() => {
    if (brokenWindowsToCustomer) brokenWindowsToCustomer(selectedWindows)
  }, [selectedWindows])

  const handlePopup = (answer: boolean) => {
    setTinted(answer)
    setPopup(false)
    setPopupConfirm(true)
    if (answer) {
      if (carType == CarType.BARN || carType == CarType.TAILGATER) {
        tintedButtonHandle('yes')
      } else {
        setTintedValue('yes')
      }
    } else {
      if (carType == CarType.BARN || carType == CarType.TAILGATER) {
        tintedButtonHandle('no')
      } else {
        setTintedValue('no')
      }
    }
    sessionStorage.setItem('askedTinted', JSON.stringify(true))
  }

  // handle tinted toggle button
  const tintedButtonHandle = (newValue: string) => {
    if (newValue === 'no') {
      setTinted(false)
      // update tinted windows in brokenWindows array as not tinted
      for (let i = 0; i < selectedWindows.length; i++) {
        selectedWindows[i] = selectedWindows[i].replace(' privacy', '')
      }
      // update tinted windows in selectedWindows array as not tinted
      setSelectedWindows(selectedWindows.slice())
    } else {
      setTinted(true)
      // update not tinted windows in brokenWindows array as tinted
      for (let i = 0; i < selectedWindows.length; i++) {
        const index = brokenWindows.findIndex((element) => element.name === selectedWindows[i])
        if (brokenWindows[index].hasTinted) {
          selectedWindows[i] = selectedWindows[i].concat(' privacy')
        }
      }
      // update tinted windows in selectedWindows array as tinted
      setSelectedWindows(selectedWindows.slice())
    }
    setTintedValue(newValue)
    setPopupConfirm(true)
    setBrokenWindows(brokenWindows.slice())
  }

  // switch between barn door and tailgater
  const bodyChange = (isBarn: boolean) => {
    setIsBarnDoor(isBarn)
    if (isBarn) {
      setBodyValue(CarType.BARN)
      if (brokenWindows[3].broken) {
        // disable tailgater back window
        brokenWindows[3].broken = false
        // find if any of the back windows are selected and remove them from array sent to customer if so
        const index2 = selectedWindows.findIndex((element) => element === 'Backlight')
        const index3 = selectedWindows.findIndex((element) => element === 'Backlight privacy')
        if (index2 >= 0) {
          selectedWindows.splice(index2, 1)
        }
        if (index3 >= 0) {
          selectedWindows.splice(index3, 1)
        }
      }
      sessionStorage.setItem('vanBodyType', JSON.stringify(CarType.BARN))
    } else {
      setBodyValue(CarType.TAILGATER)
      if (brokenWindows[1].broken) {
        brokenWindows[1].broken = false
        // find if any of the back windows are selected and remove them from array sent to customer if so
        const index2 = selectedWindows.findIndex((element) => element === 'Left barn door')
        const index3 = selectedWindows.findIndex((element) => element === 'Left barn door privacy')
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
        const index2 = selectedWindows.findIndex((element) => element === 'Right barn door')
        const index3 = selectedWindows.findIndex((element) => element === 'Right barn door privacy')
        if (index2 >= 0) {
          selectedWindows.splice(index2, 1)
        }
        if (index3 >= 0) {
          selectedWindows.splice(index3, 1)
        }
      }
      sessionStorage.setItem('vanBodyType', JSON.stringify(CarType.TAILGATER))
    }
    setSelectedWindows((windows) => {
      return windows.slice()
    })
  }

  // handle popup for bodyType
  const handleBodyPopup = (isBarn: boolean) => {
    setIsBarnDoor(isBarn)
    setBodyPopup(false)
    setBodyPopupConfirm(true)
    bodyChange(isBarn)
    sessionStorage.setItem('askedVanBody', JSON.stringify(true))
  }

  const isVan = useMemo(() => {
    return carType == CarType.BARN || carType == CarType.TAILGATER
  }, [carType])

  const checkIfPreviouslySelected = (selection: string) => {
    // currently not working with tinted windows
    if (selection.includes(' privacy')) {
      tintedButtonHandle('yes')
    }
    const index = brokenWindows.findIndex((element) => element.name === selection.replace(' privacy', ''))
    if (index >= 0) {
      brokenWindows[index].broken = true
    }
  }

  useEffect(() => {
    if (!!carType) {
      setBrokenWindows(WINDOWS[carType])
      // Should rerender map
      setShowMap(false)
      setTimeout(() => {
        setShowMap(true)
        setTimeout(() => {
          imageMapResize('map.window-image-map')
        }, 300)
      })
    }
  }, [carType])

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
    <div className={styles.container}>
      {/* display popup */}
      <div>
        <Dialog open={popup} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
          <DialogTitle id='alert-dialog-title'>{'Are your back windows tinted?'}</DialogTitle>
          <DialogActions>
            <Button onClick={() => handlePopup(true)}>Yes</Button>
            <Button onClick={() => handlePopup(false)}>No</Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* body type popup for vans */}
      {(carType == CarType.BARN || carType == CarType.TAILGATER) && (
        <div>
          <Dialog open={bodyPopup} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
            <DialogTitle id='alert-dialog-title'>{'Do you have one or two rear windows?'}</DialogTitle>
            <DialogActions>
              <Button onClick={() => handleBodyPopup(false)}>One</Button>
              <Button onClick={() => handleBodyPopup(true)}>Two</Button>
            </DialogActions>
          </Dialog>
        </div>
      )}

      <div className={styles.imgContainer}>
        {/* display either car with tinted windows or normal */}
        <img className={!tinted ? styles.baseImage : styles.baseImageInactive} src={CAR_IMAGES[carType]} alt='' />
        <img className={tinted ? styles.baseImage : styles.baseImageInactive} src={CAR_TINTED_IMAGES[carType]} alt='' />

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
        {showMap && (
          <img
            id='window-image-map'
            className={styles.selectionLayer}
            src={CAR_IMAGES[carType]}
            alt=''
            useMap='#window-image-map'
          />
        )}
      </div>

      {/* tinted window toggle */}
      <div>
        <span className='fs-18 text-blue'>Privacy windows: </span>
        <ToggleButtonGroup
          sx={{ ml: isVan ? 0 : '10px' }}
          color='secondary'
          value={tintedValue}
          exclusive
          aria-label='Platform'
        >
          <ToggleButton
            sx={{ width: isVan ? 120 : 70 }}
            size='small'
            value='yes'
            onClick={() => tintedButtonHandle('yes')}
          >
            Yes
          </ToggleButton>
          <ToggleButton
            sx={{ width: isVan ? 120 : 70 }}
            size='small'
            value='no'
            onClick={() => tintedButtonHandle('no')}
          >
            No
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {isVan && (
        <div>
          <span className='fs-18 text-blue toggle-van'>Body type: </span>
          <ToggleButtonGroup color='secondary' value={bodyValue} exclusive aria-label='Platform'>
            <ToggleButton sx={{ width: 120 }} size='small' value={CarType.BARN} onClick={() => bodyChange(true)}>
              Barn door
            </ToggleButton>
            <ToggleButton sx={{ width: 120 }} size='small' value={CarType.TAILGATER} onClick={() => bodyChange(false)}>
              Tailgater
            </ToggleButton>
            \{' '}
          </ToggleButtonGroup>
        </div>
      )}

      {/* buttons for broken windows */}
      <div className='btns my-4'>
        {brokenWindows.map((element, index) => (
          <a
            key={index}
            className={element.broken ? 'btn btn-gray-active' : 'btn btn-gray'}
            onClick={() => selectWindow(element.window)}
          >
            {tinted && element.hasTinted ? element.name + ' privacy' : element.name}
          </a>
        ))}
      </div>
      {showMap && (
        <map name='window-image-map'>
          {Object.entries(COORDS[carType]).map(([key, val]) => (
            <area
              key={`${carType}-${key}`}
              onClick={() => selectWindow(key as WinLoc)}
              coords={val}
              shape='poly'
              alt='window-selector'
            />
          ))}
        </map>
      )}
    </div>
  )
}
