import { BookingOccupy } from '@glass/enums'

export type TimeRow = {
  date: string
  schedules: { occupy: BookingOccupy; bookings: number[] }[]
}
