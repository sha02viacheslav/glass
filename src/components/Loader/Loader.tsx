import React from 'react'
import { Box, Typography } from '@mui/material'
import { ColorRing } from 'react-loader-spinner'

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
      <Box
        sx={{
          left: 0,
          top: 0,
          width: '100%',
          maxWidth: '240px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
          backgroundColor: '#020E21',
          borderRadius: 1,
          px: 6,
          py: 4,
        }}
      >
        <ColorRing
          visible={true}
          height='80'
          width='80'
          ariaLabel='color-ring-loading'
          wrapperStyle={{}}
          wrapperClass='color-ring-wrapper'
          colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
        />
        <Typography
          sx={{
            textAlign: 'center',
            color: '#FFF',
            fontSize: '18px',
            fontWeight: '700',
            lineHeight: 'normal',
            mt: 2,
          }}
        >
          {title}
        </Typography>
      </Box>
    </div>
  ) : (
    <></>
  )
}
