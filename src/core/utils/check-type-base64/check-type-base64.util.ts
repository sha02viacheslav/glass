export const isBase64PDF = (base64String: string) => {
  return /^data:application\/pdf;base64,/.test(base64String)
}

export const isBase64Video = (base64String: string) => {
  return /^data:video\/mp4;base64,/.test(base64String)
}
