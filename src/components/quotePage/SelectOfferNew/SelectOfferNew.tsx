import React from 'react'
import { Checkbox } from '@mui/material'
import { Offer, OptionalOrderLine } from '@glass/models'
import './select-offer.css'

export type SelectOfferNewProps = {
  selectOfferToCustomer: Offer[]
  optionalOrderLines?: OptionalOrderLine[]
  totalPrice: number
  totalUnitPrice: number
  onCheckOptionalOrderLine?: (orderLineId: number, optionalLineId: number, checked: boolean) => void
}

export const SelectOfferNew: React.FC<SelectOfferNewProps> = ({
  selectOfferToCustomer,
  optionalOrderLines = [],
  totalPrice,
  totalUnitPrice,
  onCheckOptionalOrderLine,
}) => {
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
                      checked={element.order_line_added}
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
                    {element.discount > 0 && <span className='original-price'>£ {element.price_unit.toFixed(2)}</span>}
                    <span>£ {((element.price_unit * (100 - element.discount)) / 100).toFixed(2)}</span>
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
