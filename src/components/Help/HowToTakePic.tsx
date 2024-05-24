import { useMemo, useState } from 'react'
import { Typography, Box, Link, useTheme, useMediaQuery } from '@mui/material'
import { CustomModal } from '../Modal/CustomModal'

export const HowToTakePic = () => {
  const theme = useTheme()
  const isLg = useMediaQuery(theme.breakpoints.up('md'))

  const [open, setOpen] = useState(false)
  const helpItems = useMemo(
    () => [
      {
        title: 'Windscreen',
        description: 'Best is to send two pictures like bellow ',
        images: [
          {
            image: '/img/help/pic_1.png',
            caption: 'Picture 1 - Front picture of the car',
          },
          {
            image: '/img/help/pic_2.png',
            caption: 'Picture 2 - Top center part of windscreen',
          },
        ],
      },
      {
        title: 'Side glass',
        description: 'One properly taken image is enough.',
        images: [
          {
            image: '/img/help/pic_3.png',
            caption: 'Broken side glass picture properly taken',
          },
        ],
      },
      {
        title: 'Rear windscreen',
        description: 'One properly taken image is enough.',
        images: [
          {
            image: '/img/help/pic_4.png',
            caption: 'Broke nrear windscreen picture properly taken',
          },
        ],
      },
    ],
    [],
  )

  return (
    <>
      <Typography
        sx={{
          fontSize: { xs: 14, lg: 16 },
          marginTop: 2,
        }}
      >
        To see examples of excellent taken photo{' '}
        <Link sx={{ fontWeight: '700' }} onClick={() => setOpen(true)}>
          Tap here
        </Link>
      </Typography>
      <CustomModal open={open} onClose={() => setOpen(false)} title='How to take pictures' width={isLg ? 1100 : 700}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 6, lg: 12 } }}>
          {helpItems.map((el1, idx1) => (
            <Box key={idx1} flex={1}>
              <Typography sx={{ fontSize: 20 }} variant='h6'>
                {el1.title}
              </Typography>
              <Typography sx={{ fontSize: 14, mb: 4 }} className='text-grey'>
                {el1.description}
              </Typography>
              {el1.images.map((el, idx2) => (
                <Box key={idx2} mb={4}>
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
          ))}
        </Box>
      </CustomModal>
    </>
  )
}
