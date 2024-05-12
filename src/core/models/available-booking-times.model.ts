export interface AvailableBookingTimes {
  [key: string]: AvailableBookingTime[]
}

export interface AvailableBookingTime {
  reserve_booking_id: number
  time_slot_visual: string
}

export interface AvailableBookingTimeView {
  reserve_booking_id: number
  time_slot: string
  timeSlotIndex: number
  booking_date: string
  daysFromNow: number
}
