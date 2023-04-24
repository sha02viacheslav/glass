import React from 'react'
import { ThreeCircles } from 'react-loader-spinner'

type LoaderProps = {
  loading: boolean
}

export const Loader: React.FC<LoaderProps> = ({ loading }) => {
  return loading ? (
    <div
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.2)',
        zIndex: 1400,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
        }}
      >
        <ThreeCircles visible={true} color='#9557E8' height='100' width='100' />
      </div>
    </div>
  ) : (
    <></>
  )
}
