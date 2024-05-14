import './Header.css'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Typography } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CustomLink } from '@glass/components/Header/CustomLink'
import { PHONE_NUMBER } from '@glass/constants'
import { OrderState } from '@glass/enums'
import { Quote } from '@glass/models'
import { getQuoteService } from '@glass/services/apis/get-quote.service'
import { getNotificationChecked, getQuoteId, setNotificationChecked } from '@glass/utils/session/session.util'
import ShareQuote from './ShareQuote'

export type HeaderProps = {
  showMenu: boolean
}

export const Header: React.FC<HeaderProps> = ({ showMenu }) => {
  const navigate = useNavigate()
  const location = useLocation()
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

  const isQuotePage = useMemo(() => location.pathname.startsWith('/quote'), [location])

  return (
    <header className={'navbar-main' + (showMenu ? ' float' : '')}>
      {showMenu && <div className='top-bar d-md-none'>From £83 monthly</div>}

      <nav id='navbar_top' className='navbar navbar-expand-lg navbar-light'>
        <div className='mobile-nav d-sm-block d-md-block d-lg-none w-100'>
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
            {quoteId && isQuotePage && <ShareQuote url={`${process.env.PUBLIC_URL}/quote/${quoteId}`} />}
          </div>
        </div>

        {showMenu && !!quoteDetails?.is_published && (
          <img src={process.env.PUBLIC_URL + '/images/ellipse.svg'} className='notification-icon img-fluid' alt='' />
        )}

        {showMenu && !!quoteDetails?.is_published && showNotification && (
          <div className='notification-bar' onClick={() => checkNotification()}>
            <div className='notification-title'>Track your service</div>
            <div className='notification-content'>You can access your service timeline in our website menu.</div>
          </div>
        )}

        <Link
          className='navbar-brand d-none d-lg-flex d-md-none d-sm-none'
          to='/'
          onClick={() => opened && menuToggleRef.current?.click()}
        >
          <img src={process.env.PUBLIC_URL + '/img/logo.png'} className='logo-img img-fluid' alt='' />
        </Link>

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
              <div className='service-status-bar'>
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
            <div className='bottom-bar'>
              <button onClick={directToCustomer}>FACT ABOUT OUR PROCESS</button>
              <div className='fw-b mt-3'>Fact 1: Crash Tested Glue 60min</div>
              <div className='mt-1'>
                We use SikaTack DRIVE glue that allows you to drive your car after only 60 minutes.
              </div>
            </div>
            <div className='d-none d-md-flex align-items-center'>
              <button className='btn-raised round' onClick={directToCustomer}>
                Get a Quote
              </button>
              <div className='or-call mx-3'>or Call</div>
              <a href={`tel:${PHONE_NUMBER}`} className='phone-number'>
                {PHONE_NUMBER}
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
