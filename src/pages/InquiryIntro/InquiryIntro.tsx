import './InquiryIntro.css'
import React, { useEffect, useState } from 'react'
import { trackPromise } from 'react-promise-tracker'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { OurMethod } from '@glass/components/OurMethod'
import { Partners } from '@glass/components/Partners/Partners'
import { BeforeAfterType } from '@glass/enums'
import { Inquiry } from '@glass/models'
import { getInquiryService } from '@glass/services/apis/get-inquiry.service'
import { InstallmentBenefits } from '../Home/InstallmentBenefits'
import { Testimonials } from '../Home/Testimonials'

export const InquiryIntro: React.FC = () => {
  const navigate = useNavigate()
  const { licenseNum } = useParams()

  const [inquiry, setInquiry] = useState<Inquiry | undefined>()

  const fetchVehData = (license: string | undefined) => {
    if (!!license) {
      // fetch vehicle data
      trackPromise(
        getInquiryService(license)
          .then((res) => {
            if (res.success) {
              setInquiry(res.data)
            }
          })
          .catch(() => {}),
      )
    }
  }

  const directToCustomer = () => {
    navigate('/customer/' + (licenseNum || ''))
  }

  useEffect(() => {
    fetchVehData(licenseNum)
  }, [licenseNum])

  return (
    <div className='inquiry-intro-page'>
      <div className='about-your-car'>
        <img
          src={
            inquiry?.step_1?.vehicle_logo_url ||
            process.env.PUBLIC_URL + '/images/mechanics-checking-planning-workshop.png'
          }
        />
        <div className='title'>We need to ask few details about your {inquiry?.Make || 'car'}</div>
        <div className='description'>It&apos;ll take less than 5 minutes of your time</div>
      </div>

      <div className='padding-64'></div>

      <div className='lets-start'>
        <button className='btn-raised w-100' onClick={() => directToCustomer()}>
          Let&apos;s start
        </button>
        <div className='process-link'>
          Find out more about our process <Link to='/process'>here</Link>
        </div>
      </div>

      <div className='padding-64'></div>

      <div className='know-more-service'>
        <div className='title'>Want to know more about our service?</div>
        <div className='description'>We Guarantee a seamless install, making your windscreen look like new again</div>
      </div>

      <div className='padding-64'></div>

      <OurMethod beforeAfterType={BeforeAfterType.ALL} showVideos={false} />

      <div className='padding-64'></div>

      <div className='after-installation'>
        <div className='title'>Drive Away Safely in 60 minutes After Installation!</div>
        <div className='description'>
          We use premium crash-tested SikaTack® DRIVE glue, which sets quickly and is guaranteed to stay in place once
          set
        </div>
      </div>

      <div className='padding-64'></div>

      <InstallmentBenefits />

      <div className='padding-64'></div>

      <Partners />

      <div className='padding-64'></div>

      <Testimonials />

      <div className='padding-64'></div>
      <div className='padding-64'></div>
    </div>
  )
}
