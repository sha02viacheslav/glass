import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogTitle, ToggleButton, ToggleButtonGroup } from '@mui/material'
import imageMapResize from 'image-map-resizer'
import styles from '../../css/window-selection.module.css'
import fiveDoorTinted from '../../images/window-selection/5DoorHatch/5-Door Hatch 2.png'
import fiveDoor from '../../images/window-selection/5DoorHatch/5-Door Hatch 4.png'
import front from '../../images/window-selection/5DoorHatch/front.png'
import l_1 from '../../images/window-selection/5DoorHatch/l_1.png'
import l_2 from '../../images/window-selection/5DoorHatch/l_2.png'
import l_3 from '../../images/window-selection/5DoorHatch/l_3.png'
import l_3_t from '../../images/window-selection/5DoorHatch/l_3_t.png'
import l_4 from '../../images/window-selection/5DoorHatch/l_4.png'
import l_4_t from '../../images/window-selection/5DoorHatch/l_4_t.png'
import r_1 from '../../images/window-selection/5DoorHatch/r_1.png'
import r_2 from '../../images/window-selection/5DoorHatch/r_2.png'
import r_3 from '../../images/window-selection/5DoorHatch/r_3.png'
import r_3_t from '../../images/window-selection/5DoorHatch/r_3_t.png'
import r_4 from '../../images/window-selection/5DoorHatch/r_4.png'
import r_4_t from '../../images/window-selection/5DoorHatch/r_4_t.png'
import rear from '../../images/window-selection/5DoorHatch/rear.png'
import rear_t from '../../images/window-selection/5DoorHatch/rear_t.png'

export type FiveDoorHatchProps = {
  brokenWindowsToCustomer: (value: string[]) => void
  brokenWindowsToComponent: string[]
}

