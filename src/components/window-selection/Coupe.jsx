import { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogTitle, ToggleButton, ToggleButtonGroup } from '@mui/material'
import imageMapResize from 'image-map-resizer'
import styles from '../../css/window-selection.module.css'
import coupeTinted from '../../images/window-selection/Coupe/Coupe 2.png'
import coupe from '../../images/window-selection/Coupe/Coupe 3.png'
import front from '../../images/window-selection/Coupe/front.png'
import l_1 from '../../images/window-selection/Coupe/l_1.png'
import l_2 from '../../images/window-selection/Coupe/l_2.png'
import l_3 from '../../images/window-selection/Coupe/l_3.png'
import l_3_t from '../../images/window-selection/Coupe/l_3_t.png'
import r_1 from '../../images/window-selection/Coupe/r_1.png'
import r_2 from '../../images/window-selection/Coupe/r_2.png'
import r_3 from '../../images/window-selection/Coupe/r_3.png'
import r_3_t from '../../images/window-selection/Coupe/r_3_t.png'
import rear from '../../images/window-selection/Coupe/rear.png'
import rear_t from '../../images/window-selection/Coupe/rear_t.png'

export default function Coupe({ brokenWindowsToCustomer, brokenWindowsToComponent }) {
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
    { name: 'Left rear quarter', window: 'l_3', broken: false, source: l_3, hasTinted: true, tintedSource: l_3_t },
    { name: 'Right front quarter', window: 'r_1', broken: false, source: r_1, hasTinted: false },
    { name: 'Right front drop', window: 'r_2', broken: false, source: r_2, hasTinted: false },
    { name: 'Right rear quarter', window: 'r_3', broken: false, source: r_3, hasTinted: true, tintedSource: r_3_t },
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
        <img className={!tinted ? styles.baseImage : styles.baseImageInactive} src={coupe} alt='' />
        <img className={tinted ? styles.baseImage : styles.baseImageInactive} src={coupeTinted} alt='' />

        {/* broken glass displays */}
        {brokenWindows
          .filter((element) => element.broken === true)
          .map((element) => (
            <img
              key={element.window}
              className={styles.brokenGlassAlt}
              src={tinted && element.hasTinted ? element.tintedSource : element.source}
              alt=''
            />
          ))}

        {/* transparent layer on top of all car-related images to maintain image map */}
        <img className={styles.selectionLayer} src={coupe} alt='' useMap='#image-map' />
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
          coords='200,666,413,648,651,666,695,506,640,426,426,350,284,389,188,447,150,496'
          shape='poly'
        />
        <area
          onClick={() => selectWindow('rear')}
          coords='221,1075,247,1055,596,1057,627,1074,613,1308,557,1343,425,1361,304,1342,238,1315'
          shape='poly'
        />
        <area onClick={() => selectWindow('r_1')} coords='659,655,762,597,756,518,694,528' shape='poly' />
        <area onClick={() => selectWindow('r_2')} coords='634,1017,741,931,761,610,661,661,637,795' shape='poly' />
        <area onClick={() => selectWindow('r_3')} coords='635,1028,642,1237,691,1189,742,939' shape='poly' />
        <area onClick={() => selectWindow('l_1')} coords='189,650,147,506,97,518,87,607' shape='poly' />
        <area onClick={() => selectWindow('l_2')} coords='190,658,90,619,103,934,218,1026,214,822' shape='poly' />
        <area onClick={() => selectWindow('l_3')} coords='207,1244,218,1037,107,943,171,1223' shape='poly' />
      </map>
    </div>
  )
}
