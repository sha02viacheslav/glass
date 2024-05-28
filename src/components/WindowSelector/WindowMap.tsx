import React, { useEffect, useMemo, useState } from 'react'
import { Box } from '@mui/system'
import imageMapResize from 'image-map-resizer'
import { CAR_IMAGES, COORDS } from '@glass/constants'
import { CarType, WinLoc } from '@glass/enums'
import { WindowSelection } from '@glass/models'
import styles from './window-selection.module.css'

export type WindowMapProps = {
  carType: CarType
  selectWindow: (value: WinLoc) => void
  value: WindowSelection[]
  id?: string
}
const R_DOT = 4
const D_DOT = R_DOT * 2
const COLOR_DOT = '#133F85' // '133F85'

export const WindowMap: React.FC<WindowMapProps> = ({ carType, selectWindow, value, id = 'map_workplace' }) => {
  const [scale, setScale] = useState(1)
  const [poCenter, setPoCenter] = useState(1)
  const [offset, setOffset] = useState(1)
  const [widthImage, setWidthImage] = useState(1)

  const windows = useMemo(
    () =>
      Object.entries(COORDS[carType]).map(([key, val]) => {
        const coords = val.split(',').map((el) => Number(el))
        let center = { x: 0, y: 0 }
        if (coords.length) {
          let sumX = 0
          let sumY = 0

          // Calculate the sum of x and y coordinates
          for (let i = 0; i < coords.length; i = i + 2) {
            sumX += coords[i]
            sumY += coords[i + 1]
          }

          // Calculate the average position
          const countPoly = coords.length / 2
          const x = (sumX / countPoly) * scale
          const y = (sumY / countPoly) * scale
          center = {
            x,
            y,
          }
        }
        const brokenItem = value.find((item) => item.window === key)
        return {
          id: key,
          coords: val,
          center,
          broken: brokenItem?.broken || false,
          name: brokenItem?.name || '',
          window: brokenItem?.window,
        }
      }),
    [carType, scale, value, poCenter],
  )

  const helps = useMemo(() => {
    const rightItems = windows
      .filter((brokenItem) => brokenItem.window === 'front' || brokenItem.center.x > poCenter)
      .sort((a, b) => (a.center.y > b.center.y ? 1 : -1))
    const leftItems = windows
      .filter((brokenItem) => brokenItem.window !== 'front' && brokenItem.center.x <= poCenter)
      .sort((a, b) => (a.center.y > b.center.y ? 1 : -1))

    return [leftItems, rightItems]
  }, [windows, poCenter])

  const getOffsetWithWrapper = () => {
    const dom = document.querySelector(`#${id} > img`)
    const wrapper = dom?.parentNode?.parentNode?.parentNode as HTMLElement

    if (dom && wrapper) {
      const widthW = wrapper.clientWidth
      const widthD = dom.clientWidth
      setOffset((widthW - widthD) >> 1)
      setWidthImage(widthD)
      setPoCenter(widthD >> 1)
    }
  }
  useEffect(() => {
    imageMapResize()
    const dom = document.querySelector(`#${id} > img`)

    if (dom) {
      dom.addEventListener('load', () => {
        // @ts-ignore
        const { naturalWidth, width } = dom
        setScale(width / naturalWidth)
        getOffsetWithWrapper()
      })
      window.addEventListener('resize', () => {
        // @ts-ignore
        const { naturalWidth, width } = dom
        setScale(width / naturalWidth)
        getOffsetWithWrapper()
      })
    }
  }, [])

  const rendered = () => {
    document.querySelectorAll(`#${id} [data-label-id]`).forEach((e) => {
      const dom = e as HTMLElement
      if (dom) {
        const data_p = dom.getAttribute('data-p')
        const data_id = dom.getAttribute('data-label-id')

        if (data_id) {
          const wClient = dom.clientWidth
          const rect = dom.getBoundingClientRect()
          const wTop = dom.offsetTop
          const wHeight = rect.height
          const divLine = document.querySelector<HTMLElement>(`#${id} svg[data-line-id='${data_id}']`)
          if (divLine) {
            const lTop = parseInt(divLine.style.top)
            const lLeft = parseInt(divLine.style.left)
            const height = wTop - lTop + wHeight
            let width = 0
            if (data_p === 'right') {
              width = widthImage - lLeft + offset - wClient + 0
            } else {
              width = lLeft + offset - wClient
            }
            divLine.setAttribute('height', `${Math.abs(height) + 0}`)
            divLine.setAttribute('width', `${Math.abs(width) + 0}`)
            const divLineSvg = divLine.firstElementChild
            if (divLineSvg) {
              if (data_p === 'right') {
                if (height < 0) {
                  divLine.style.transform = 'scaleY(-1) translateY(100%)'
                } else {
                  divLine.style.transform = 'unset'
                }
              } else {
                if (height < 0) {
                  if (width < 0) {
                    divLine.style.transform = 'scaleY(-1) translateY(100%)'
                  } else {
                    divLine.style.transform = 'scale(-1) translateY(100%) translateX(100%)'
                  }
                } else {
                  if (width < 0) {
                    divLine.style.transform = 'unset'
                  } else {
                    divLine.style.transform = 'scaleY(-1) translateX(-100%)'
                  }
                }
              }
            }
          }
        }
      }
    })
  }

  useEffect(() => {
    setTimeout(() => {
      rendered()
    }, 10)
  }, [helps, offset, poCenter, widthImage])

  return (
    <div id={id}>
      <img className={styles.selectionLayer} src={CAR_IMAGES[carType]} alt='' useMap='#window-image-map' />

      <map name='window-image-map'>
        {windows.map((el) => (
          <area
            key={`${carType}-${el.id}`}
            onClick={() => selectWindow(el.id as WinLoc)}
            coords={el.coords}
            shape='poly'
            alt='window-selector'
          />
        ))}
      </map>
      {windows.map((el) => (
        <Box key={el.id}>
          <Box
            sx={{
              position: 'absolute',
              width: D_DOT,
              height: D_DOT,
              left: el.center.x,
              top: el.center.y,
              backgroundColor: COLOR_DOT,
              borderRadius: 10,
              zIndex: 55,
              transform: 'translate(-3px, -3px)',
              opacity: el.broken ? 1 : 0,
              cursor: 'pointer',
            }}
            data-center={`${el.center.x}, ${el.center.y}`}
            onClick={() => selectWindow(el.id as WinLoc)}
          ></Box>
          <svg
            style={{
              position: 'absolute',
              left: el.center.x,
              top: el.center.y,
              zIndex: 99,
              opacity: el.broken ? 1 : 0,
              cursor: 'pointer',
            }}
            width={1}
            height={2}
            data-line-id={el.window}
            onClick={() => selectWindow(el.id as WinLoc)}
          >
            <line x1={0} y1={0} x2={'100%'} y2={'100%'} style={{ stroke: COLOR_DOT, strokeWidth: 2 }} />
          </svg>
        </Box>
      ))}
      <Box
        style={{
          position: 'absolute',
          zIndex: 44,
          right: -offset,
          top: 0,
          height: '100%',
        }}
        display={'flex'}
        flexDirection={'column'}
        gap={{ xs: 2, sm: 2, md: 4 }}
        alignItems={'flex-end'}
        id='win_right'
      >
        {helps[1].map((el) => (
          <Box
            key={el.id}
            sx={{
              backgroundColor: '#E8F0FE',
              px: 2,
              py: 1,
              borderWidth: 0,
              borderBottomWidth: '2px',
              borderBottomColor: COLOR_DOT,
              borderStyle: 'solid',
              boxShadow: '0px 1px 2px 0px #0000004D',
              maxWidth: offset + 20,
              width: 'max-content',
              textAlign: 'center',
              fontSize: 14,
              opacity: el.broken ? 1 : 0,
            }}
            data-label-id={el.window}
            data-p='right'
          >
            {el.name}
          </Box>
        ))}
      </Box>
      <Box
        style={{
          position: 'absolute',
          zIndex: 44,
          left: -offset,
          top: 0,
          height: '100%',
        }}
        display={'flex'}
        flexDirection={'column'}
        gap={{ xs: 2, sm: 2, md: 4 }}
        alignItems={'flex-start'}
        id='win_left'
      >
        {helps[0].map((el) => (
          <Box
            key={el.id}
            sx={{
              backgroundColor: '#E8F0FE',
              px: 2,
              py: 1,
              borderWidth: 0,
              borderBottomWidth: '2px',
              borderBottomColor: COLOR_DOT,
              borderStyle: 'solid',
              boxShadow: '0px 1px 2px 0px #0000004D',
              maxWidth: offset + 20,
              width: 'max-content',
              textAlign: 'center',
              fontSize: 14,
              opacity: el.broken ? 1 : 0,
            }}
            data-label-id={el.window}
            data-p='left'
          >
            {el.name}
          </Box>
        ))}
      </Box>
    </div>
  )
}
