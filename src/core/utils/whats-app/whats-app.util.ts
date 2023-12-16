export const startWhatsApp = (phone: string) => {
  const whatsappUrl = `https://wa.me/${phone.replace(/\s/g, '')}`
  window.open(whatsappUrl, '_blank')
}
