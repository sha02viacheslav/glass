export const slot2Time = (slot: string): string => {
  if (!slot) return 'N/A'
  return slot.slice(0, 2) + ':' + slot.slice(2)
}
