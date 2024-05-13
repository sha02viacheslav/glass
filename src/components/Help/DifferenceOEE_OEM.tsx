import { useMemo, useState } from 'react'
import { Typography, Box, Link } from '@mui/material'
import { CustomModal } from '../Modal/CustomModal'
import './help.css'

export const DifferenceOEE_OEM = () => {
  const [open, setOpen] = useState(false)
  const helpItems = useMemo(
    () => [
      {
        id: 1,
        title: 'OEE Glass',
        description:
          "OEE glass is equivalent to the manufacturer's original glass, made to same standards by different companies.",
        image: '/img/help/car_1.png',
      },
      {
        id: 2,
        title: 'OEM Glass',
        description:
          'OEM glass is the exact same glass that was originally installed in the car by the manufacturer, ensuring precise fit and quality.',
        image: '/img/help/car_2.png',
      },
      {
        id: 3,
        title: 'Damaged OEM repaired with OEE glass',
        description:
          'Below you can see damaged OEM glass on Range Rover Sport replaced with OEE glass. Manufacturer for both types is Pilkington.',
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
        <Link sx={{ fontWeight: '700' }} onClick={() => setOpen(true)}>
          What is the difference between OEE and OEM?
        </Link>
      </Typography>
      <CustomModal
        open={open}
        onClose={() => setOpen(false)}
        title='What is the difference between OEE and OEM'
        titleStyle={{ fontSize: 16, whiteSpace: 'nowrap', letterSpacing: '-1px' }}
        width={700}
      >
        <Box>
          {helpItems.map((el) => (
            <Box key={el.id} flex={1} mb={6}>
              <Typography sx={{ fontSize: 20, lineHeight: 1, mb: 2 }} variant='h6'>
                {el.title}
              </Typography>
              <Typography sx={{ fontSize: 14, mb: 4 }} className='text-grey'>
                {el.description}
              </Typography>
            </Box>
          ))}
          <Box
            display={'flex'}
            gap={1}
            position={'relative'}
            sx={{
              borderRadius: 1,
              borderColor: '#020E21',
              borderWidth: 1,
              borderStyle: 'solid',
              boxShadow: '0px 0.91px 1.82px 0px #2929291F',
            }}
          >
            <div className='ribbon-g ribbon-g-l'>
              <span>Before</span>
            </div>
            <div className='ribbon-g'>
              <span>After</span>
            </div>
            <Box className='flex-1'>
              <img src='/images/before-after/OEM-before.png' className='w-100' />
            </Box>
            <Box className='flex-1'>
              <img src='/images/before-after/OEM-after.png' className='w-100' />
            </Box>
          </Box>
          <Typography className='text-grey pt-2'>You can see that OEE and OEM glass is the same quality.</Typography>
        </Box>
      </CustomModal>
    </>
  )
}
