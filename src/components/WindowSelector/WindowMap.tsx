import React, { useEffect } from 'react'
import imageMapResize from 'image-map-resizer'
import { CAR_IMAGES, COORDS } from '@glass/constants'
import { CarType, WinLoc } from '@glass/enums'
import styles from './window-selection.module.css'

export type WindowMapProps = {
  carType: CarType
  selectWindow: (value: WinLoc) => void
}

export const WindowMap: React.FC<WindowMapProps> = ({ carType, selectWindow }) => {
  useEffect(() => {
    imageMapResize()
  }, [carType])

  return (
    <>
      {!!carType && (
        <>
          <img className={styles.selectionLayer} src={CAR_IMAGES[carType]} alt='' useMap='#window-image-map' />

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
        </>
      )}
    </>
  )
}
