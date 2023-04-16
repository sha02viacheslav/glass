import { Address } from '@glass/models'

export const formatAddress = (address: Address | undefined, withPostCode = true): string => {
  if (!address) return ''
  let result = `${address.line_1 || address.line_2 || '-'}, ${address.town_or_city || '-'}, ${address.county || '-'}`
  if (withPostCode) result += `, ${address.postcode || '-'}`
  return result
}
