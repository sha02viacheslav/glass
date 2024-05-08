import './Customer.css'
import React from 'react'
import { Box, CardMedia, Typography } from '@mui/material'
import { Workshop } from '@glass/models'

export type WorkshopCardProps = {
  workshop: Workshop
  selected: boolean
  onSelect: () => void
}

export const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop, selected, onSelect }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        borderRadius: '2px',
        background: '#fff',
        boxShadow:
          '0px 4px 17px 0px rgba(147, 147, 147, 0.04), 0px 2px 12px 0px rgba(147, 147, 147, 0.07), 0px 1px 7px 0px rgba(147, 147, 147, 0.09)',
        border: selected ? '2px solid var(--Light-Blue---Primary-400, #4285F4)' : 'none',
      }}
    >
      <CardMedia component='img' sx={{ width: 129 }} image={workshop.workshop_image_url} alt='Workshop' />

      <Box sx={{ position: 'absolute', left: '12px', top: '12px', cursor: 'pointer' }} onClick={() => onSelect()}>
        <img
          src={process.env.PUBLIC_URL + '/images/' + (selected ? 'workshop-radio-checked.svg' : 'workshop-radio.svg')}
        />
      </Box>

      <Box sx={{ width: 'calc(100% - 129px)', padding: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
          <img src={process.env.PUBLIC_URL + '/images/map-marker-light.svg'} className='img-fluid' alt='' />
          <Typography className='text-grey' sx={{ fontSize: '12px' }}>
            {workshop.address}
          </Typography>
        </Box>

        <Typography sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {workshop.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <Typography sx={{ color: 'var(--Gray-600, #6A6B71)', fontSize: '12px', lineHeight: '16px' }}>5.0</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={process.env.PUBLIC_URL + '/images/star.svg'} className='img-fluid' alt='' />
            <img src={process.env.PUBLIC_URL + '/images/star.svg'} className='img-fluid' alt='' />
            <img src={process.env.PUBLIC_URL + '/images/star.svg'} className='img-fluid' alt='' />
            <img src={process.env.PUBLIC_URL + '/images/star.svg'} className='img-fluid' alt='' />
            <img src={process.env.PUBLIC_URL + '/images/star.svg'} className='img-fluid' alt='' />
          </Box>
          <Typography sx={{ color: 'var(--Gray-600, #6A6B71)', fontSize: '12px', lineHeight: '16px' }}>(62)</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
            <img src={process.env.PUBLIC_URL + '/images/clock-blue.svg'} alt='' />
            <Typography sx={{ color: 'var(--Gray-600, #6A6B71)', fontSize: '16px', lineHeight: '150%' }}>
              7 AM - 7 PM
            </Typography>
          </Box>
          <Typography
            sx={{
              color: 'var(--Green---Semantic-500, #22C24D)',
              fontFamily: 'Inter',
              fontSize: '16px',
              fontWeight: '600',
              lineHeight: '150%',
              letterSpacing: '-0.16px',
              cursor: 'pointer',
            }}
          >
            Open
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
