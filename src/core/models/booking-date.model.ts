import { OrderState } from '@glass/enums'

export type BookingDate = {
  booking_date: string
  time_slot: string
  order_state: OrderState
  day: string
  schedules: number[]
}
