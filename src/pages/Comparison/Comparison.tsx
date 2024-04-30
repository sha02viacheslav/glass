import './Comparison.css'
import React from 'react'
import { OurMethod } from '@glass/components/OurMethod'
import { Partners } from '@glass/components/Partners/Partners'
import { BeforeAfterType } from '@glass/enums'
import { LifeTime } from '../Home/LifeTime'
import { Testimonials } from '../Home/Testimonials'

export const Comparison: React.FC = () => {
  return (
    <div className='comparison-page'>
      <div className='padding-32'></div>

      <div className='page-header'>
        <div className='category'>Fixglass vs. others</div>
        <div className='title'>FixGlass vs Cheap Providers</div>
        <div className='description'>How our service stands out from other cheap alternatives.</div>
      </div>

      <div className='padding-64'></div>

      <div className='comparison-table-container'>
        <table className='comparison-table'>
          <col width={120} />
          <col width={160} />
          <col width={180} />
          <tr>
            <th></th>
            <th>
              <img src={process.env.PUBLIC_URL + '/images/comparison-logo.svg'} className='img-fluid' alt='' />
            </th>
            <th>Other Alternatives</th>
          </tr>
          <tr>
            <td>Booking process</td>
            <td>Flexible booking policy with advance notice for cancellations.</td>
            <td>Cancellations without prior notice are common.</td>
          </tr>
          <tr>
            <td>Glass Selection</td>
            <td>Accurate glass selection through meticulous procedures.</td>
            <td>Fast and sloppy removal of old glass, risking damage to trims and clips.</td>
          </tr>
          <tr>
            <td>Old Glass Removal</td>
            <td>Careful removal of old glass, with no damage to trims and clips.</td>
            <td>Sloppy new glass fitting, lacking proper cleaning, priming, and adhesive application.</td>
          </tr>
          <tr>
            <td>New glass fitting</td>
            <td>
              Thorough and precise fitting of new glass, including proper cleaning, priming, and adhesive application.
            </td>
            <td>Sloppy new glass fitting, typically lacking proper cleaning, priming, and adhesive application.</td>
          </tr>
          <tr>
            <td>Alignment and Sealing</td>
            <td>Attention to detail using rubber blocks for correct alignment and preventing leaks.</td>
            <td>Failure to use rubber blocks for proper alignment, leading to leaks and damage over time.</td>
          </tr>
          <tr>
            <td>Cover Installation</td>
            <td>Professional installation of plastic covers and mirrors, ensuring no further damage.</td>
            <td>Inadequate installation of plastic covers and mirrors, risking further damage.</td>
          </tr>
          <tr>
            <td>Long-Term Risks</td>
            <td>Guaranteed water-tight installation to prevent future issues like rusting.</td>
            <td>Possible water leaks and rusting due to subpar installation practices.</td>
          </tr>
        </table>
      </div>

      <div className='padding-64'></div>

      <LifeTime />

      <div className='padding-64'></div>

      <Partners />

      <div className='padding-64'></div>

      <OurMethod beforeAfterType={BeforeAfterType.ALL} showVideos={false} />

      <div className='padding-64'></div>

      <div className='monthly-installment'>
        Monthly 0% interest installments start from <strong>£83</strong> per month
      </div>

      <div className='padding-64'></div>

      <Testimonials />

      <div className='padding-64'></div>
    </div>
  )
}
