import React from 'react'
import { ThreeCircles } from 'react-loader-spinner'

type LoaderProps = {
  loading: boolean
  title?: string
}

export const Loader: React.FC<LoaderProps> = ({ loading, title = 'Loading... Please wait' }) => {
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
        background: 'rgba(0,0,0,0.4)',
        zIndex: 1400,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          left: 0,
          top: 0,
          width: '100%',
          maxWidth: '192px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
          backgroundColor: '#020E21',
          borderRadius: 4,
          padding: 16,
        }}
      >
        <ThreeCircles visible={true} color='#9557E8' height='80' width='80' />
        <div className='text-white mt-3'>{title}</div>
      </div>
    </div>
  ) : (
    <></>
  )
}
