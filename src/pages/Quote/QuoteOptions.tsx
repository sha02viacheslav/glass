import React, { useEffect } from 'react'
import { Box, CardMedia, Link, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { trackPromise } from 'react-promise-tracker'
import { useNavigate, useParams } from 'react-router-dom'
import { number, object } from 'yup'
import { DifferenceOEE_OEM } from '@glass/components/Help/DifferenceOEE_OEM'
import { LicensePlate } from '@glass/components/LicensePlate'
import { OurMethod } from '@glass/components/OurMethod'
import { PaymentCards } from '@glass/components/PaymentCards'
import { BookingTimes } from '@glass/components/quotePage/BookingTimes'
import { OptionalOrderLines } from '@glass/components/quotePage/OptionalOrderLines'
import { Packages } from '@glass/components/quotePage/Packages'
import { ReviewsDialog } from '@glass/components/ReviewsDialog'
import { BeforeAfterType, InquiryStep } from '@glass/enums'
import { Quote } from '@glass/models'
import { addOptionalProductService } from '@glass/services/apis/add-optional-product.service'
import { confirmRebookService } from '@glass/services/apis/confirm-rebook.service'
import { removeOptionalProductService } from '@glass/services/apis/remove-optional-product.service'
import { sendReserveBookingService } from '@glass/services/apis/send-reserve-booking.service'
import { updateQuotationPackageService } from '@glass/services/apis/update-quotation-package.service'
import { formatAddress } from '@glass/utils/format-address/format-address.util'
import { scrollToElementWithOffset, workingPlaceLabel } from '@glass/utils/index'
import { Testimonials } from '../Home/Testimonials'

export type QuoteOptionsForm = {
  quotationPackageId: number
  reserveBookingId: number
  systemSuggestion: boolean
}

export enum FormFieldIds {
  QUOTATION_PACKAGE_ID = 'quotationPackageId',
  RESERVE_BOOKING_ID = 'reserveBookingId',
  SYSTEM_SUGGESTION = 'systemSuggestion',
}

export type QuoteOptionsProps = {
  quoteDetails: Quote
  rebook?: boolean
  refetch: () => void
}

export const QuoteOptions: React.FC<QuoteOptionsProps> = ({ quoteDetails, rebook = false, refetch }) => {
  const { id: quoteId } = useParams()
  const navigate = useNavigate()

  const validationSchema = object({
    quotationPackageId: number().min(1, 'Please select the product').nullable(),
    reserveBookingId: number().min(1, 'Please select the date you would like to get repair done').nullable(),
  })

  const formik = useFormik({
    initialValues: {
      quotationPackageId: 0,
      reserveBookingId: 0,
      systemSuggestion: false,
    },
    validationSchema: validationSchema,
    onSubmit: async () => {},
  })

  const backToEditQuote = (step: InquiryStep) => {
    const licenseReg = quoteDetails?.registration_number.replace(' ', '')
    navigate(`/customer/edit/${licenseReg}/${quoteId}/${step}`)
  }

  const handleCheckPackage = (packageId: number) => {
    if (!quoteId) return
    trackPromise(
      updateQuotationPackageService(quoteId, packageId).then((res) => {
        if (res.success) {
          formik.setFieldValue(FormFieldIds.QUOTATION_PACKAGE_ID, packageId)
          refetch()
        }
      }),
    )
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

  const sendReserveBooking = (values: QuoteOptionsForm) => {
    if (!quoteId) return

    trackPromise(
      sendReserveBookingService(quoteId, values.reserveBookingId, values.systemSuggestion).then(() => {
        refetch()
      }),
    )
  }

  const confirmRebook = (values: QuoteOptionsForm) => {
    if (!quoteId) return

    trackPromise(
      confirmRebookService(quoteId, values.reserveBookingId, values.systemSuggestion).then(() => {
        refetch()
      }),
    )
  }

  const handleContinueClick = () => {
    formik.setFieldTouched(FormFieldIds.QUOTATION_PACKAGE_ID, true, true)
    if (formik.errors.quotationPackageId) {
      scrollToElementWithOffset(FormFieldIds.QUOTATION_PACKAGE_ID, 100)
      return
    }
    formik.setFieldTouched(FormFieldIds.RESERVE_BOOKING_ID, true, true)
    if (formik.errors.reserveBookingId) {
      scrollToElementWithOffset(FormFieldIds.RESERVE_BOOKING_ID, 100)
      return
    }

    if (rebook) {
      confirmRebook(formik.values)
    } else {
      sendReserveBooking(formik.values)
    }
  }

  const renderSelectedDate = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: { xs: 4, lg: 6 } }}>
        <Box sx={{ display: 'flex', gap: 2, fontSize: { xs: 14, lg: 16 }, lineHeight: '150%' }}>
          <CardMedia
            component='img'
            sx={{ width: { xs: 20, lg: 24 }, height: { xs: 20, lg: 24 } }}
            image={process.env.PUBLIC_URL + '/images/calendar.svg'}
          />
          {'Dates selected' || 'No date selected'}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, fontSize: { xs: 14, lg: 16 }, lineHeight: '150%' }}>
          <CardMedia
            component='img'
            sx={{ width: { xs: 20, lg: 24 }, height: { xs: 20, lg: 24 } }}
            image={process.env.PUBLIC_URL + '/images/wrench.svg'}
          />
          {workingPlaceLabel(quoteDetails.working_place)}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, fontSize: { xs: 14, lg: 16 }, lineHeight: '150%' }}>
          <CardMedia
            component='img'
            sx={{ width: { xs: 20, lg: 24 }, height: { xs: 20, lg: 24 } }}
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
    )
  }

  useEffect(() => {
    if (quoteDetails) {
      const selectedPackage = Object.values(quoteDetails.quotation_packages).find(
        (item) => item.quotation_package_details[0]?.order_line_added,
      )
      formik.setFieldValue(FormFieldIds.QUOTATION_PACKAGE_ID, selectedPackage?.quotation_package_id || 0)
    }
  }, [quoteDetails])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <form>
      <Box sx={{ marginBottom: 40 }} className='container'>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 8, lg: 24 } }}>
          <Box sx={{ flex: '1' }}>
            <Box sx={{ padding: { xs: 3, lg: 6 }, marginBottom: 6, background: '#fff' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', lg: 'column' },
                  justifyContent: 'space-between',
                  gap: { xs: 12, lg: 6 },
                }}
              >
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <CardMedia
                    component='img'
                    sx={{ width: 20, height: 20 }}
                    image={process.env.PUBLIC_URL + '/images/account-blue.svg'}
                  />
                  <Typography sx={{ fontSize: '14px', lineHeight: '150%', whiteSpace: 'nowrap' }}>
                    {quoteDetails.customer_f_name} {quoteDetails.customer_s_name}
                  </Typography>
                </Box>

                <Box>
                  <Box sx={{ width: '94px' }}>
                    <Box sx={{ zoom: { xs: 0.3, lg: 0.75 } }}>
                      <LicensePlate disabled={true} licenseNumber={quoteDetails.registration_number} />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, marginTop: 4 }}>
                    {!!quoteDetails.vehicle_logo_url && (
                      <CardMedia
                        component='img'
                        sx={{ width: 'auto', height: { xs: 20, lg: 45 } }}
                        image={quoteDetails.vehicle_logo_url}
                      />
                    )}
                    <Typography
                      sx={{
                        color: 'var(--Gray-800, #14151F)',
                        fontSize: { xs: 14, lg: 30 },
                        fontWeight: '400',
                        lineHeight: '150%',
                      }}
                    >
                      {quoteDetails?.make} {quoteDetails?.model}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'none', lg: 'block' }, borderTop: '1px solid var(--Gray-200, #EAEAEB)' }}>
              {renderSelectedDate()}
            </Box>
          </Box>

          <Box sx={{ flex: '1' }}>
            <Box id={FormFieldIds.QUOTATION_PACKAGE_ID}>
              <Packages
                disabled={rebook}
                packages={quoteDetails.quotation_packages || []}
                formError={formik.touched.quotationPackageId && formik.errors.quotationPackageId}
                onCheckPackage={handleCheckPackage}
              />
            </Box>

            <Box sx={{ pt: { xs: 8, lg: 16 } }}></Box>

            <OptionalOrderLines
              disabled={rebook}
              optionalOrderLines={quoteDetails.optional_order_lines || []}
              onCheckOptionalOrderLine={handleCheckOptionalOrderLine}
            />

            <DifferenceOEE_OEM />

            <Box sx={{ p: 2 }}></Box>

            <ReviewsDialog textColor='var(--Gray-800, #14151F)' />

            <Box sx={{ pt: { xs: 8, lg: 16 } }}></Box>

            <Box id={FormFieldIds.RESERVE_BOOKING_ID}>
              <BookingTimes
                reserveBookingId={formik.values.reserveBookingId}
                formError={formik.touched.reserveBookingId && formik.errors.reserveBookingId}
                onCheckReserveBooking={(value) => {
                  formik.setFieldValue(FormFieldIds.RESERVE_BOOKING_ID, value.reserve_booking_id)
                  formik.setFieldValue(FormFieldIds.SYSTEM_SUGGESTION, value.system_suggestion)
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: { lg: 'none' } }}>{renderSelectedDate()}</Box>

        <Box sx={{ p: 8 }}></Box>

        <OurMethod beforeAfterType={BeforeAfterType.ALL} showVideos={false} />

        <Box sx={{ p: 8 }}></Box>

        <Testimonials />
      </Box>

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
        {!rebook && (
          <>
            <Box sx={{ width: { xs: '100%', lg: 317 } }}>
              <button className='btn-raised w-100' type='button' onClick={() => handleContinueClick()}>
                Proceed to checkout
              </button>
            </Box>

            <Box sx={{ display: 'flex', gap: 3 }}>
              <PaymentCards />
            </Box>
          </>
        )}

        {rebook && (
          <>
            <Box sx={{ width: { xs: '100%', lg: 317 } }}>
              <button className='btn-raised w-100' type='button' onClick={() => handleContinueClick()}>
                Rebook
              </button>
            </Box>
          </>
        )}
      </Box>
    </form>
  )
}
