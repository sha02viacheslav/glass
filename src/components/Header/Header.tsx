import './Header.css'
import React, { useEffect, useRef, useState } from 'react'
import { Box, CardMedia, Grid, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { CustomLink } from '@glass/components/Header/CustomLink'
import { OrderState } from '@glass/enums'
import { Quote } from '@glass/models'
import { getQuoteService } from '@glass/services/apis/get-quote.service'
import { getNotificationChecked, getQuoteId, setNotificationChecked } from '@glass/utils/session/session.util'
import { DesktopLink } from './DesktopLink'

export type HeaderProps = {
  showMenu: boolean
}

export const Header: React.FC<HeaderProps> = ({ showMenu }) => {
  const theme = useTheme()
  const isDownLg = useMediaQuery(theme.breakpoints.down('lg'))
  const isLg = useMediaQuery(theme.breakpoints.up('md'))
  const navigate = useNavigate()
  const quoteId = getQuoteId()
  const [quoteDetails, setQuoteDetails] = useState<Quote | undefined>(undefined)
  const [showNotification, setShowNotification] = useState<boolean>(!getNotificationChecked())
  const [opened, setOpened] = useState<boolean>(false)
  const menuToggleRef = useRef<HTMLDivElement>(null)

  const directToCustomer = () => {
    navigate('/inquiry-intro')
  }

  const checkNotification = () => {
    setNotificationChecked()
    setShowNotification(false)
  }

  const handleToggleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    checkNotification()
    event.currentTarget.classList.toggle('toggle-active')
    setOpened((prev) => !prev)
  }

  const goToQuote = () => {
    navigate('/quote/' + quoteId)
  }

  const getQuote = () => {
    if (quoteId) {
      getQuoteService(quoteId, false).then((res) => {
        if (res.success) {
          setQuoteDetails(res.data)
        }
      })
    }
  }

  useEffect(() => {
    if (quoteId) {
      getQuote()
    }
  }, [quoteId])

  return (
    <Box
      sx={{
        position: 'fixed',
        top: showMenu ? { xs: '16px', lg: '32px' } : '0',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '1001',
      }}
      className={'container'}
    >
      {showMenu && <div className='top-bar'>From £83 monthly</div>}

      <nav id='navbar_top' className={'navbar navbar-expand-lg navbar-light' + (opened ? ' opened' : '')}>
        {isDownLg && (
          <>
            <div className='mobile-nav w-100'>
              <div className='d-flex align-items-center justify-content-between'>
                <Link to='/' onClick={() => opened && menuToggleRef.current?.click()}>
                  <img src={process.env.PUBLIC_URL + '/img/logo.png'} className='logo-img img-fluid d-block' alt='' />
                </Link>
                {showMenu ? (
                  <div className='text-end d-flex align-items-center gap-4'>
                    <button className={!!quoteDetails ? 'btn-link' : 'btn-raised small'} onClick={directToCustomer}>
                      {!!quoteDetails ? 'New quote' : 'Get a quote'}
                    </button>
                    <div
                      ref={menuToggleRef}
                      className='menu-icon'
                      onClick={handleToggleClick}
                      data-bs-toggle='collapse'
                      data-bs-target='#navbarSupportedContent'
                      aria-controls='navbarSupportedContent'
                      aria-expanded='false'
                      aria-label='Toggle navigation'
                    ></div>
                  </div>
                ) : (
                  <>
                    {!!quoteDetails && quoteDetails?.order_state === OrderState.NEW && (
                      <Typography
                        sx={{
                          color: 'var(--Gray-600, #6A6B71)',
                          fontWeight: '700',
                          lineHeight: '140%',
                        }}
                      >
                        Waiting for quote
                      </Typography>
                    )}
                  </>
                )}
              </div>
            </div>

            {showMenu && !!quoteDetails?.is_published && (
              <img
                src={process.env.PUBLIC_URL + '/images/ellipse.svg'}
                className='notification-icon img-fluid'
                alt=''
              />
            )}

            {showMenu && !!quoteDetails?.is_published && showNotification && (
              <div className='notification-bar' onClick={() => checkNotification()}>
                <div className='notification-title'>Track your service</div>
                <div className='notification-content'>You can access your service timeline in our website menu.</div>
              </div>
            )}

            {showMenu && (
              <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                <ul className='navbar-nav et-nav'>
                  <CustomLink to='/services' onClick={() => opened && menuToggleRef.current?.click()}>
                    Services
                  </CustomLink>
                  <CustomLink to='/about-us' onClick={() => opened && menuToggleRef.current?.click()}>
                    About us
                  </CustomLink>
                  <CustomLink to='/process' onClick={() => opened && menuToggleRef.current?.click()}>
                    How our repair process works?
                  </CustomLink>
                  <CustomLink to='/installments' onClick={() => opened && menuToggleRef.current?.click()}>
                    Loosing money with insurance, saving with installments. How?
                  </CustomLink>
                  <CustomLink to='/comparison' onClick={() => opened && menuToggleRef.current?.click()}>
                    FixGlass vs. others comparison
                  </CustomLink>
                  <CustomLink to='/contact' onClick={() => opened && menuToggleRef.current?.click()}>
                    Contact us
                  </CustomLink>
                </ul>
                {!!quoteDetails && (
                  <div className='service-status-bar d-lg-none'>
                    <div className='d-flex justify-content-between w-100'>
                      <div className='service-status-title'>Your service status</div>
                      <img
                        src={process.env.PUBLIC_URL + '/images/chevron-right.svg'}
                        className='img-fluid cursor-pointer'
                        alt=''
                        onClick={goToQuote}
                      />
                    </div>
                    <div className='service-status-chip'>Waiting for the technician</div>
                  </div>
                )}
                <div className='bottom-bar d-lg-none'>
                  <button onClick={directToCustomer}>FACT ABOUT OUR PROCESS</button>
                  <div className='fw-b mt-3'>Fact 1: Crash Tested Glue 60min</div>
                  <div className='mt-1'>
                    We use SikaTack DRIVE glue that allows you to drive your car after only 60 minutes.
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {isLg && (
          <>
            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' },
                justifyContent: 'space-between',
                width: '100%',
                p: 6,
              }}
            >
              <Link
                className='navbar-brand d-none d-lg-flex'
                to='/'
                onClick={() => opened && menuToggleRef.current?.click()}
              >
                <CardMedia
                  component='img'
                  sx={{ width: 'auto', height: 32 }}
                  image={process.env.PUBLIC_URL + '/img/logo.png'}
                />
              </Link>

              <ul className='navbar-nav et-nav'>
                <div
                  ref={menuToggleRef}
                  onClick={handleToggleClick}
                  data-bs-toggle='collapse'
                  data-bs-target='#navbarSupportedContent'
                  aria-controls='navbarSupportedContent'
                  aria-expanded='false'
                  aria-label='Toggle navigation'
                >
                  <CustomLink hasDropdown={true}>Repair & Savings Hub</CustomLink>
                </div>
                <CustomLink to='/services' onClick={() => opened && menuToggleRef.current?.click()}>
                  Services
                </CustomLink>
                <CustomLink to='/about-us' onClick={() => opened && menuToggleRef.current?.click()}>
                  About us
                </CustomLink>
                <CustomLink to='/contact' onClick={() => opened && menuToggleRef.current?.click()}>
                  Contact us
                </CustomLink>
              </ul>

              <button className='btn-raised' onClick={directToCustomer}>
                Get a Quote
              </button>
            </Box>

            <div className='collapse navbar-collapse' id='navbarSupportedContent'>
              <Box
                sx={{
                  pt: 12,
                  px: 12,
                  pb: 8,
                  boxShadow: '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30)',
                  borderRadius: '12px',
                  mt: 1,
                }}
              >
                <Typography sx={{ color: 'var(--Gray-600, #6A6B71)', fontSize: 20, lineHeight: '24px' }}>
                  Repair & Savings Hub
                </Typography>
                <Grid container spacing={4} sx={{ mt: 8 }}>
                  <Grid item xs={4}>
                    <DesktopLink
                      title='FixGlass vs Cheap Providers'
                      description='How our service stands out from other cheap alternatives.'
                      to='/comparison'
                      onClick={() => opened && menuToggleRef.current?.click()}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <DesktopLink
                      title='Learn About How We Work!'
                      description='Dive deep into our process and find out how we work.'
                      to='/process'
                      onClick={() => opened && menuToggleRef.current?.click()}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <DesktopLink
                      title='Saving money with installments'
                      description='How our service stands out from other cheap alternatives.'
                      to='/installments'
                      onClick={() => opened && menuToggleRef.current?.click()}
                    />
                  </Grid>
                </Grid>
              </Box>
            </div>
          </>
        )}
      </nav>
    </Box>
  )
}
