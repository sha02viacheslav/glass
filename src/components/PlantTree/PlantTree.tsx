import './PlantTree.css'
import React from 'react'

export type PlantTreeProps = {}

export const PlantTree: React.FC<PlantTreeProps> = ({}) => {
  return (
    <section className='sec-tree'>
      <div className='container'>
        <div className='col-md-4 py-4 py-md-5'>
          <p className='text-primary fnt-20 fnt-md-28'>With every glass replacement</p>
          <p className='fnt-48 fnt-md-60 mb-3'>We plant a tree</p>
          <p className='text-primary fnt-20 fnt-md-28 mb-2'>Trees are vital</p>
          <p className='text-grey mb-4'>
            As the biggest plants on the planet, they give us oxygen, store carbon, stabilize the soil and give life to
            the world’s wildlife. Trees regulate the water cycle.
          </p>
          <p className='text-primary fnt-20 fnt-md-28'>All used glass will be collected and recycled</p>
        </div>
      </div>
    </section>
  )
}
