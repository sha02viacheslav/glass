import { useEffect, useState } from 'react'
import { CustomerDetail } from '@glass/models'

export const useCalcPriceSummary = (
  quote: CustomerDetail | undefined,
): {
  totalPrice: number
  totalUnitPrice: number
} => {
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [totalUnitPrice, setTotalUnitPrice] = useState<number>(0)

  useEffect(() => {
    const orderLines = quote?.order_lines || []

    const result = orderLines.reduce(
      (carr, val) => {
        carr[0] += val.price_total
        carr[1] += val.price_subtotal
        return carr
      },
      [0, 0],
    )

    setTotalPrice(+result[0].toFixed(2))
    setTotalUnitPrice(+result[1].toFixed(2))
  }, [quote])

  return {
    totalPrice,
    totalUnitPrice,
  }
}
