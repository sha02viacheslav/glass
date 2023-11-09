export const isBase64PDF = (base64String: string) => {
  return /^data:application\/pdf;base64,/.test(base64String)
}
