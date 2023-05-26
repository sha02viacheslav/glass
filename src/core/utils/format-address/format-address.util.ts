import { Address } from '@glass/models'

export const formatAddress = (address: Address | undefined, withPostCode = true): string => {
  if (!address) return ''
  let result = `${address.line_1 || address.line_2 || 'N/A'}, ${address.town_or_city || 'N/A'}, ${
    address.county || 'N/A'
  }`
  if (withPostCode) result += `, ${address.postcode || 'N/A'}`
  return result
}
