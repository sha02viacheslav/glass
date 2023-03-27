import { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogTitle, ToggleButton, ToggleButtonGroup } from '@mui/material'
import imageMapResize from 'image-map-resizer'
import styles from '../../css/window-selection.module.css'
import estate from '../../images/window-selection/Estate/Estate 1.png'
import estateTinted from '../../images/window-selection/Estate/Estate 3.png'
import front from '../../images/window-selection/Estate/front.png'
import l_1 from '../../images/window-selection/Estate/l_1.png'
import l_2 from '../../images/window-selection/Estate/l_2.png'
import l_3 from '../../images/window-selection/Estate/l_3.png'
import l_3_t from '../../images/window-selection/Estate/l_3_t.png'
import l_4 from '../../images/window-selection/Estate/l_4.png'
import l_4_t from '../../images/window-selection/Estate/l_4_t.png'
import l_5 from '../../images/window-selection/Estate/l_5.png'
import l_5_t from '../../images/window-selection/Estate/l_5_t.png'
import r_1 from '../../images/window-selection/Estate/r_1.png'
import r_2 from '../../images/window-selection/Estate/r_2.png'
import r_3 from '../../images/window-selection/Estate/r_3.png'
import r_3_t from '../../images/window-selection/Estate/r_3_t.png'
import r_4 from '../../images/window-selection/Estate/r_4.png'
import r_4_t from '../../images/window-selection/Estate/r_4_t.png'
import r_5 from '../../images/window-selection/Estate/r_5.png'
import r_5_t from '../../images/window-selection/Estate/r_5_t.png'
import rear from '../../images/window-selection/Estate/rear.png'
import rear_t from '../../images/window-selection/Estate/rear_t.png'

export default function Estate({ brokenWindowsToCustomer, brokenWindowsToComponent }) {
  // display popup
  const [popup, setPopup] = useState(false)
  // determine if back windows are tinted
  const [tinted, setTinted] = useState(false)
  const [tintedValue, setTintedValue] = useState('no')
  // toggle first time popup appears, popup should show just once
  const [popupConfirm, setPopupConfirm] = useState(JSON.parse(sessionStorage.getItem('askedTinted')) || false)
  // array of possible window selections for Coupe
  const [brokenWindows, setBrokenWindows] = useState([
    { name: 'Windscreen', window: 'front', broken: false, source: front, hasTinted: false },
    { name: 'Backlight', window: 'rear', broken: false, source: rear, hasTinted: true, tintedSource: rear_t },
    { name: 'Left front quarter', window: 'l_1', broken: false, source: l_1, hasTinted: false },
    { name: 'Left front drop', window: 'l_2', broken: false, source: l_2, hasTinted: false },
    { name: 'Left rear drop', window: 'l_3', broken: false, source: l_3, hasTinted: true, tintedSource: l_3_t },
    { name: 'Left rear vent', window: 'l_4', broken: false, source: l_4, hasTinted: true, tintedSource: l_4_t },
    { name: 'Left rear quarter', window: 'l_5', broken: false, source: l_5, hasTinted: true, tintedSource: l_5_t },
    { name: 'Right front quarter', window: 'r_1', broken: false, source: r_1, hasTinted: false },
    { name: 'Right front drop', window: 'r_2', broken: false, source: r_2, hasTinted: false },
    { name: 'Right rear drop', window: 'r_3', broken: false, source: r_3, hasTinted: true, tintedSource: r_3_t },
    { name: 'Right rear vent', window: 'r_4', broken: false, source: r_4, hasTinted: true, tintedSource: r_4_t },
    { name: 'Right rear quarter', window: 'r_5', broken: false, source: r_5, hasTinted: true, tintedSource: r_5_t },
  ])
  // special array for sending selected broken windows to customer page
  const [selectedWindows, setSelectedWindows] = useState([])

  // handle window selection
  function selectWindow(windowClicked) {
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

  function handlePopup(answer) {
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
  function tintedButtonHandle(newValue) {
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
        if (brokenWindows[index].hasTinted === true) {
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

  function checkIfPreviouslySelected(selection) {
    // currently not working with tinted windows
    if (selection.includes(' privacy')) {
      tintedButtonHandle('yes')
    }
    const index = brokenWindows.findIndex((element) => element.name === selection.replace(' privacy', ''))
    if (index >= 0) {
      brokenWindows[index].broken = true
    } else {
      return
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
        <img className={!tinted ? styles.baseImage : styles.baseImageInactive} src={estate} alt='' />
        <img className={tinted ? styles.baseImage : styles.baseImageInactive} src={estateTinted} alt='' />

        {/* broken glass displays */}
        {brokenWindows
          .filter((element) => element.broken === true)
          .map((element) => (
            <img
              key={element.window}
              className={styles.brokenGlass}
              src={tinted && element.hasTinted ? element.tintedSource : element.source}
              alt=''
            />
          ))}

        {/* transparent layer on top of all car-related images to maintain image map */}
        <img className={styles.selectionLayer} src={estate} alt='' useMap='#image-map' />
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
          coords='224,700,425,684,627,702,664,503,659,477,502,415,344,414,190,474,185,506'
          shape='poly'
        />
        <area
          onClick={() => selectWindow('rear')}
          coords='214,1451,230,1383,277,1399,430,1405,580,1395,619,1380,635,1456,569,1499,430,1522,277,1503'
          shape='poly'
        />
        <area onClick={() => selectWindow('r_1')} coords='639,667,723,621,729,500,670,515' shape='poly' />
        <area onClick={() => selectWindow('r_2')} coords='637,677,721,631,724,843,615,892,619,766' shape='poly' />
        <area onClick={() => selectWindow('r_3')} coords='612,920,610,1089,722,1094,726,884' shape='poly' />
        <area onClick={() => selectWindow('r_4')} coords='611,1098,608,1138,679,1205,718,1202,721,1102' shape='poly' />
        <area onClick={() => selectWindow('r_5')} coords='608,1150,703,1236,686,1383,642,1372,624,1325' shape='poly' />
        <area onClick={() => selectWindow('l_1')} coords='210,674,174,509,112,499,117,615' shape='poly' />
        <area onClick={() => selectWindow('l_2')} coords='236,893,231,769,213,683,119,626,118,844' shape='poly' />
        <area onClick={() => selectWindow('l_3')} coords='239,924,240,1088,117,1092,116,890' shape='poly' />
        <area onClick={() => selectWindow('l_4')} coords='242,1094,240,1140,172,1198,123,1197,119,1099' shape='poly' />
        <area
          onClick={() => selectWindow('l_5')}
          coords='239,1153,228,1327,203,1373,159,1371,138,1227,177,1206'
          shape='poly'
        />
      </map>
    </div>
  )
}
