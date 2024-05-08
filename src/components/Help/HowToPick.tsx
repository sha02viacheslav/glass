import { useMemo, useState } from 'react'
import { Typography, Box, Link } from '@mui/material'
import { CustomModal } from '../Modal/CustomModal'
export const HowToPick = () => {
  const [open, setOpen] = useState(false)
  const helpItems = useMemo(
    () => [
      {
        id: 1,
        title: 'Stand behind your car',
        description: 'Stand behind your car to decide on which side of the car the broken glass is.',
        image: '/img/help/car_1.png',
      },
      {
        id: 2,
        title: 'Pick side',
        description: 'Now you can easily decide on which side the broken glass is. ',
        image: '/img/help/car_2.png',
      },
      {
        id: 3,
        title: 'Still not sure? Don’t worry',
        description:
          'Pick one that you think. You will be able to upload images on next step and we will check your decision. ',
      },
    ],
    [],
  )
  return (
    <>
      <Typography
        sx={{
          fontSize: 14,
          marginTop: 2,
        }}
      >
        Not sure how to pick broken glass?{' '}
        <Link sx={{ fontWeight: '700' }} onClick={() => setOpen(true)}>
          Tap here
        </Link>
      </Typography>
      <CustomModal open={open} onClose={() => setOpen(false)} title='How to  pick glass' width={700}>
        <Box>
          {helpItems.map((el) => (
            <Box key={el.id} display={'flex'} gap={2} alignItems={'flex-start'} mb={3}>
              <Box
                sx={{
                  borderRadius: 20,
                  backgroundColor: '#E8F0FE',
                  p: 3,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#020E21',
                }}
              >
                {el.id}
              </Box>

              <Box flex={1}>
                <Typography sx={{ fontSize: 20 }} variant='h6'>
                  {el.title}
                </Typography>
                <Typography sx={{ fontSize: 14, mb: 4 }} className='text-grey'>
                  {el.description}
                </Typography>
                {el.image && (
                  <Box className='text-center'>
                    <img src={el.image} />
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </CustomModal>
    </>
  )
}
