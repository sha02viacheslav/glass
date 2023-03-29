import React, { useEffect, useState } from 'react'
import './select-offer.css'
import { Offer } from '@glass/models'

export type SelectOfferNewProps = {
  selectOfferToCustomer: Offer[]
  priceToParent: (value: { total: number; subtotal: number }[]) => void
}

export const SelectOfferNew: React.FC<SelectOfferNewProps> = ({ selectOfferToCustomer, priceToParent }) => {
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [totalUnitPrice, setTotalUnitPrice] = useState<number>(0)

  function calculateTotalPrice() {
    let total = 0
    let unit_total = 0
    for (let i = 0; i < selectOfferToCustomer.length; i++) {
      const price = selectOfferToCustomer[i].price_total
      const unit = selectOfferToCustomer[i].price_subtotal
      total += price
      unit_total += unit
    }
    setTotalPrice(total)
    setTotalUnitPrice(unit_total)
    priceToParent([
      {
        total: +total.toFixed(2),
        subtotal: +unit_total.toFixed(2),
      },
    ])
  }

  useEffect(() => {
    calculateTotalPrice()
  }, [])

  return (
    <div className='select-offer'>
      <div className='table-container'>
        <table className='SO-table'>
          <tbody>
            {selectOfferToCustomer.map((element, rowIndex) => (
              <tr key={rowIndex}>
                <td className='so-info'>
                  <div className='info-div first-col'>{element.product}</div>
                </td>
                <td className='so-info'>
                  <div className='info-div top-right'>
                    {element.discount > 0 && <span className='original-price'>£ {element.price_unit.toFixed(2)}</span>}
                    <span>£ {element.price_subtotal.toFixed(2)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='total-container-out'>
        <div className='total-container-in'>
          <div className='total-row'>
            <span className='total-bold'>Untaxed amount</span>
            <span>£ {totalUnitPrice.toFixed(2)}</span>
          </div>
          <div className='total-row'>
            <span className='total-bold'>Tax 20%</span>
            <span>£ {(totalPrice - totalUnitPrice).toFixed(2)}</span>
          </div>
          <div className='total-row total-last'>
            <span className='total-bold'>Total</span>
            <span>£ {totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
