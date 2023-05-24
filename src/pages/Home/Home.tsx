import './home.css'
import React, { useRef } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import home1 from '@glass/assets/images/1.png'
import home2 from '@glass/assets/images/2.png'
import flag from '@glass/assets/images/uk-flag.svg'
import { PHONE_NUMBER } from '@glass/constants'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

export const Home: React.FC = () => {
  const navigate = useNavigate()
  const licenseRef = useRef<HTMLInputElement>(null)

  const patternMatch = () => {
    if (licenseRef.current) {
      licenseRef.current.value = formatLicenseNumber(licenseRef.current.value)
    }
  }

  const directToCustomer = () => {
    if (licenseRef.current?.value) {
      navigate('/customer/' + licenseRef.current?.value)
      licenseRef.current.value = ''
    } else {
      navigate('/customer')
    }
  }

  useEffect(() => {
    localStorage.setItem('development version', JSON.stringify('1.1.7'))
  }, [])

  return (
    <div>
      <div className='container-fluid mainslider'>
        <div className='row carousal'>
          <div className='col-md-2 leftDiv'></div>
          <div className='col-md-8 centerDiv'>
            <div className='topDiv'>
              <img src={flag} alt='UK Flag' />
            </div>
            <div className='maincontent'>
              High Quality <br />
              Windscreen Repair <br />
              at Your Home or Work
            </div>

            <div className='maincontentmobile'>
              High Quality <br />
              Windscreen Repair
              <br /> at Your Home or Work
            </div>

            <div className='bottomDiv'></div>
          </div>
          <div className='col-md-2 rightDiv'></div>

          <div className='get-quote-wrap d-flex flex-column flex-md-row align-items-center gap-3'>
            <div className='reg-input-wrap'>
              <div className='form-group'>
                <input
                  ref={licenseRef}
                  type='text'
                  className='form-control'
                  placeholder='Vehicle Registration Number...'
                  onChange={patternMatch}
                  maxLength={8}
                />
              </div>
            </div>
            <div className='d-flex flex-column flex-md-row align-items-center'>
              <button type='submit' className='get-quote-btn' onClick={directToCustomer}>
                GET A QUOTE
              </button>
              <div className='or-call m-3'>or call</div>
              <a href={`tel:${PHONE_NUMBER}`} className='purple-phone-number'>
                {PHONE_NUMBER}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className='wrapper works' id='workdiv'>
        <div className='leftworks'>
          <div className='leftTop'>Wherever you are, whichever model you drive, we got you covered.</div>
          <div className='leftBottom'>
            We offer windscreen repairs and replacements for passenger vehicles and vans. All jobs are done by
            professionals at your home or work.
          </div>
        </div>
        <div className='rightworks'>
          <div className='rightTop'>Here&apos;s how it works</div>
          <div className='rightCenter d-flex align-items-center'>
            <div className='head1'>
              <div>1</div>
              <div>Fill out the quote form or call</div>
            </div>
            <div className='blueline'></div>
            <div className='head1'>
              <div>2</div>
              <div>We check the glass and quote you</div>
            </div>
            <div className='blueline'></div>
            <div className='head1'>
              <div>3</div>
              <div>You confirm the date</div>
            </div>
            <div className='blueline'></div>
            <div className='head1'>
              <div>4</div>
              <div>We do the job at your home or work</div>
            </div>
            <div className='clear'></div>
          </div>
          <div className='textworks' style={{ display: 'none' }}>
            <div>* Work is done at your home or work whenever you need it.</div>
            <div>* You can track the technicians location and online booking status from mobile.</div>
          </div>
        </div>
        <div className='clear'></div>
      </div>

      <div className='wrapper3'>
        <div className='top'>Payment options</div>
        <div className='bottom'>
          <div className='left'>
            <div className='mb-2'>Finance</div>
            <div>
              0% monthly instalments so you can pay much less as a deposit to secure your booking. Contact our friendly
              sales for more details on {PHONE_NUMBER}
            </div>
          </div>
          <div className='right'>
            <div className='mb-2'>Pay Now</div>
            <div>We accept all major credit cards.</div>
          </div>
          <div className='clear'></div>
        </div>
      </div>

      <div className='wrapper2 afterpaynow'>
        <div className='row'>
          <div className='offset-2 col-md-3 quote-footer'>
            <button type='submit' className='btn1' onClick={directToCustomer}>
              GET A QUOTE
            </button>
          </div>
          <div className='col-md-2 call'>or call</div>
          <div className='col-md-3 num'>
            <a href={`tel:${PHONE_NUMBER}`} className='phone-number'>
              {PHONE_NUMBER}
            </a>
          </div>
          <div className='col-md-2'></div>
        </div>
      </div>

      <div className='wrapper2 newipad'>
        <div className='btnDivmobile'>
          <button className='btn1' onClick={directToCustomer}>
            GET A QUOTE
          </button>
        </div>
        <div className='btnDivtext'>or call</div>
        <div className='btnDivcontact'>
          <a href={`tel:${PHONE_NUMBER}`} className='phone-number'>
            {PHONE_NUMBER}
          </a>
        </div>
        <div className='clear'></div>
      </div>

      <div className='newmobile'>
        <div className='btnDivmobile'>
          <button className='btn1' onClick={directToCustomer}>
            GET A QUOTE
          </button>
        </div>
        <div className='btnDivtext'>or call</div>
        <div className='btnDivcontact'>
          <a href={`tel:${PHONE_NUMBER}`} className='phone-number'>
            {PHONE_NUMBER}
          </a>
        </div>
      </div>

      <div className='wrapper'>
        <div className='approachcontent'>
          <div className='content-right'>
            <div className='content-text'>
              <div className='content-heading'>We make sure you get the right glass for your vehicle</div>
              <p style={{ paddingTop: '20px' }}>
                Glass replacement is always what nobody expects, as it always happens suddenly - completely shattered
                glass, or windscreen has a crack and it needs replacing, required by the law.
              </p>
              <p>
                Windscreens can have some equipment: rain sensor, lane assist sensors, adaptive cruise sensor, heating,
                head up display, coating, different colours, different versions for one model etc.
              </p>
              <p>Driving with a cracked windscreen could lead to three points on your licence and a fine.</p>
            </div>
          </div>
          <div className='approachcontent-left'>
            <img src={home1} className='img-fluid' alt='Home image' />
          </div>
          <div className='clear'></div>
        </div>
      </div>

      <div className='wrapper1'>
        <div className='approachcontent1'>
          <div className='approachcontent-left'>
            <img src={home2} className='img-fluid' alt='Home image' />
          </div>
          <div className='content-right1'>
            <div className='content-text'>
              <p style={{ fontWeight: 'bold', color: '#000' }}>
                We can replace every model out there and every glass of the vehicle:
                <p style={{ color: '#707070', fontWeight: 'normal' }}>
                  front windscreen, door glass or rear backlight/windscreen.
                </p>
              </p>
            </div>
          </div>
          <div className='clear'></div>
        </div>
      </div>

      <div className='wrapper2 afternotice'>
        <div className='row'>
          <div className='offset-2 col-md-3 quote-footer'>
            <button className='btn1' onClick={directToCustomer}>
              GET A QUOTE
            </button>
          </div>
          <div className='col-md-2 call'>or call</div>
          <div className='col-md-3 num'>
            <a href={`tel:${PHONE_NUMBER}`} className='phone-number'>
              {PHONE_NUMBER}
            </a>
          </div>
          <div className='col-md-2'></div>
        </div>
      </div>
      <div className='wrapper2 newipad'>
        <div className='btnDivmobile'>
          <button className='btn1' onClick={directToCustomer}>
            GET A QUOTE
          </button>
        </div>
        <div className='btnDivtext'>or call</div>
        <div className='btnDivcontact'>
          <a href={`tel:${PHONE_NUMBER}`} className='phone-number'>
            {PHONE_NUMBER}
          </a>
        </div>
        <div className='clear'></div>
      </div>
      <div className='newmobile'>
        <div className='btnDivmobile'>
          <button className='btn1' onClick={directToCustomer}>
            GET A QUOTE
          </button>
        </div>
        <div className='btnDivtext'>or call</div>
        <div className='btnDivcontact'>
          <a href={`tel:${PHONE_NUMBER}`} className='phone-number'>
            {PHONE_NUMBER}
          </a>
        </div>
      </div>
    </div>
  )
}
