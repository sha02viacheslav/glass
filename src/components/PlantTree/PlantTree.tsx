import './PlantTree.css'
import React from 'react'

export type PlantTreeProps = {}

export const PlantTree: React.FC<PlantTreeProps> = ({}) => {
  return (
    <section className='sec-tree'>
      <div className='title'>We Care about nature</div>
      <div className='number'>100+</div>
      <div className='description'>Trees planted by Fixglass.</div>
      <div className='sec-content'>
        Trees are vital for our planet, giving oxygen, storing carbon, and supporting wildlife. With each replacement,
        we donate to plant new trees, helping create a greener future.
      </div>
    </section>
  )
}
