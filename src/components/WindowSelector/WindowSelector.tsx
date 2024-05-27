import React, { useEffect, useMemo, useState } from 'react'
import { Box, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'
import { cloneDeep } from 'lodash'
import { ConfirmDialog } from '@glass/components/ConfirmDialog'
import { WindowMap } from '@glass/components/WindowSelector/WindowMap'
import { CAR_IMAGES, CAR_TINTED_IMAGES, CAR_TYPES, WINDOWS } from '@glass/constants'
import { CarType, WinLoc } from '@glass/enums'
import { Characteristic, WindowSelection } from '@glass/models'
import { getCharacteristicService } from '@glass/services/apis/get-characteristic.service'
import {
  getAskedTint,
  getAskedVan,
  getVanBodyType,
  setAskedTint,
  setAskedVan,
  setVanBodyType,
} from '@glass/utils/session/session.util'
import { PickGlassDialog } from './PickGlassDialog'
import { Questions } from './Questions'
import styles from './window-selection.module.css'
import { HowToPick } from '../Help/HowToPick'
import { WhatDifference } from '../Help/WhatDifference'

export type WindowSelectorProps = {
  showInRow?: boolean
  disabled?: boolean
  carType: CarType
  registrationNumber: string
  selectedGlasses?: string[]
  setCarType?: (value: CarType) => void
  onSelectBrokenGlasses?: (value: string[]) => void
  onChangeCharacteristics?: (value: Characteristic[]) => void
  id?: string
}

export const WindowSelector: React.FC<WindowSelectorProps> = ({
  showInRow = false,
  disabled = false,
  carType,
  registrationNumber,
  selectedGlasses,
  setCarType = () => {},
  onSelectBrokenGlasses = () => {},
  onChangeCharacteristics = () => {},
  id = 'map_workplace',
}) => {
  // display popup
  const [showSelectGlassGuide, setShowSelectGlassGuide] = useState<boolean>(true)
  const [showTintedPopup, setShowTintedPopup] = useState<boolean>(false)
  // determine if back windows are tinted
  const [tinted, setTinted] = useState(false)

  // determine if body is tailgater or barn door for the vans
  const [bodyValue, setBodyValue] = useState(getVanBodyType())
  const [isBarnDoor, setIsBarnDoor] = useState(false)
  const [bodyConfirmed, setBodyConfirmed] = useState(getAskedVan())
  const [showBodyPopup, setShowBodyPopup] = useState(false)

  // toggle first time popup appears, popup should show just once
  const [tintedConfirmed, setTintedConfirmed] = useState(getAskedTint())
  // array of possible window selections for Coupe
  const [brokenWindows, setBrokenWindows] = useState<WindowSelection[]>([])
  // special array for sending selected broken windows to customer page
  const [selectedWindows, setSelectedWindows] = useState<string[]>([])
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<Record<string, number>>({})

  const [characteristics, setCharacteristics] = useState<{ [key: string]: Characteristic[] }>({})
  const [filteredCharacteristics, setFilteredCharacteristics] = useState<{ [key: string]: Characteristic[] }>({})

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
    return ''
  }, [carType])

  const isVan = useMemo(() => {
    return carType == CarType.BARN || carType == CarType.TAILGATER
  }, [carType])

  const needHelp = useMemo(() => {
    let isExistHelpKey = false
    const keys = Object.keys(characteristics)
    for (let ii = 0; ii < keys.length; ii++) {
      const value = characteristics[keys[ii]][activeQuestionIndex[keys[ii]]]
      if (value) {
        const questionName = value.name.toLowerCase() || ''
        isExistHelpKey = questionName.includes('laminated') || questionName.includes('tempered')
        if (isExistHelpKey) break
      }
    }

    return isExistHelpKey
  }, [activeQuestionIndex, characteristics])

  const dispatchSelected = (selected: string[]) => {
    // update tinted windows in selectedWindows array as not tinted
    setSelectedWindows((windows) => windows.slice())
    // setSelectedWindows(selected)
    if (onSelectBrokenGlasses) onSelectBrokenGlasses(selected.map((item) => item.toLowerCase()))
  }
  // handle window selection
  const selectWindow = (windowClicked: WinLoc) => {
    if (disabled) return
    let index = 0
    if ((windowClicked === 'r_rear' || windowClicked === 'l_rear') && !isBarnDoor) {
      // Special case for vans
      index = brokenWindows.findIndex((element) => element.window === WinLoc.REAR)
    } else {
      index = brokenWindows.findIndex((element) => element.window === windowClicked)
    }
    const alreadySelected = brokenWindows[index].broken
    // display popup if a window which can be tinted is clicked for the first time
    if (!tintedConfirmed && brokenWindows[index].hasTinted) {
      setShowTintedPopup(true)
      return // don't allow back window selecting if popup is still active
    } else if (
      !bodyConfirmed &&
      (carType == CarType.BARN || carType == CarType.TAILGATER) &&
      brokenWindows[index].window === WinLoc.REAR
    ) {
      // Special case for vans
      setShowBodyPopup(true)
      return
    }
    // add to array which is sent to customer page
    if (alreadySelected) {
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
    dispatchSelected(selectedWindows)
    brokenWindows[index].broken = !brokenWindows[index].broken
    setBrokenWindows((windows) => windows.slice())
  }

  // handle tinted toggle button
  const handleChangeTint = (newValue: boolean) => {
    setTinted(newValue)
    if (!newValue) {
      // update tinted windows in brokenWindows array as not tinted
      for (let i = 0; i < selectedWindows.length; i++) {
        selectedWindows[i] = selectedWindows[i].replace('non-privacy', 'privacy').replace('privacy', 'non-privacy')
      }

      dispatchSelected(selectedWindows)
    } else {
      for (let i = 0; i < selectedWindows.length; i++) {
        selectedWindows[i] = selectedWindows[i].replace('non-privacy', 'privacy')
      }
      dispatchSelected(selectedWindows)
    }
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
    dispatchSelected(selectedWindows)
  }

  const handleTintPopup = (isTintValue: boolean) => {
    setTinted(isTintValue)
    setShowTintedPopup(false)
    setTintedConfirmed(true)
    setAskedTint()
    handleChangeTint(isTintValue)
  }

  const handleBodyPopup = (isBarn: boolean) => {
    setIsBarnDoor(isBarn)
    setShowBodyPopup(false)
    setBodyConfirmed(true)
    setAskedVan()
    bodyChange(isBarn)
  }

  const checkIfPreviouslySelected = (selection: string) => {
    // currently not working with tinted windows
    if (selection.includes(' privacy')) {
      setTinted(true)
      setAskedTint()
      setTintedConfirmed(true)
    }
    const index = brokenWindows.findIndex(
      (element) => element.name === selection.replace(' non-privacy', '').replace(' privacy', ''),
    )
    if (index >= 0) {
      brokenWindows[index].broken = true
    }
  }

  const getCharacteristics = () => {
    if (registrationNumber) {
      getCharacteristicService(registrationNumber).then((res) => {
        if (res.success) {
          setCharacteristics(res.data)
        }
      })
    }
  }

  useEffect(() => {
    if (!characteristics?.length) {
      getCharacteristics()
    }
  }, [registrationNumber])

  useEffect(() => {
    const characteristicsResult: Characteristic[] = []
    const initialActives: Record<string, number> = {}
    Object.keys(filteredCharacteristics).forEach((key) => {
      filteredCharacteristics[key].forEach((characteristic) => {
        characteristicsResult.push({ ...characteristic })
      })
      initialActives[key] = 0
    })
    setActiveQuestionIndex(initialActives)
    onChangeCharacteristics(characteristicsResult)
  }, [filteredCharacteristics])

  useEffect(() => {
    const newCharacteristics: { [key: string]: Characteristic[] } = {}
    Object.keys(characteristics)
      .filter((key) => (selectedGlasses || [])?.findIndex((glass) => glass.includes(key)) > -1)
      .forEach((key) => {
        newCharacteristics[key] = characteristics[key]
      })
    setFilteredCharacteristics(newCharacteristics)
  }, [characteristics, selectedGlasses])

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
    if (selectedGlasses && selectedGlasses.length > 0) {
      selectedGlasses = selectedGlasses.map((item) => item.charAt(0).toUpperCase() + item.slice(1))
      selectedGlasses?.forEach((element) => checkIfPreviouslySelected(element))
      setSelectedWindows(selectedGlasses)
    }
    if (bodyValue === CarType.BARN) {
      setIsBarnDoor(true)
    } else {
      setIsBarnDoor(false)
    }
  }, [selectedGlasses])

  return (
    <Box sx={{ display: { lg: showInRow ? 'flex' : 'block' } }}>
      <div className={styles.container}>
        {showTintedPopup && (
          <ConfirmDialog
            title='Tinted Back Window'
            description='Are you sure back windows tinted?'
            showIcon={false}
            confirmStr='Yes'
            cancelStr='No'
            onConfirm={() => handleTintPopup(true)}
            onCancel={() => handleTintPopup(false)}
          />
        )}

        {(carType == CarType.BARN || carType == CarType.TAILGATER) && showBodyPopup && (
          <ConfirmDialog
            title='Rear Windows'
            description='Do you have one or two rear windows?'
            showIcon={false}
            confirmStr='Two'
            cancelStr='One'
            onConfirm={() => handleBodyPopup(true)}
            onCancel={() => handleBodyPopup(false)}
          />
        )}

        <div className={styles.imgContainer} id='image_container'>
          {/* display either car with tinted windows or normal */}
          <img className={!tinted ? styles.baseImage : styles.baseImageInactive} src={CAR_IMAGES[carType]} alt='' />
          <img
            className={tinted ? styles.baseImage : styles.baseImageInactive}
            src={CAR_TINTED_IMAGES[carType]}
            alt=''
          />

          {!disabled && showSelectGlassGuide && (
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
              <WindowMap key={index} carType={carType} selectWindow={selectWindow} value={brokenWindows} id={id} />
            ) : (
              <div key={index} className='d-none'></div>
            ),
          )}
        </div>

        {!disabled && <HowToPick />}
      </div>

      <Box
        sx={{
          p: { lg: showInRow ? '24px 48px 48px' : '' },
          borderRadius: '16px',
          border: { lg: showInRow ? '2px solid var(--Gray-100, #F2F2F3)' : '' },
          background: { lg: showInRow ? '#fff' : '' },
        }}
      >
        {!disabled && tintedConfirmed && (
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

            <RadioGroup row value={tinted} onChange={(_, value) => handleChangeTint(value === 'true')}>
              <FormControlLabel value={true} control={<Radio />} label='Yes' disabled={disabled} />
              <FormControlLabel value={false} control={<Radio />} label='No' disabled={disabled} />
            </RadioGroup>
          </Box>
        )}

        {!disabled && isVan && bodyConfirmed && (
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
              Body type?
            </Typography>

            <RadioGroup row value={bodyValue} onChange={(_, value) => bodyChange(value === CarType.BARN)}>
              <FormControlLabel value={CarType.BARN} control={<Radio />} label='Barn door' disabled={disabled} />
              <FormControlLabel value={CarType.TAILGATER} control={<Radio />} label='Tailgater' disabled={disabled} />
            </RadioGroup>
          </Box>
        )}

        {Object.keys(filteredCharacteristics).map((key) => (
          <Box key={key} sx={{ marginTop: 4 }}>
            {!disabled && (
              <Box sx={{ borderTop: '1px solid var(--Gray-100, #f2f2f3)', pt: 4 }}>
                <Typography
                  sx={{
                    color: 'var(--Gray-600, #6A6B71)',
                    fontSize: '12px',
                    fontWeight: '700',
                    lineHeight: '150%',
                    letterSpacing: '0.84px',
                    textTransform: 'uppercase',
                  }}
                >
                  QUESTIONS ABOUT {key}
                </Typography>

                <Typography
                  sx={{
                    color: 'var(--Gray-800, #14151F)',
                    fontSize: '16px',
                    fontWeight: '400',
                    lineHeight: '150%',
                    letterSpacing: '-0.16px',
                    marginTop: 4,
                  }}
                >
                  We need some additional information related to your {key}{' '}
                  <Typography
                    sx={{
                      display: 'inline',
                      color: 'var(--Gray-600, #6A6B71)',
                    }}
                    component='span'
                  >
                    (Just {characteristics[key].length} fast questions).
                  </Typography>
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
              </Box>
            )}

            <Questions
              characteristics={characteristics[key]}
              disabled={disabled}
              onChange={(value) => {
                setCharacteristics((prev) => {
                  prev[key] = value
                  return { ...prev }
                })
              }}
              setActiveIndex={(v) => setActiveQuestionIndex({ ...activeQuestionIndex, [key]: v })}
            ></Questions>
          </Box>
        ))}
        {needHelp && (
          <Box pt={4}>
            <WhatDifference />
          </Box>
        )}
      </Box>
    </Box>
  )
}
