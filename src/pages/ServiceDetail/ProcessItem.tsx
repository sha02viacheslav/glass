import './ProcessItem.css'
import React from 'react'

export type ProcessItemProps = {
  title: string
  description: string
  image?: string
  video?: string
  topDescription?: string
  bottomDescription?: string
  showCheckMark?: boolean
  showCloseMark?: boolean
}

export const ProcessItem: React.FC<ProcessItemProps> = ({
  title,
  description,
  image,
  video,
  topDescription,
  bottomDescription,
  showCheckMark,
  showCloseMark,
}) => {
  return (
    <div className='process-item'>
      <div className='title'>{title}</div>
      <div className='process-item-content'>
        {!!image && (
          <div className='process-item-image-wrap'>
            <img src={image} alt='' />
            {!!topDescription && <div className='top-description'>{topDescription}</div>}
            {!!bottomDescription && <div className='bottom-description'>{bottomDescription}</div>}
            {!!showCheckMark && (
              <img
                src={process.env.PUBLIC_URL + '/images/checkbox-marked-circle.svg'}
                className='process-check-mark'
                alt=''
              />
            )}
            {!!showCloseMark && (
              <img src={process.env.PUBLIC_URL + '/images/close-circle.svg'} className='process-close-mark' alt='' />
            )}
          </div>
        )}
        <div className='description'>{description}</div>
      </div>

      {!!video && (
        <blockquote className='twitter-tweet' data-media-max-width='648'>
          <a href={'https://twitter.com/fix_glass_/status/' + video + '?ref_src=twsrc%5Etfw'}></a>
        </blockquote>
      )}
    </div>
  )
}
