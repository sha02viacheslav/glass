export const formatLicenseNumber = (value: string | undefined): string => {
  if (!value) return ''
  const licenseNumber = value?.toUpperCase() || ''
  if (
    Number.isInteger(Number(licenseNumber.charAt(2))) &&
    licenseNumber.charAt(4) !== ' ' &&
    licenseNumber.length === 7
  ) {
    return licenseNumber.slice(0, 4) + ' ' + licenseNumber.slice(4)
  }
  return licenseNumber
}
