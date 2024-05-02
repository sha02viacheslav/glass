import './ServiceDetail.css'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Chat } from '@glass/components/Chat'
import { Footer } from '@glass/components/Footer'
import { LicensePlate } from '@glass/components/LicensePlate'
import { OurMethod } from '@glass/components/OurMethod'
import { QuickContact } from '@glass/components/QuickContact'
import { SERVICES } from '@glass/constants'
import { BeforeAfterType, ServiceKey } from '@glass/enums'
import { VehicleData } from '@glass/models'
import { ProcessItem } from './ProcessItem'

export const ServiceDetail: React.FC = () => {
  const { serviceKey } = useParams()
  const service = SERVICES.find((item) => item.key === serviceKey)
  const [vehData, setVehData] = useState<VehicleData | undefined>()

  return (
    <div className='service-detail-page'>
      <div className='padding-32'></div>

      <div className='page-header'>
        <div className='breadcrumb'>
          Our services&nbsp;<span className='active'>/ {service?.title}</span>
        </div>
        <div className='title'>{service?.detailTitle}</div>
        <div className='description'>
          We source high-quality glass exceeding all safety standards. All existing sensors and heating elements will be
          included. Safely drive again after 1 - 2 hours.
        </div>
      </div>

      <div className='padding-32'></div>

      <div className='reg-container'>
        <div className='title'>Share your car&apos;s registration number and hit search icon.</div>
        <div className='reg-card'>
          <LicensePlate
            placeholderVal='Enter reg'
            showSearch={true}
            showModel={true}
            handleVehicleDataChange={(data) => setVehData(data)}
          />
        </div>
      </div>

      <div className='padding-48'></div>

      <div className='process'>
        <div className='title'>{service?.processTitle}</div>
        <div className='description'>{service?.processDescription}</div>

        <div className='padding-40'></div>

        {!!vehData && (
          <div className='process-items-container'>
            {serviceKey === ServiceKey.WINDSCREEN && (
              <>
                <ProcessItem
                  title='BMW G80 M3 Competition smashed windscreen'
                  description="Windscreen has rain/light sensor, camera assist and head-up display. We'll source OEM glass with exact same features."
                  image={process.env.PUBLIC_URL + '/images/windscreen-1.png'}
                />
                <ProcessItem
                  title='Cutting old glue'
                  description="We don't have skills for cheap job. We only use premium tools with careful approach to prevent damaging your vehicle."
                  image={process.env.PUBLIC_URL + '/images/windscreen-2.png'}
                  topDescription='Scratchless blade'
                  bottomDescription='Cheap job scratch'
                  showCheckMark={true}
                  showCloseMark={true}
                />
                <ProcessItem
                  title='New crash tested urethane applied'
                  description='We apply crash-tested glue, ready for installing your new OEE or OEM windscreen. Safe to drive in 60 min after fitting.'
                  image={process.env.PUBLIC_URL + '/images/windscreen-3.png'}
                />
                <ProcessItem
                  title='Brand new windscreen is fitted'
                  description='New windscreen is fitted just like in factory, no water leaks, no loose mouldings, glass and vehicle body has correct gap about 5mm. Looks beautiful!'
                  image={process.env.PUBLIC_URL + '/images/windscreen-4.png'}
                />
                <ProcessItem
                  title='Interior mirror attached'
                  description="After new windscreen is installed, we'll then connect all the cables for sensors and re-attach the interior mirror."
                  image={process.env.PUBLIC_URL + '/images/windscreen-5.png'}
                />
                <ProcessItem
                  title='Car is safe to drive'
                  description='You can drive the car after 60 minutes of replacement because of our 60 min crash tested glue.'
                  image={process.env.PUBLIC_URL + '/images/windscreen-6.png'}
                />
              </>
            )}

            {serviceKey === ServiceKey.DOOR_GLASS && (
              <>
                <ProcessItem
                  title='MK7 Golf broken door glass panel removing'
                  description='We begin the process of replacing your door glass by carefully removing the door panel.'
                  image={process.env.PUBLIC_URL + '/images/door-1.png'}
                />
                <ProcessItem
                  title='Vacuuming shattered glass'
                  description='The next step involves vacuuming the shattered glass from inside the door and the glass channel for a thorough cleanup.'
                  image={process.env.PUBLIC_URL + '/images/door-2.png'}
                />
                <ProcessItem
                  title='New glass fitted and connected to regulator'
                  description='The new glass is expertly fitted and seamlessly connected to the regulator, ensuring it functions just as before.'
                  image={process.env.PUBLIC_URL + '/images/door-3.png'}
                  bottomDescription='Regulator connected'
                />
                <ProcessItem
                  title='Placing back the panel'
                  description='Reattaching the panel to its original position, ensuring it is restored to its previous state.'
                  image={process.env.PUBLIC_URL + '/images/door-4.png'}
                />
                <ProcessItem
                  title='Door glass works same as before'
                  description='New door glass is replaced at it works same as before the damage as you can see on the video below'
                  video='1750125069769056477'
                />
              </>
            )}
          </div>
        )}
      </div>

      {!!vehData && (
        <>
          <div className='padding-64'></div>

          <OurMethod beforeAfterType={BeforeAfterType.ALL} />

          <div className='padding-64'></div>
          <div className='padding-64'></div>

          <QuickContact showReg={true} />

          <Footer />
        </>
      )}

      <Chat />
    </div>
  )
}
