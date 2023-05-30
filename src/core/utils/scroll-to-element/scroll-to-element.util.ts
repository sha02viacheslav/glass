export function scrollToElementWithOffset(domId: string, offset = 0) {
  const element = document.getElementById(domId)
  if (!element) return
  const rect = element.getBoundingClientRect()
  const scrollOffset = rect.top + window.pageYOffset - offset

  window.scrollTo({
    top: scrollOffset,
    behavior: 'smooth',
  })
}
