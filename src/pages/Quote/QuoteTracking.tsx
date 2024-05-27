import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  CardMedia,
  Step,
  StepConnector,
  StepIconProps,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import moment from 'moment'
import { Link, useParams } from 'react-router-dom'
import { TrackTechnician } from '@glass/components/GoogleMap/TrackTechnician'
import { LicensePlate } from '@glass/components/LicensePlate'
import { WindowSelector } from '@glass/components/WindowSelector'
import { CarType, FieldServiceSequence, TrackingStep } from '@glass/enums'
import { useRetrieveVehData } from '@glass/hooks/useRetrieveVehData'
import { Quote } from '@glass/models'
import { formatAddress } from '@glass/utils/format-address/format-address.util'
import { bookingEndTime, bookingStartTime } from '@glass/utils/index'
import { getTrackTechnicianChecked, setTrackTechnicianChecked } from '@glass/utils/session/session.util'
import { DownloadInvoice } from './DownloadInvoice'
import { ShareQuote } from './ShareQuote'

export type QuoteTrackingProps = {
  quoteDetails: Quote
}

export interface TrackingView {
  title: string
  icon: string
  isSmall: boolean
  isActive: boolean
  isCompleted: boolean
  date: string
}

export const QuoteTracking: React.FC<QuoteTrackingProps> = ({ quoteDetails }) => {
  const theme = useTheme()
  const isLg = useMediaQuery(theme.breakpoints.up('lg'))
  const { id: quoteId } = useParams()

  const [showTrackTechnicianNotification, setShowTrackTechnicianNotification] = useState(
    !getTrackTechnicianChecked(quoteId),
  )
  const [modalTrackMap, setModalTrackMap] = useState(false)
  const [selectedCarType, setSelectedCarType] = useState<CarType>(CarType.THREE_DOOR)

  const beforeAttachments = useMemo(() => {
    return (
      quoteDetails.tracking_delivery[0]?.state.find((item) => item.sequence === FieldServiceSequence.ARRIVED)
        ?.attachment_ids || []
    )
  }, [quoteDetails])

  const repairAttachments = useMemo(() => {
    return (
      quoteDetails.tracking_delivery[0]?.state.find((item) => item.sequence === FieldServiceSequence.MIDDLE_UPDATE)
        ?.attachment_ids || []
    )
  }, [quoteDetails])

  const afterAttachments = useMemo(() => {
    return (
      quoteDetails.tracking_delivery[0]?.state.find((item) => item.sequence === FieldServiceSequence.ALL_DONE)
        ?.attachment_ids || []
    )
  }, [quoteDetails])

  const steps = useMemo<{ [key: string]: TrackingView }>(() => {
    const bookingStart = bookingStartTime(quoteDetails.booking_date, quoteDetails.time_slot)
    const bookingEnd = bookingEndTime(quoteDetails.booking_date, quoteDetails.time_slot)
    const arrivedDate = quoteDetails?.tracking_delivery[0]?.state[FieldServiceSequence.ARRIVED - 1].date
    const arrived = !!arrivedDate
    const vehicleReady = !!quoteDetails?.tracking_delivery[0]?.state[FieldServiceSequence.VEHICLE_READY - 1].date
    const middleUpdate = !!quoteDetails?.tracking_delivery[0]?.state[FieldServiceSequence.MIDDLE_UPDATE - 1].date
    const allDoneDate = quoteDetails?.tracking_delivery[0]?.state[FieldServiceSequence.ALL_DONE - 1].date
    const allDone = !!allDoneDate

    return {
      [TrackingStep.BOOKING_CONFIRMED]: {
        title: 'Booking confirmed and paid',
        icon: 'calendar-check.svg',
        isSmall: false,
        isActive: false,
        isCompleted: true,
        date: moment(quoteDetails.date_order).format('MMM D'),
      },
      [TrackingStep.WAITING_SERVICE_DAY]: {
        title: 'Waiting for the day of the service',
        icon: 'check.svg',
        isSmall: true,
        isActive: false,
        isCompleted: moment().isAfter(moment(bookingStart).subtract(1, 'days')) || arrived,
        date: '',
      },
      [TrackingStep.DAY_BEFORE_REMINDER]: {
        title: 'Day before reminder',
        icon: 'check.svg',
        isSmall: true,
        isActive: moment().isAfter(moment(bookingStart).subtract(1, 'days')),
        isCompleted: moment().isAfter(moment(bookingStart)) || arrived,
        date: moment(bookingStart).subtract(1, 'days').format('MMM D'),
      },
      [TrackingStep.REPAIR_DAY]: {
        title: 'Repair day',
        icon: 'wrench-white.svg',
        isSmall: false,
        isActive: false,
        isCompleted: moment().isAfter(moment(bookingStart)) || arrived,
        date: moment(bookingStart).format('MMM D'),
      },
      [TrackingStep.ARRIVED]: {
        title: arrived ? 'Technician arrived' : 'Technician will come to you',
        icon: 'check.svg',
        isSmall: true,
        isActive: moment().isAfter(moment(bookingStart)),
        isCompleted: arrived,
        date: !arrived
          ? moment(arrivedDate).format('h:mm a')
          : 'Exp. arrival \n ' + moment(bookingStart).format('H') + ' - ' + moment(bookingEnd).format('H') + 'h',
      },
      [TrackingStep.BEFORE_PHOTO]: {
        title: 'Technician took “before” photo',
        icon: 'check.svg',
        isSmall: true,
        isActive: arrived,
        isCompleted: !!beforeAttachments.length,
        date: arrived && !beforeAttachments.length ? 'Now' : '',
      },
      [TrackingStep.REPAIRING]: {
        title: !!beforeAttachments.length ? 'Technician is repairing your car' : 'Technician do the repair',
        icon: 'check.svg',
        isSmall: true,
        isActive: !!beforeAttachments.length,
        isCompleted: middleUpdate && !!repairAttachments?.length,
        date: '',
      },
      [TrackingStep.AFTER_PHOTO]: {
        title: 'Technician takes “after” photo',
        icon: 'check.svg',
        isSmall: true,
        isActive: middleUpdate && !!repairAttachments?.length,
        isCompleted: !!afterAttachments.length,
        date: '',
      },
      [TrackingStep.ALL_DONE]: {
        title: 'You can drive your car!',
        icon: 'wheel-fill.svg',
        isSmall: false,
        isActive: vehicleReady && !!afterAttachments.length,
        isCompleted: allDone,
        date: allDone ? moment(allDoneDate).format('MMM D') : '',
      },
    }
  }, [quoteDetails])

  useRetrieveVehData(quoteDetails?.DoorPlanLiteral, (data: CarType) => {
    setSelectedCarType(data)
  })

  const ColorStepIconRoot = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean; isSmall?: boolean }
  }>(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 40,
    height: 40,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.isSmall && {
      width: 12,
      height: 12,
      margin: '0 14px',
    }),
    ...(ownerState.active && {
      background: 'var(--Dark-Blue---Accent-500, #4522C2)',
    }),
    ...(ownerState.completed && {
      background: 'var(--Light-Blue---Primary-600, #133F85)',
    }),
  }))

  const ColorStepIcon = (props: StepIconProps) => {
    const step = props.icon as TrackingStep
    const { active, completed, className } = props
    const { isSmall, icon, date } = steps[step]

    return (
      <ColorStepIconRoot ownerState={{ completed, active, isSmall }} className={className}>
        {!!date && (
          <Typography
            sx={{
              position: 'absolute',
              left: 0,
              color: 'var(--Gray-700, #474747)',
              fontSize: step === TrackingStep.ARRIVED ? 10 : 12,
              lineHeight: '140%',
              width: '60px',
            }}
          >
            {date}
          </Typography>
        )}

        {isSmall && !completed ? '' : <img src={process.env.PUBLIC_URL + '/images/' + icon} />}
      </ColorStepIconRoot>
    )
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <form>
      <Box sx={{ marginBottom: { xs: 40, lg: 0 }, mt: { lg: -15 } }}>
        <Box sx={{ display: { lg: 'flex' } }}>
          <Box sx={{ flex: 5 }}>
            <Box sx={{ borderBottom: '1px solid var(--Gray-100, #F2F2F3)', background: '#fff' }}>
              <Box
                className={isLg ? 'container-pl' : 'container'}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  pt: { xs: 3, lg: 6 },
                  pb: { xs: 2, lg: 6 },
                  pr: { xs: 4, lg: 6 },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 16, lg: 30 },
                    fontWeight: 700,
                    lineHeight: '140%',
                  }}
                >
                  Hello {quoteDetails.customer_f_name}!
                </Typography>

                <Box sx={{ position: 'relative' }}>
                  <Box sx={{ display: { lg: 'none' } }}>
                    <button
                      type='button'
                      className='btn-transparent primary p-0'
                      onClick={() => setModalTrackMap(true)}
                    >
                      <img src={process.env.PUBLIC_URL + '/images/map.svg'} />
                      <span style={{ fontSize: '16px', color: '#4285F4' }}>Track the technician</span>
                    </button>
                  </Box>
                  <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                    <ShareQuote url={`${process.env.PUBLIC_URL}/quote/${quoteId}`} />
                  </Box>
                  {quoteId && showTrackTechnicianNotification && (
                    <Box
                      sx={{
                        width: '133px',
                        px: 2,
                        py: 1,
                        position: 'absolute',
                        right: 0,
                        top: '32px',
                        borderRadius: '2px',
                        background: '#3B3B3B',
                        color: '#fff',
                        fontSize: 12,
                        lineHeight: '16px',
                      }}
                      onClick={() => {
                        setShowTrackTechnicianNotification(false)
                        setTrackTechnicianChecked(quoteId)
                      }}
                    >
                      Tap here to track our technician on the map.
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            {modalTrackMap && <TrackTechnician onDismiss={() => setModalTrackMap(false)} />}

            <Box
              className={isLg ? 'container-pl' : 'container'}
              sx={{ mb: 40, height: { lg: 'calc(100vh - 323px)' }, overflow: 'auto', pr: { xs: 4, lg: 6 } }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 3,
                }}
              >
                <Typography
                  sx={{
                    color: 'var(--Gray-600, #6A6B71)',
                    textAlign: 'center',
                    fontSize: { xs: 16, lg: 20 },
                    fontWeight: '600',
                    lineHeight: '140%',
                  }}
                >
                  Service timeline
                </Typography>
              </Box>

              <Box sx={{ pt: 5, pb: 20 }}>
                <Stepper
                  orientation='vertical'
                  sx={{
                    '.MuiStepLabel-iconContainer': {
                      position: 'relative',
                      paddingLeft: '48px',
                    },
                    '.MuiStepConnector-root:nth-child(14)': {
                      '.MuiStepConnector-line': { height: '200px' },
                    },
                  }}
                  connector={
                    <StepConnector
                      sx={{
                        marginLeft: '66px',
                        '.MuiStepConnector-line': { borderLeftWidth: '4px', height: '128px' },
                        '&.Mui-completed': { '.MuiStepConnector-line': { borderColor: '#133F85' } },
                        '&.Mui-active': { '.MuiStepConnector-line': { borderColor: '#133F85' } },
                      }}
                    />
                  }
                >
                  {Object.keys(steps).map((step) => {
                    const stepProps: { completed?: boolean } = {}
                    const active = steps[step].isActive
                    const completed: boolean = steps[step].isCompleted

                    return (
                      <Step key={step} {...stepProps} active={active} completed={completed}>
                        <StepLabel StepIconComponent={ColorStepIcon} icon={step} sx={{ padding: '4px 0' }}>
                          <Box sx={{ position: 'relative' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: '12px' }}>
                              {((step as TrackingStep) === TrackingStep.BEFORE_PHOTO ||
                                (step as TrackingStep) === TrackingStep.AFTER_PHOTO) && (
                                <CardMedia
                                  component='img'
                                  sx={{ width: 20, height: 20 }}
                                  image={
                                    process.env.PUBLIC_URL +
                                    '/images/' +
                                    (active || completed ? 'camera.svg' : 'map-marker.svg')
                                  }
                                />
                              )}
                              <Typography
                                sx={{
                                  color: completed
                                    ? 'var(--Gray-800, #14151F)'
                                    : active
                                    ? 'var(--Dark-Blue---Accent-500, #4522C2)'
                                    : 'var(--Gray-600, #6A6B71)',
                                  fontSize: 14,
                                  fontWeight: '600',
                                  lineHeight: '12px',
                                }}
                              >
                                {steps[step as TrackingStep].title}{' '}
                              </Typography>
                            </Box>
                            <Box sx={{ position: 'absolute', marginTop: 3 }}>
                              {(step as TrackingStep) === TrackingStep.BOOKING_CONFIRMED && (
                                <>
                                  {!!quoteId && (
                                    <Box sx={{ marginTop: -2 }}>
                                      <DownloadInvoice quoteId={quoteId} />
                                    </Box>
                                  )}
                                  <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                                    <Box sx={{ height: 75, overflow: 'hidden' }}>
                                      <WindowSelector
                                        disabled={true}
                                        carType={selectedCarType}
                                        registrationNumber={quoteDetails.registration_number}
                                        selectedGlasses={quoteDetails.glass_location}
                                        id='map_win_quote_tracking'
                                      />
                                    </Box>

                                    <Box>
                                      <Box sx={{ display: 'flex', gap: 2 }}>
                                        {!!quoteDetails.vehicle_logo_url && (
                                          <CardMedia
                                            component='img'
                                            sx={{ width: 'auto', height: 20 }}
                                            image={quoteDetails.vehicle_logo_url}
                                          />
                                        )}
                                        <Typography
                                          sx={{
                                            color: 'var(--Gray-800, #14151F)',
                                            fontSize: '14px',
                                            fontWeight: '400',
                                            lineHeight: '150%',
                                          }}
                                        >
                                          {quoteDetails?.make} {quoteDetails?.model}
                                        </Typography>
                                      </Box>
                                      <Box sx={{ width: '94px', marginTop: 2 }}>
                                        <Box sx={{ zoom: 0.3 }}>
                                          <LicensePlate
                                            disabled={true}
                                            licenseNumber={quoteDetails.registration_number}
                                          />
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                </>
                              )}

                              {(step as TrackingStep) === TrackingStep.WAITING_SERVICE_DAY && (
                                <Typography
                                  sx={{
                                    color:
                                      active || completed ? 'var(--Gray-800, #14151F)' : 'var(--Gray-600, #6A6B71)',
                                    fontSize: 12,
                                    lineHeight: '130%',
                                  }}
                                >
                                  You will be able to track your technician on live map
                                </Typography>
                              )}
                              {(step as TrackingStep) === TrackingStep.DAY_BEFORE_REMINDER && (
                                <Typography
                                  sx={{
                                    color:
                                      active || completed ? 'var(--Gray-800, #14151F)' : 'var(--Gray-600, #6A6B71)',
                                    fontSize: 12,
                                    lineHeight: '130%',
                                  }}
                                >
                                  You will receive a reminder that we are coming a day before service.
                                </Typography>
                              )}
                              {(step as TrackingStep) === TrackingStep.REPAIR_DAY && (
                                <Typography
                                  sx={{
                                    color:
                                      active || completed ? 'var(--Gray-800, #14151F)' : 'var(--Gray-600, #6A6B71)',
                                    fontSize: 12,
                                    lineHeight: '130%',
                                  }}
                                >
                                  Place your car on so there is nothing within 2m radius. Our technician needs space to
                                  work.
                                </Typography>
                              )}
                              {(step as TrackingStep) === TrackingStep.ARRIVED && (
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                  <CardMedia
                                    component='img'
                                    sx={{ width: 20, height: 20 }}
                                    image={
                                      process.env.PUBLIC_URL +
                                      '/images/' +
                                      (active || completed ? 'map-marker-blue.svg' : 'map-marker.svg')
                                    }
                                  />
                                  <Typography
                                    sx={{
                                      color:
                                        active || completed ? 'var(--Gray-800, #14151F)' : 'var(--Gray-600, #6A6B71)',
                                      fontSize: 12,
                                      lineHeight: '130%',
                                    }}
                                  >
                                    {formatAddress(quoteDetails.delivery_address)}
                                  </Typography>
                                </Box>
                              )}
                              {(step as TrackingStep) === TrackingStep.BEFORE_PHOTO && (
                                <>
                                  {active || completed ? (
                                    <>
                                      {beforeAttachments.map((item, index) => (
                                        <CardMedia
                                          key={index}
                                          component='img'
                                          sx={{
                                            width: 'auto',
                                            height: 80,
                                            objectFit: 'cover',
                                            borderRadius: '2px',
                                          }}
                                          image={item.attachment_url}
                                          alt='Broken Image'
                                        />
                                      ))}
                                    </>
                                  ) : (
                                    <Typography
                                      sx={{
                                        color:
                                          active || completed ? 'var(--Gray-800, #14151F)' : 'var(--Gray-600, #6A6B71)',
                                        fontSize: 12,
                                        lineHeight: '130%',
                                      }}
                                    >
                                      Technician will take images of your car before repair
                                    </Typography>
                                  )}
                                </>
                              )}
                              {(step as TrackingStep) === TrackingStep.REPAIRING && (
                                <>
                                  {(completed || !!repairAttachments?.length) && (
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                      <CardMedia
                                        component='img'
                                        sx={{ width: 16, height: 16 }}
                                        image={process.env.PUBLIC_URL + '/images/check-gray.svg'}
                                      />
                                      <Box>
                                        <Typography
                                          sx={{
                                            color: 'var(--Gray-600, #6A6B71)',
                                            fontSize: 12,
                                            lineHeight: '130%',
                                            letterSpacing: '-0.12px',
                                          }}
                                        >
                                          Old glass and glue removed, surface prepared for new glass
                                        </Typography>
                                        {repairAttachments.map((item, index) => (
                                          <CardMedia
                                            key={index}
                                            component='img'
                                            sx={{
                                              width: 'auto',
                                              height: 80,
                                              objectFit: 'cover',
                                              borderRadius: '2px',
                                              marginTop: 2,
                                            }}
                                            image={item.attachment_url}
                                          />
                                        ))}
                                      </Box>
                                    </Box>
                                  )}
                                  {completed && (
                                    <Box sx={{ display: 'flex', gap: 1, mt: 4 }}>
                                      <CardMedia
                                        component='img'
                                        sx={{ width: 16, height: 16 }}
                                        image={process.env.PUBLIC_URL + '/images/check-gray.svg'}
                                      />
                                      <Typography
                                        sx={{
                                          color: 'var(--Gray-600, #6A6B71)',
                                          fontSize: 12,
                                          lineHeight: '130%',
                                          letterSpacing: '-0.12px',
                                        }}
                                      >
                                        New glass is fitted
                                      </Typography>
                                    </Box>
                                  )}
                                  {!completed && !!repairAttachments?.length && (
                                    <Box sx={{ display: 'flex', gap: 1, mt: 4 }}>
                                      <CardMedia
                                        component='img'
                                        sx={{ width: 16, height: 16 }}
                                        image={process.env.PUBLIC_URL + '/images/live-signifier.svg'}
                                      />
                                      <Typography
                                        sx={{
                                          color: 'var(--Gray-600, #6A6B71)',
                                          fontSize: 12,
                                          lineHeight: '130%',
                                          letterSpacing: '-0.12px',
                                        }}
                                      >
                                        Placing new glass
                                      </Typography>
                                    </Box>
                                  )}
                                  {!completed && !repairAttachments?.length && (
                                    <Box sx={{ display: 'flex', gap: 1, mt: 4 }}>
                                      <CardMedia
                                        component='img'
                                        sx={{ width: 16, height: 16 }}
                                        image={process.env.PUBLIC_URL + '/images/live-signifier.svg'}
                                      />
                                      <Typography
                                        sx={{
                                          color: 'var(--Gray-600, #6A6B71)',
                                          fontSize: 12,
                                          lineHeight: '130%',
                                          letterSpacing: '-0.12px',
                                        }}
                                      >
                                        Removing the old glass and preparing surface for fitting new glass
                                      </Typography>
                                    </Box>
                                  )}
                                  {!completed && !active && (
                                    <Typography
                                      sx={{
                                        color:
                                          active || completed ? 'var(--Gray-800, #14151F)' : 'var(--Gray-600, #6A6B71)',
                                        fontSize: 12,
                                        lineHeight: '130%',
                                      }}
                                    >
                                      Technician will repair your broken glass.
                                    </Typography>
                                  )}
                                </>
                              )}
                              {(step as TrackingStep) === TrackingStep.AFTER_PHOTO && (
                                <>
                                  {active || completed ? (
                                    <>
                                      {afterAttachments.map((item, index) => (
                                        <CardMedia
                                          key={index}
                                          component='img'
                                          sx={{
                                            width: 'auto',
                                            height: 80,
                                            objectFit: 'cover',
                                            borderRadius: '2px',
                                          }}
                                          image={item.attachment_url}
                                          alt='Broken Image'
                                        />
                                      ))}
                                    </>
                                  ) : (
                                    <Typography
                                      sx={{
                                        color:
                                          active || completed ? 'var(--Gray-800, #14151F)' : 'var(--Gray-600, #6A6B71)',
                                        fontSize: 12,
                                        lineHeight: '130%',
                                      }}
                                    >
                                      Technician will take the images after he repairs your car.
                                    </Typography>
                                  )}
                                </>
                              )}
                              {(step as TrackingStep) === TrackingStep.ALL_DONE && (
                                <Typography
                                  sx={{
                                    color:
                                      active || completed ? 'var(--Gray-800, #14151F)' : 'var(--Gray-600, #6A6B71)',
                                    fontSize: 12,
                                    lineHeight: '130%',
                                  }}
                                >
                                  {active || completed
                                    ? 'Everything is ready to drive! Enjoy it.'
                                    : '60 min after the repair is complete. You can drive your car.'}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </StepLabel>
                      </Step>
                    )
                  })}
                </Stepper>
              </Box>
            </Box>

            <Box
              sx={{
                position: 'fixed',
                bottom: '0',
                left: '0',
                width: { xs: '100vw', lg: '41.66vw' },
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
              <Link to={'/quote-details/' + quoteId}>
                <Button
                  sx={{
                    width: '100%',
                    paddingX: 6,
                    paddingY: 3,
                    fontSize: '18px',
                    fontWeight: '700',
                    lineHeight: '24px',
                    letterSpacing: '0.18px',
                    color: 'var(--Light-Blue---Primary-500, #225FC2)',
                    background: 'var(--Light-Blue---Primary-000, #E8F0FE)',
                    boxShadow:
                      '0px 3px 8px 0px rgba(88, 86, 94, 0.08), 0px 2px 4px 0px rgba(88, 86, 94, 0.10), 0px 1px 2px 0px rgba(88, 86, 94, 0.12)',
                    marginTop: 8,
                  }}
                >
                  See all the service details
                  <CardMedia
                    component='img'
                    sx={{ width: 24, height: 24, marginLeft: 2 }}
                    image={process.env.PUBLIC_URL + '/images/arrow-right-light-blue.svg'}
                    alt='Minus'
                  />
                </Button>
              </Link>
            </Box>
          </Box>

          <Box sx={{ flex: 7, display: { xs: 'none', lg: 'block' } }}>
            <TrackTechnician showOnModal={false} onDismiss={() => setModalTrackMap(false)} />
          </Box>
        </Box>
      </Box>
    </form>
  )
}
