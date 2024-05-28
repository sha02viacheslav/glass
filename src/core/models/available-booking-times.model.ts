export interface AvailableBookingTimes {
  [key: string]: AvailableBookingTime[]
}

export interface AvailableBookingTime {
  reserve_booking_id: number
  time_slot_visual: string
  system_suggestion: boolean
}

export interface AvailableBookingTimeView {
  reserve_booking_id: number
  system_suggestion: boolean
  time_slot: string
  timeSlotIndex: number
  booking_date: string
  daysFromNow: number
}
