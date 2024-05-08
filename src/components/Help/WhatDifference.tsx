import { useMemo, useState } from 'react'
import { Typography, Box, Link } from '@mui/material'
import { CustomModal } from '../Modal/CustomModal'

export const WhatDifference = () => {
  const [open, setOpen] = useState(false)
  const helpItems = useMemo(
    () => [
      {
        id: 1,
        title: 'Laminated glass',
        description:
          'Laminated glass is made of two layers of glass with a plastic layer in between, offering strength and safety (picture below). ',
        image: '/img/help/broken.png',
        caption: 'Broken laminated glass',
      },
      {
        id: 2,
        title: 'Tempered glass',
        description:
          'Tempered glass is treated with heat to make it stronger and shatter into small, dull pieces to shatter safety in case of breakage. ',
        image: '/img/help/broken.png',
        caption: 'Broken laminated glass',
      },
    ],
    [],
  )
  return (
    <>
      <Link sx={{ fontWeight: '700', color: 'var(--Light-Blue---Primary-500, #225fc2)' }} onClick={() => setOpen(true)}>
        What is the difference between Laminated and Tempered glass?
      </Link>
      <CustomModal open={open} onClose={() => setOpen(false)} title='Laminated/tempered glass' width={700}>
        <Box>
          {helpItems.map((el) => (
            <Box key={el.id} flex={1} mb={6}>
              <Typography sx={{ fontSize: 20 }} variant='h6'>
                {el.title}
              </Typography>
              <Typography sx={{ fontSize: 14, mb: 4 }} className='text-grey'>
                {el.description}
              </Typography>
              {el.image && (
                <Box className='text-center'>
                  <img src={el.image} className='w-100' />
                </Box>
              )}
              {el.caption && (
                <Typography sx={{ fontSize: 12 }} className='text-grey'>
                  {el.caption}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </CustomModal>
    </>
  )
}
