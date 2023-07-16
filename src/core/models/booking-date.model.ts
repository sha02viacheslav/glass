import { OrderState } from '@glass/enums'

export type BookingDate = {
  booking_date: string
  time_slot: string | null
  time_slot_visual: string
  order_state: OrderState
}
