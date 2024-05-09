import React from 'react'
import { Box, CardMedia, Link, Typography } from '@mui/material'
import { trackPromise } from 'react-promise-tracker'
import { useNavigate, useParams } from 'react-router-dom'
import { LicensePlate } from '@glass/components/LicensePlate'
import { OurMethod } from '@glass/components/OurMethod'
import { BookingTimes } from '@glass/components/quotePage/BookingTimes'
import { OptionalOrderLines } from '@glass/components/quotePage/OptionalOrderLines'
import { OrderLines } from '@glass/components/quotePage/OrderLines'
import { BeforeAfterType, InquiryStep } from '@glass/enums'
import { Quote, RequestBooking } from '@glass/models'
import { addOptionalProductService } from '@glass/services/apis/add-optional-product.service'
import { removeOptionalProductService } from '@glass/services/apis/remove-optional-product.service'
import { sendBookingService } from '@glass/services/apis/send-booking.service'
import { formatAddress } from '@glass/utils/format-address/format-address.util'
import { workingPlaceLabel } from '@glass/utils/index'
import { Testimonials } from '../Home/Testimonials'

export type QuoteOptionsProps = {
  quoteDetails: Quote
  refetch: () => void
  onContinue: () => void
}

export const QuoteOptions: React.FC<QuoteOptionsProps> = ({ quoteDetails, refetch, onContinue }) => {
  const { id: quoteId } = useParams()
  const navigate = useNavigate()

  const backToEditQuote = (step: InquiryStep) => {
    const licenseReg = quoteDetails?.registration_number.replace(' ', '')
    navigate(`/customer/edit/${licenseReg}/${quoteId}/${step}`)
  }

  const handleCheckOptionalOrderLine = (orderLineId: number, optionalLineId: number, checked: boolean) => {
    if (!quoteId) return
    if (checked) {
      trackPromise(
        addOptionalProductService(quoteId, optionalLineId).then((res) => {
          if (res.success) {
            refetch()
          }
        }),
      )
    } else {
      trackPromise(
        removeOptionalProductService(quoteId, orderLineId, optionalLineId).then((res) => {
          if (res.success) {
            refetch()
          }
        }),
      )
    }
  }

  const handleCheckRequestBooking = (requestBooking: RequestBooking) => {
    if (!quoteId) return

    trackPromise(
      sendBookingService(quoteId, requestBooking.request_booking_date, requestBooking.request_time_slot).then(() => {
        refetch()
      }),
    )
  }

  return (
    <>
      <Box sx={{ paddingX: 4, marginBottom: 40 }}>
        <Box sx={{ padding: 3, marginBottom: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, fontSize: '14px', lineHeight: '150%' }}>
              <CardMedia
                component='img'
                sx={{ width: 20, height: 20 }}
                image={process.env.PUBLIC_URL + '/images/account-blue.svg'}
              />
              {quoteDetails.customer_f_name} {quoteDetails.customer_s_name}
            </Box>

            <Box>
              <Box sx={{ width: '94px' }}>
                <Box sx={{ zoom: 0.3 }}>
                  <LicensePlate disabled={true} licenseNumber={quoteDetails.registration_number} />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, marginTop: 4 }}>
                {!!quoteDetails.vehicle_logo_url && (
                  <CardMedia component='img' sx={{ width: 'auto', height: 20 }} image={quoteDetails.vehicle_logo_url} />
                )}
                <Typography
                  sx={{
                    color: 'var(--Gray-800, #14151F)',
                    fontSize: '14px',
                    fontWeight: '400',
                    lineHeight: '150%',
                  }}
                >
                  {quoteDetails?.make}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <OrderLines orderLines={quoteDetails.order_lines || []} />

        <Box sx={{ p: 4 }}></Box>

        <OptionalOrderLines
          optionalOrderLines={quoteDetails.optional_order_lines || []}
          onCheckOptionalOrderLine={handleCheckOptionalOrderLine}
        />

        <Typography sx={{ color: 'orange', p: 3 }}>TODO:F2W-45</Typography>

        <Box sx={{ p: 2 }}></Box>

        <Typography sx={{ color: 'orange', p: 3 }}>TODO:F2W-47</Typography>

        <Box sx={{ p: 4 }}></Box>

        <BookingTimes
          requestBookings={quoteDetails.request_booking || []}
          onCheckRequestBooking={handleCheckRequestBooking}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, fontSize: '14px', lineHeight: '150%' }}>
            <CardMedia
              component='img'
              sx={{ width: 20, height: 20 }}
              image={process.env.PUBLIC_URL + '/images/calendar.svg'}
            />
            {'Dates selected' || 'No date selected'}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, fontSize: '14px', lineHeight: '150%' }}>
            <CardMedia
              component='img'
              sx={{ width: 20, height: 20 }}
              image={process.env.PUBLIC_URL + '/images/wrench.svg'}
            />
            {workingPlaceLabel(quoteDetails.working_place)}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, fontSize: '14px', lineHeight: '150%' }}>
            <CardMedia
              component='img'
              sx={{ width: 20, height: 20 }}
              image={process.env.PUBLIC_URL + '/images/map-marker-blue.svg'}
            />
            <Typography>
              {formatAddress(quoteDetails.delivery_address)}
              <Link sx={{ fontWeight: '700', marginLeft: 1 }} onClick={() => backToEditQuote(InquiryStep.STEP1)}>
                Edit Location
              </Link>
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 8 }}></Box>

        <OurMethod beforeAfterType={BeforeAfterType.ALL} showVideos={false} />

        <Box sx={{ p: 8 }}></Box>

        <Testimonials />
      </Box>

      {quoteDetails.is_published && (
        <Box
          sx={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            width: '100vw',
            zIndex: '100',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            padding: 'var(--16, 16px) var(--16, 16px) 40px var(--16, 16px)',
            borderTop: '1px solid var(--Gray-100, #f2f2f3)',
            background: '#fff',
          }}
        >
          <button className='btn-raised w-100' type='button' onClick={() => onContinue()}>
            Proceed to checkout
          </button>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <CardMedia
              component='img'
              sx={{ height: 16, width: 24 }}
              image={process.env.PUBLIC_URL + '/images/master-card.svg'}
            />
            <CardMedia
              component='img'
              sx={{ height: 16, width: 24 }}
              image={process.env.PUBLIC_URL + '/images/visa.svg'}
            />
            <CardMedia
              component='img'
              sx={{ height: 16, width: 24 }}
              image={process.env.PUBLIC_URL + '/images/discover.svg'}
            />
            <CardMedia
              component='img'
              sx={{ height: 16, width: 24 }}
              image={process.env.PUBLIC_URL + '/images/amex.svg'}
            />
            <CardMedia
              component='img'
              sx={{ height: 16, width: 24 }}
              image={process.env.PUBLIC_URL + '/images/union-pay.svg'}
            />
            <CardMedia
              component='img'
              sx={{ height: 16, width: 24 }}
              image={process.env.PUBLIC_URL + '/images/jcb.svg'}
            />
          </Box>
        </Box>
      )}
    </>
  )
}
