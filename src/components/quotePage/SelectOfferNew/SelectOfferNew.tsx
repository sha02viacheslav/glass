import React, { useEffect, useState } from 'react'
import { Checkbox } from '@mui/material'
import { Offer, OptionalOrderLine, PriceTotal } from '@glass/models'
import './select-offer.css'

export type SelectOfferNewProps = {
  selectOfferToCustomer: Offer[]
  optionalOrderLines?: OptionalOrderLine[]
  priceToParent: (value: PriceTotal[]) => void
  onCheckOptionalOrderLine?: (orderLineId: number, optionalLineId: number, checked: boolean) => void
}

export const SelectOfferNew: React.FC<SelectOfferNewProps> = ({
  selectOfferToCustomer,
  optionalOrderLines = [],
  priceToParent,
  onCheckOptionalOrderLine,
}) => {
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [totalUnitPrice, setTotalUnitPrice] = useState<number>(0)

  const calculateTotalPrice = () => {
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
              <tr key={`order-line-${rowIndex}`}>
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
            {optionalOrderLines.map((element, rowIndex) => (
              <tr key={`optional-order-line-${rowIndex}`}>
                <td className='so-info'>
                  <div className='info-div first-col'>
                    <Checkbox
                      checked={!!element.order_line_added}
                      onChange={(_event, value) => {
                        if (onCheckOptionalOrderLine)
                          onCheckOptionalOrderLine(element.order_line_id, element.optional_line_id, value)
                      }}
                      sx={{
                        margin: '-9px 0',
                        color: '#9a73dd',
                        '&.Mui-checked': {
                          color: '#9a73dd',
                        },
                      }}
                    />
                    {element.product}
                  </div>
                </td>
                <td className='so-info'>
                  <div className='info-div top-right'>
                    <span>£ {element.price_unit.toFixed(2)}</span>
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
