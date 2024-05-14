import './ProcessCard.css'
import React, { ReactNode, useState } from 'react'

export type ProcessCardProps = {
  title: string
  children?: ReactNode
}

export const ProcessCard: React.FC<ProcessCardProps> = ({ title, children }) => {
  const [expanded, setExpanded] = useState<boolean>(false)

  return (
    <section className={'process-card' + (expanded ? ' expanded' : '')}>
      <div className='process-card-header' onClick={() => setExpanded((prev) => !prev)}>
        <div className='process-card-title'>{title}</div>
        <img
          src={process.env.PUBLIC_URL + '/images/chevron-down.svg'}
          className={'process-card-expand' + (expanded ? ' rotate' : '')}
          alt=''
        />
      </div>

      <div className={'process-card-content' + (expanded ? ' expanded' : '')}>
        <div className='pt-4'>{children}</div>
      </div>
    </section>
  )
}
