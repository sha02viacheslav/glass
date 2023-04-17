import { OrderState } from '@glass/enums'

export type BookingDate = {
  booking_start_date: string
  booking_end_date: string
  order_state: OrderState
  day: string
  schedules: number[]
}
