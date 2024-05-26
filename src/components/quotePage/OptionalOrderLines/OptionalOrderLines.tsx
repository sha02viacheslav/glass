import React from 'react'
import { Box, CardMedia, Grid, Radio, Typography } from '@mui/material'
import { OptionalOrderLine } from '@glass/models'

export type OptionalOrderLinesProps = {
  optionalOrderLines: OptionalOrderLine[]
  onCheckOptionalOrderLine: (orderLineId: number, optionalLineId: number, checked: boolean) => void
}

export const OptionalOrderLines: React.FC<OptionalOrderLinesProps> = ({
  optionalOrderLines,
  onCheckOptionalOrderLine,
}) => {
  return (
    <>
      <Typography
        sx={{
          fontSize: { xs: 16, lg: 20 },
          fontWeight: '600',
          lineHeight: '140%',
        }}
      >
        Would you like new wipers?{' '}
        <Typography component='span' sx={{ color: 'var(--Gray-600, #6A6B71)', fontWeight: '600', lineHeight: '140%' }}>
          (Optional)
        </Typography>
      </Typography>

      <Typography sx={{ color: 'var(--Gray-700, #474747)', fontSize: '12px', lineHeight: '140%', marginBottom: 4 }}>
        Old wipers can scratch your new windscreen.
      </Typography>
      <Grid container spacing={3}>
        {optionalOrderLines.map((element, index) => (
          <Grid key={index} item xs={6}>
            <Box
              sx={{
                padding: { xs: 4, lg: 8 },
                borderRadius: '4px',
                border: element.order_line_added ? '2px solid #225FC2' : '',
                background: '#FFF',
                boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
                cursor: 'pointer',
              }}
              onClick={() => {
                onCheckOptionalOrderLine(element.order_line_id, element.optional_line_id, !element.order_line_added)
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Radio checked={element.order_line_added} size='small' sx={{ padding: 0 }} />
                  <Typography
                    sx={{
                      fontSize: { xs: 14, lg: 20 },
                      fontWeight: '600',
                      lineHeight: '20px',
                      marginLeft: 2,
                    }}
                  >
                    {element.product}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CardMedia
                  component='img'
                  sx={{ width: 'auto', height: 96 }}
                  image={element.product_image_url}
                ></CardMedia>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, marginTop: 6 }}>
                <Typography
                  sx={{
                    color: 'var(--Red---Semantic-500, #C22222)',
                    fontSize: { xs: 14, lg: 16 },
                    lineHeight: '24px',
                    textDecoration: 'line-through',
                  }}
                >
                  £{element.price_unit.toFixed(2)}
                </Typography>
                {element.discount === 100 ? (
                  <Typography
                    sx={{
                      fontSize: { xs: 16, lg: 20 },
                      color: 'var(--Gray-700, #474747)',
                      fontWeight: '700',
                      lineHeight: '24px',
                    }}
                  >
                    Free Gift!
                  </Typography>
                ) : (
                  <Typography
                    sx={{
                      fontSize: { xs: 16, lg: 20 },
                      fontWeight: '700',
                      color: 'var(--Gray-700, #474747)',
                      lineHeight: '24px',
                    }}
                  >
                    £{((element.price_unit * (100 - element.discount)) / 100).toFixed(2)}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  )
}
