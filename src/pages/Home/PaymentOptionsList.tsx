import React from 'react'
import { Box, CardMedia, List, ListItem, Typography } from '@mui/material'
import { PaymentCards } from '@glass/components/PaymentCards'

export type PaymentOptionsListProps = {
  title: string
  icon: string
  descriptions: string[]
  showPaymentCards?: boolean
}

export const PaymentOptionsList: React.FC<PaymentOptionsListProps> = ({
  title,
  icon,
  descriptions,
  showPaymentCards = false,
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'flex-start', lg: 'center' },
          gap: '16px',
          mb: { xs: 1, lg: 4 },
        }}
      >
        <CardMedia
          component='img'
          sx={{ width: { xs: 24, lg: 32 }, height: 'auto' }}
          image={process.env.PUBLIC_URL + '/images/' + icon}
        />
        <Typography
          sx={{
            color: 'var(--Gray-000, #f7f7f8)',
            fontSize: { xs: 16, lg: showPaymentCards ? 24 : 30 },
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: { xs: '130%', lg: '108%' },
          }}
        >
          {title}
        </Typography>
      </Box>
      <List
        sx={{
          color: 'var(--Gray-200, #eaeaeb)',
          fontSize: { xs: 16, lg: 20 },
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '130%',
          listStyleType: 'disc',
          py: 0,
          paddingLeft: { xs: '64px', lg: 18 },
          margin: 0,
        }}
      >
        {descriptions.map((item, index) => (
          <ListItem key={index} sx={{ py: { xs: 1, lg: 2 } }}>
            {item}
          </ListItem>
        ))}
      </List>
      {showPaymentCards && (
        <Box sx={{ pl: 10, display: 'flex', justifyContent: { xs: 'flex-start', lg: 'center' }, gap: 4 }}>
          <PaymentCards />
        </Box>
      )}
    </Box>
  )
}
