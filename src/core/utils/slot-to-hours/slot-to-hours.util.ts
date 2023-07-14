export const slot2Hours = (slot: string): number | null => {
  if (!slot) return null
  return Number(slot.slice(0, 2)) + Number(slot.slice(2)) / 60
}
