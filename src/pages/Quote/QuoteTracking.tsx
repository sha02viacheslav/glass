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
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { Link, useParams } from 'react-router-dom'
import { TrackTechnician } from '@glass/components/GoogleMap/TrackTechnician'
import { LicensePlate } from '@glass/components/LicensePlate'
import { WindowSelector } from '@glass/components/WindowSelector'
import { CarType, TrackingStep } from '@glass/enums'
import { useRetrieveVehData } from '@glass/hooks/useRetrieveVehData'
import { Quote } from '@glass/models'
import { formatAddress } from '@glass/utils/format-address/format-address.util'
import { getTrackTechnicianChecked, setTrackTechnicianChecked } from '@glass/utils/session/session.util'
import { DownloadInvoice } from './DownloadInvoice'

export type QuoteTrackingProps = {
  quoteDetails: Quote
}

export const QuoteTracking: React.FC<QuoteTrackingProps> = ({ quoteDetails }) => {
  const { id: quoteId } = useParams()

  const steps = {
    [TrackingStep.STEP1]: {
      index: 1,
      sequence: 1,
      title: 'Booking confirmed and paid',
      icon: 'calendar-check.svg',
      isSmall: false,
    },
    [TrackingStep.STEP2]: {
      index: 2,
      sequence: 2,
      title: 'Waiting for the day of the service',
      icon: 'check.svg',
      isSmall: true,
    },
    [TrackingStep.STEP3]: { index: 3, sequence: 3, title: 'Day before reminder', icon: 'check.svg', isSmall: true },
    [TrackingStep.STEP4]: { index: 4, sequence: 4, title: 'Repair day', icon: 'wrench-white.svg', isSmall: false },
    [TrackingStep.STEP5]: { index: 5, sequence: 5, title: 'Technician arrived', icon: 'check.svg', isSmall: true },
    [TrackingStep.STEP6]: {
      index: 6,
      sequence: 5,
      title: 'Technician took “before” photo',
      icon: 'check.svg',
      isSmall: true,
    },
    [TrackingStep.STEP7]: {
      index: 7,
      sequence: 6,
      title: 'Technician is repairing your car',
      icon: 'check.svg',
      isSmall: true,
    },
    [TrackingStep.STEP8]: {
      index: 8,
      sequence: 7,
      title: 'Technician takes “after” photo',
      icon: 'check.svg',
      isSmall: true,
    },
    [TrackingStep.STEP9]: {
      index: 9,
      sequence: 7,
      title: 'You can drive your car!',
      icon: 'wheel-fill.svg',
      isSmall: false,
    },
  }

  const [showTrackTechnicianNotification, setShowTrackTechnicianNotification] = useState(
    !getTrackTechnicianChecked(quoteId),
  )
  const [modalTrackMap, setModalTrackMap] = useState(false)
  const [selectedCarType, setSelectedCarType] = useState<CarType>(CarType.THREE_DOOR)

  const activeStep = useMemo<TrackingStep>(() => {
    const sequence = quoteDetails.tracking_delivery[0]?.state.find((item) => !item.date)?.sequence || 1
    return (
      (Object.keys(steps).find((key) => steps[key as TrackingStep].sequence === sequence) as TrackingStep) ||
      TrackingStep.STEP1
    )
  }, [quoteDetails])

  const beforeAttachments = useMemo(() => {
    return quoteDetails.tracking_delivery[0]?.state.find((item) => item.sequence === 5)?.attachment_ids || []
  }, [quoteDetails])

  const repairAttachments = useMemo(() => {
    return quoteDetails.tracking_delivery[0]?.state.find((item) => item.sequence === 6)?.attachment_ids || []
  }, [quoteDetails])

  const afterAttachments = useMemo(() => {
    return quoteDetails.tracking_delivery[0]?.state.find((item) => item.sequence === 7)?.attachment_ids || []
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
    const { active, completed, className } = props
    const { isSmall, icon } = steps[props.icon as TrackingStep]

    return (
      <ColorStepIconRoot ownerState={{ completed, active, isSmall }} className={className}>
        {isSmall && !completed ? '' : <img src={process.env.PUBLIC_URL + '/images/' + icon} />}
      </ColorStepIconRoot>
    )
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <form>
      <Box sx={{ marginBottom: 40 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px 8px',
            borderBottom: '1px solid var(--Gray-100, #F2F2F3)',
            background: '#fff',
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              lineHeight: '140%',
            }}
          >
            Hello {quoteDetails.customer_f_name}!
          </Typography>

          <Box sx={{ position: 'relative' }}>
            <button type='button' className='btn-transparent primary p-0' onClick={() => setModalTrackMap(true)}>
              <img src={process.env.PUBLIC_URL + '/images/map.svg'} />
              <span style={{ fontSize: '16px', color: '#4285F4' }}>Track the technician</span>
            </button>
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
        {modalTrackMap && <TrackTechnician onDismiss={() => setModalTrackMap(false)} />}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
          }}
        >
          <Typography
            sx={{
              color: 'var(--Gray-600, #6A6B71)',
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: '600',
              lineHeight: '140%',
            }}
          >
            Service timeline
          </Typography>
        </Box>

        <Box sx={{ px: 4, pt: 5, pb: 20 }}>
          <Stepper
            // alternativeLabel
            activeStep={steps[activeStep].index}
            orientation='vertical'
            sx={{
              '.MuiStepConnector-root:nth-child(14)': {
                '.MuiStepConnector-line': { height: '200px' },
              },
            }}
            connector={
              <StepConnector
                sx={{
                  marginLeft: '18px',
                  '.MuiStepConnector-line': { borderLeftWidth: '4px', height: '128px' },
                  '&.Mui-completed': { '.MuiStepConnector-line': { borderColor: '#133F85' } },
                }}
              />
            }
          >
            {Object.keys(steps).map((step) => {
              const stepProps: { completed?: boolean } = {}
              const active = step === activeStep
              const completed: boolean = step < activeStep

              return (
                <Step key={step} {...stepProps} active={active} completed={completed}>
                  <StepLabel StepIconComponent={ColorStepIcon} icon={step} sx={{ padding: '4px 0' }}>
                    <Box sx={{ position: 'relative' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: '12px' }}>
                        {((step as TrackingStep) === TrackingStep.STEP6 ||
                          (step as TrackingStep) === TrackingStep.STEP8) && (
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
                        <Typography sx={{ fontSize: 14, fontWeight: '600', lineHeight: '12px' }}>
                          {steps[step as TrackingStep].title}{' '}
                        </Typography>
                      </Box>
                      <Box sx={{ position: 'absolute', marginTop: 3 }}>
                        {(step as TrackingStep) === TrackingStep.STEP1 && (
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
                                    <LicensePlate disabled={true} licenseNumber={quoteDetails.registration_number} />
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </>
                        )}

                        {(step as TrackingStep) === TrackingStep.STEP2 && (
                          <Typography
                            sx={{
                              color: active || completed ? 'var(--Gray-800, #14151F)' : 'var(--Gray-600, #6A6B71)',
                              fontSize: 12,
                              lineHeight: '130%',
                            }}
                          >
                            You will be able to track your technician on live map
                          </Typography>
                        )}
                        {(step as TrackingStep) === TrackingStep.STEP3 && (
                          <Typography
                            sx={{
                              color: active || completed ? 'var(--Gray-800, #14151F)' : 'var(--Gray-600, #6A6B71)',
                              fontSize: 12,
                              lineHeight: '130%',
                            }}
                          >
                            You will receive a reminder that we are coming a day before service.
                          </Typography>
                        )}
                        {(step as TrackingStep) === TrackingStep.STEP4 && (
                          <Typography
                            sx={{
                              color: active || completed ? 'var(--Gray-800, #14151F)' : 'var(--Gray-600, #6A6B71)',
                              fontSize: 12,
                              lineHeight: '130%',
                            }}
                          >
                            Place your car on so there is nothing within 2m radius. Our technician needs space to work.
                          </Typography>
                        )}
                        {(step as TrackingStep) === TrackingStep.STEP5 && (
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
                                color: active || completed ? 'var(--Gray-800, #14151F)' : 'var(--Gray-600, #6A6B71)',
                                fontSize: 12,
                                lineHeight: '130%',
                              }}
                            >
                              {formatAddress(quoteDetails.delivery_address)}
                            </Typography>
                          </Box>
                        )}
                        {(step as TrackingStep) === TrackingStep.STEP6 && (
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
                                  color: active || completed ? 'var(--Gray-800, #14151F)' : 'var(--Gray-600, #6A6B71)',
                                  fontSize: 12,
                                  lineHeight: '130%',
                                }}
                              >
                                Technician will take images of your car before repair
                              </Typography>
                            )}
                          </>
                        )}
                        {(step as TrackingStep) === TrackingStep.STEP7 && (
                          <>
                            {completed ? (
                              <Box>
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
                              </Box>
                            ) : (
                              <Typography
                                sx={{
                                  color: active || completed ? 'var(--Gray-800, #14151F)' : 'var(--Gray-600, #6A6B71)',
                                  fontSize: 12,
                                  lineHeight: '130%',
                                }}
                              >
                                {active
                                  ? 'Removing the old glass and preparing surface for fitting new glass'
                                  : 'Technician will repair your broken glass.'}
                              </Typography>
                            )}
                          </>
                        )}
                        {(step as TrackingStep) === TrackingStep.STEP8 && (
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
                                  color: active || completed ? 'var(--Gray-800, #14151F)' : 'var(--Gray-600, #6A6B71)',
                                  fontSize: 12,
                                  lineHeight: '130%',
                                }}
                              >
                                Technician will take the images after he repairs your car.
                              </Typography>
                            )}
                          </>
                        )}
                        {(step as TrackingStep) === TrackingStep.STEP9 && (
                          <Typography
                            sx={{
                              color: active || completed ? 'var(--Gray-800, #14151F)' : 'var(--Gray-600, #6A6B71)',
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
    </form>
  )
}
