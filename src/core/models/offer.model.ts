export type Offer = {
  product: string
  discount: number
  price_unit: number
  price_subtotal: number
  price_total: number
  order_line_id?: number
  // Temp field
  hidden?: boolean
}
