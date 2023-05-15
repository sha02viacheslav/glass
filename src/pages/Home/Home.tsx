import './home.css'
import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import home1 from '@glass/assets/images/1.png'
import home2 from '@glass/assets/images/2.png'
import flag from '@glass/assets/images/uk-flag.svg'
import { PHONE_NUMBER } from '@glass/constants'

export const Home: React.FC = () => {
  const navigate = useNavigate()

  const directToCustomer = () => {
    navigate('/customer')
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
              <div className='ms-2'>Nationwide</div>
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

          <div className='wrapper2 new'>
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
        </div>
      </div>

      <div className='wrapper works' id='workdiv'>
        <div className='leftworks'>
          <div className='leftTop'>Wherever you are, whichever model you drive, we got you covered.</div>
          <div className='leftBottom'>
            We offer nationwide windscreen repairs and replacements for passenger vehicles and vans. All jobs are done
            by professionals at your home or work.
          </div>
        </div>
        <div className='rightworks'>
          <div className='rightTop'>Here&apos;s how it works</div>
          <div className='rightCenter'>
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
            <div>Finance</div>
          </div>
          <div className='right'>
            <div>Pay Now</div>
            <div>By debit or credit card.</div>
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
                  windscreen, door glass, sunroof or rear backlight/windscreen.
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
