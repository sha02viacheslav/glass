import './InstallmentBenefits.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export const InstallmentBenefits: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className='sec-installment-benefits'>
      <div className='title'>Installment Benefits</div>
      <div className='description'>
        An insurance claim can end up costing you far more than our monthly installments
      </div>
      <button className='btn-raised' onClick={() => navigate('/installment-benefits')}>
        See how
        <img src={process.env.PUBLIC_URL + '/images/arrow-right.svg'} className='img-fluid' alt='' />
      </button>
    </section>
  )
}