const FiveDoorHatch: React.FC<FiveDoorHatchProps> = ({ brokenWindowsToCustomer, brokenWindowsToComponent }) => {
  // display popup
  const [popup, setPopup] = useState(false)
  // determine if back windows are tinted
  const [tinted, setTinted] = useState(false)
  const [tintedValue, setTintedValue] = useState('no')
  // toggle first time popup appears, popup should show just once
  const [popupConfirm, setPopupConfirm] = useState(JSON.parse(sessionStorage.getItem('askedTinted') || 'false'))
  // array of possible window selections for Coupe
  const [brokenWindows, setBrokenWindows] = useState([
    { name: 'Windscreen', window: 'front', broken: false, source: front, hasTinted: false },
    { name: 'Backlight', window: 'rear', broken: false, source: rear, hasTinted: true, tintedSource: rear_t },
    { name: 'Left front quarter', window: 'l_1', broken: false, source: l_1, hasTinted: false },
    { name: 'Left front drop', window: 'l_2', broken: false, source: l_2, hasTinted: false },
    { name: 'Left rear vent', window: 'l_3', broken: false, source: l_3, hasTinted: true, tintedSource: l_3_t },
    { name: 'Left rear quarter', window: 'l_4', broken: false, source: l_4, hasTinted: true, tintedSource: l_4_t },
    { name: 'Right front quarter', window: 'r_1', broken: false, source: r_1, hasTinted: false },
    { name: 'Right front drop', window: 'r_2', broken: false, source: r_2, hasTinted: false },
    { name: 'Right rear vent', window: 'r_3', broken: false, source: r_3, hasTinted: true, tintedSource: r_3_t },
    { name: 'Right rear quarter', window: 'r_4', broken: false, source: r_4, hasTinted: true, tintedSource: r_4_t },
  ])
  // special array for sending selected broken windows to customer page
  const [selectedWindows, setSelectedWindows] = useState<string[]>([])

  // handle window selection
  function selectWindow(windowClicked: string) {
    const index = brokenWindows.findIndex((element) => element.window === windowClicked)
    // display popup if a window which can be tinted is clicked for the first time
    if (!popupConfirm && brokenWindows[index].hasTinted) {
      setPopup(true)
      return // don't allow back window selecting if popup is still active
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
    brokenWindowsToCustomer(selectedWindows)
  }, [selectedWindows])

  function handlePopup(answer: boolean) {
    setTinted(answer)
    setPopup(false)
    setPopupConfirm(true)
    if (answer) {
      setTintedValue('yes')
    } else {
      setTintedValue('no')
    }
    sessionStorage.setItem('askedTinted', JSON.stringify(true))
  }

  // handle tinted toggle button
  function tintedButtonHandle(newValue: string) {
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

  function checkIfPreviouslySelected(selection: string) {
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
    // necessary to maintain proper image map scaling
    imageMapResize()
    // preselect windows if previously selected
    if (brokenWindowsToComponent.length > 0) {
      brokenWindowsToComponent.forEach((element) => checkIfPreviouslySelected(element))
      setSelectedWindows(brokenWindowsToComponent)
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

      <div className={styles.imgContainer}>
        {/* display either car with tinted windows or normal */}
        <img className={!tinted ? styles.baseImage : styles.baseImageInactive} src={fiveDoor} alt='' />
        <img className={tinted ? styles.baseImage : styles.baseImageInactive} src={fiveDoorTinted} alt='' />

        {/* broken glass displays */}
        {brokenWindows
          .filter((element) => element.broken)
          .map((element) => (
            <img
              key={element.window}
              className={styles.brokenGlass}
              src={tinted && element.hasTinted ? element.tintedSource : element.source}
              alt=''
            />
          ))}

        {/* transparent layer on top of all car-related images to maintain image map */}
        <img className={styles.selectionLayer} src={fiveDoor} alt='' useMap='#image-map' />
      </div>

      {/* tinted window toggle */}
      <div>
        <span className='fs-18 text-blue'>Privacy windows: </span>
        <ToggleButtonGroup sx={{ ml: '10px' }} color='secondary' value={tintedValue} exclusive aria-label='Platform'>
          <ToggleButton sx={{ width: 70 }} size='small' value='yes' onClick={() => tintedButtonHandle('yes')}>
            Yes
          </ToggleButton>
          <ToggleButton sx={{ width: 70 }} size='small' value='no' onClick={() => tintedButtonHandle('no')}>
            No
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

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

      <map name='image-map'>
        <area
          onClick={() => selectWindow('front')}
          coords='210,709,166,494,172,468,306,408,410,396,489,398,625,437,675,469,683,501,643,712,426,693'
          shape='poly'
        />
        <area
          onClick={() => selectWindow('rear')}
          coords='196,1334,214,1257,268,1275,428,1284,585,1273,635,1257,650,1333,580,1389,425,1409,271,1391'
          shape='poly'
        />
        <area onClick={() => selectWindow('r_1')} coords='654,679,747,627,720,478,687,509' shape='poly' />
        <area onClick={() => selectWindow('r_2')} coords='627,922,743,858,747,636,655,686,635,768' shape='poly' />
        <area onClick={() => selectWindow('r_3')} coords='624,952,623,1129,755,1133,747,905' shape='poly' />
        <area onClick={() => selectWindow('r_4')} coords='626,1134,626,1182,707,1261,750,1222,753,1141' shape='poly' />
        <area onClick={() => selectWindow('l_1')} coords='195,682,160,512,122,499,103,627' shape='poly' />
        <area onClick={() => selectWindow('l_2')} coords='105,641,199,691,219,787,223,919,95,869' shape='poly' />
        <area onClick={() => selectWindow('l_3')} coords='227,956,225,1126,93,1130,96,903' shape='poly' />
        <area onClick={() => selectWindow('l_4')} coords='222,1132,219,1184,159,1253,99,1242,98,1138' shape='poly' />
      </map>
    </div>
  )
}

export { FiveDoorHatch as default }
