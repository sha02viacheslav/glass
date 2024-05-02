import './Process.css'
import React from 'react'
import { ProcessCard } from './ProcessCard'

export const Process: React.FC = () => {
  return (
    <div className='process-page'>
      <div className='padding-32'></div>

      <div className='page-header'>
        <div className='breadcrumb'>More about our process</div>
        <div className='title'>Explore Our Glass Repair Process: Learn About How We Work!</div>
        <div className='description'>
          Below, we&apos;ve simplified our approach into bite-sized answers to common questions. Tap each question to
          reveal more about how we work.
        </div>
      </div>

      <div className='padding-48'></div>

      <div className='process-group'>
        <div className='process-group-title'>Our Process</div>

        <ProcessCard title='How you can drive after only 60 minutes we changed the glass?'>
          <div>
            During the glass replacement process, we utilize premium Sika Drive glue, which ensures safe driving just 60
            minutes after application.
            <br />
            <br />
            This glue undergoes rigorous crash testing to guarantee its reliability. For more insight, view crash test
            video
          </div>
        </ProcessCard>
        <ProcessCard title='Why we use specially designed curved Non-scratch blade for cutting of the old glue?' />
        <ProcessCard title='How we are able to work mobile and even in the dark?' />
        <ProcessCard title='What are the characteristics of the replaced glass?' />
      </div>

      <div className='padding-48'></div>

      <div className='process-group'>
        <div className='process-group-title'>Payment methods</div>

        <ProcessCard title='How online payments work?' />
        <ProcessCard title='How does installments works?' />
        <ProcessCard title='How does pay in cash works?' />
      </div>

      <div className='padding-48'></div>

      <div className='process-group'>
        <div className='process-group-title'>Insurance and warranty</div>

        <ProcessCard title='Why we offer lifetime warranty if you own the car?' />
        <ProcessCard title='Why we don’t work with the insurance companies?' />
      </div>

      <div className='padding-48'></div>

      <div className='process-group'>
        <div className='process-group-title'>Insurance and warranty</div>

        <ProcessCard title='New glass is clearly little different right?' />
        <ProcessCard title='Is the black edge of the glass same?' />
        <ProcessCard title='Will water leak after replacement?' />
        <ProcessCard title='Is the mirror going to be put back on?' />
      </div>

      <div className='padding-64'></div>
      <div className='padding-64'></div>
    </div>
  )
}
