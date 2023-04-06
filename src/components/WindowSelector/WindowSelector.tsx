import React, { useEffect, useMemo, useState } from 'react'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { ConfirmDialog } from '@glass/components/ConfirmDialog'
import { WindowMap } from '@glass/components/WindowSelector/WindowMap'
import { CAR_IMAGES, CAR_TINTED_IMAGES, CAR_TYPES, WINDOWS } from '@glass/constants'
import { CarType, WinLoc } from '@glass/enums'
import { WindowSelection } from '@glass/models'
import {
  getAskedTint,
  getAskedVan,
  getVanBodyType,
  setAskedTint,
  setAskedVan,
  setVanBodyType,
} from '@glass/utils/session/session.util'
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
  const [showTintedConfirm, setShowTintedConfirm] = useState<boolean>(false)
  // determine if back windows are tinted
  const [tinted, setTinted] = useState(false)
  const [tintedValue, setTintedValue] = useState('no')

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
    setShowTintedConfirm(false)
    setTintedConfirmed(true)
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
    setAskedTint()
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
        const index2 = selectedWindows.findIndex((element) => element === 'Backlight')
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

      {showTintedConfirm && (
        <ConfirmDialog
          title='Tinted Back Window'
          description='Are your back windows tinted?'
          onConfirm={() => handlePopup(true)}
          onCancel={() => handlePopup(false)}
        />
      )}

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
        {/* You should create instances for all car types so that the image-map-resizer is working */}
        {CAR_TYPES.map((item, index) =>
          item == carType ? (
            <WindowMap key={index} carType={item} selectWindow={selectWindow} />
          ) : (
            <div key={index} className='d-none'></div>
          ),
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
    </div>
  )
}
