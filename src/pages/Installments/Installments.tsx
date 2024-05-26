import React from 'react'
import { Box, CardMedia, Typography, useMediaQuery, useTheme } from '@mui/material'
import { scrollToElementWithOffset } from '@glass/utils/index'
import { InstallmentArticle } from './InstallmentArticle'

export const Installments: React.FC = () => {
  const theme = useTheme()
  const isLg = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <Box className='installments-page container'>
      <Box sx={{ py: { xs: 20, lg: 32 } }}></Box>

      <div className='page-header'>
        <Typography
          sx={{
            color: 'var(--Light-Blue---Primary-600, #133f85)',
            fontSize: { xs: 12, lg: 16 },
            lineHeight: '130%',
            letterSpacing: '0.84px',
            textTransform: 'uppercase',
          }}
        >
          Benefits of installments
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 24, lg: 72 },
            fontWeight: 700,
            lineHeight: { xs: '130%', lg: '110%' },
            marginTop: { xs: 4, lg: 8 },
            maxWidth: 1025,
          }}
        >
          Losing money with insurance claim, but saving money with installments. How?
        </Typography>
        <Box
          sx={{
            display: 'inline-flex',
            padding: 'var(--4, 4px) var(--8, 8px)',
            alignItems: 'center',
            gap: 'var(--12, 12px)',
            borderRadius: '2px',
            backgroundColor: '#fff',
            color: 'var(--Gray-600, #6a6b71)',
            fontSize: { xs: 16, lg: 30 },
            fontWeight: 400,
            lineHeight: { xs: '170%', lg: '32px' },
            marginTop: '12px',
          }}
          className='clock'
        >
          <CardMedia
            component='img'
            sx={{ width: 'auto', height: { xs: 20, lg: 32 } }}
            image={process.env.PUBLIC_URL + '/images/clock.svg'}
          />
          <span>5 min read</span>
        </Box>
      </div>

      <Box sx={{ py: { xs: 2, lg: 8 } }}></Box>

      <Box sx={{ maxWidth: 780 }}>
        <Typography
          sx={{
            padding: 'var(--16, 16px) var(--24, 24px)',
            borderRadius: '0px 2px 2px 0px',
            borderLeft: '3px solid var(--Light-Blue---Primary-500, #225fc2)',
            backgroundColor: '#fff',
            boxShadow:
              '0px 4px 17px 0px rgba(147, 147, 147, 0.04), 0px 2px 12px 0px rgba(147, 147, 147, 0.07), 0px 1px 7px 0px rgba(147, 147, 147, 0.09)',
            color: 'var(--Gray-800, #14151f)',
            fontSize: { xs: 16, lg: 20 },
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '180%',
            letterSpacing: '-0.16px',
          }}
        >
          <strong>Summary:</strong> Opting for installments over insurance claims brings long-term financial benefits.
          It boosts your credit score, leading to better loan terms, while also avoiding potential premium hikes over
          time. This enhances financial stability and savings.
        </Typography>

        <Box sx={{ py: { xs: 4, lg: 6 } }}></Box>

        <CardMedia
          component='img'
          sx={{ width: '100%', height: 'auto' }}
          image={process.env.PUBLIC_URL + '/images/clock-bg.png'}
        />

        <Box sx={{ py: 6 }}></Box>

        <Box
          sx={{
            display: 'flex',
            pt: { xs: 4, lg: 8 },
            px: { xs: 4, lg: 12 },
            pb: { xs: 4, lg: 12 },
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 6,
            backgroundColor: 'var(--Light-Blue---Primary-000, #e8f0fe)',
          }}
        >
          <Typography
            sx={{
              color: 'var(--Gray-700, #474747)',
              fontSize: '18px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '140%',
            }}
          >
            In this article
          </Typography>
          <Box>
            <Typography
              sx={{
                color: 'var(--Light-Blue---Primary-500, #225fc2)',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '140%',
                cursor: 'pointer',
              }}
              onClick={() => scrollToElementWithOffset('article-1', isLg ? 272 : 148)}
            >
              Long-Term Cost Savings with Installments
            </Typography>
            <Typography
              sx={{
                color: 'var(--Light-Blue---Primary-500, #225fc2)',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '140%',
                cursor: 'pointer',
                mt: 4,
              }}
              onClick={() => scrollToElementWithOffset('article-2', isLg ? 272 : 148)}
            >
              Building Financial Stability with Installments
            </Typography>
          </Box>
        </Box>

        <Box sx={{ py: { xs: 6, lg: 8 } }}></Box>

        <InstallmentArticle
          index={1}
          title='Long-Term Cost Savings with Installments'
          contents={[
            <>
              <strong>Insurance Premiums Increase Over Time:</strong> Despite assurances from insurance companies that
              claims won&apos;t affect your premiums, many customers find the opposite to be true. Yearly premium hikes,
              even without claims, are common.
            </>,
            <>
              <strong>Insurance is a Business:</strong> Insurance companies aim to make profits. When you make a claim,
              you become more costly for them, potentially leading to higher premiums down the line.
            </>,
            <>
              <strong>Uncertainty in Pricing:</strong> Insurance premiums can rise unpredictably. Factors like inflation
              play a role, but the exact calculations remain opaque.
            </>,
          ]}
        />

        <Box sx={{ py: { xs: 5, lg: 8 } }}></Box>

        <InstallmentArticle
          index={2}
          title='Building Financial Stability with Installments'
          contents={[
            <>
              <strong>Positive Impact on Credit Score:</strong> Setting up an installment plan benefits your credit
              score. This information is shared with major credit agencies like Experian, Equifax, and TransUnion.
            </>,
            <>
              <strong>Responsible Lending:</strong> By borrowing and repaying as agreed, you demonstrate financial
              responsibility, boosting your credit score.
            </>,
            <>
              <strong>Long-Term Financial Benefits:</strong> A higher credit score opens doors to better mortgage deals
              and lower interest rates on loans like car financing. Ultimately, this saves you money by reducing
              interest payments.
            </>,
            <>
              <strong>Building Credit History:</strong> Your credit score reflects your financial history, which takes
              time to build. Paying for our service in full won&apos;t enhance your credit score.
            </>,
            <>
              Navigating Modern Life: Mortgages, loans, and financing are essential aspects of modern living. A good
              credit score makes these transactions smoother and more affordable.
            </>,
          ]}
        />

        <Box sx={{ py: { xs: 5, lg: 8 } }}></Box>

        <InstallmentArticle
          index={3}
          title='Final thoughts'
          contents={[
            <>
              Opting for installments over insurance claims is a savvy move. It prevents premium hikes and promotes
              stability. With an improved credit score, you access better loan terms and lower interest rates, securing
              your financial future. Make the smart choice today for better financial stability.
            </>,
          ]}
        />
      </Box>

      <Box sx={{ py: { xs: 16, lg: 25 } }}></Box>
    </Box>
  )
}
