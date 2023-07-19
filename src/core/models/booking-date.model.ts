import { SlotStatus } from '@glass/enums'

export type BookingDate = {
  holiday: string
  today: boolean
  time_slot: { [key: string]: SlotStatus }
}
