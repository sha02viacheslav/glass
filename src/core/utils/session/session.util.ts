import {
  SESSION_ASKED_TINT,
  SESSION_ASKED_VAN,
  SESSION_NOTIFICATION_CHECKED,
  SESSION_QUOTE_ID,
  SESSION_REQUESTED_URL,
  SESSION_VAN_BODY,
} from '@glass/constants'
import { CarType } from '@glass/enums'

export const getVanBodyType = (): CarType.BARN | CarType.TAILGATER => {
  return JSON.parse(sessionStorage.getItem(SESSION_VAN_BODY) || `"${CarType.TAILGATER}"`)
}

export const setVanBodyType = (value: CarType.BARN | CarType.TAILGATER) => {
  sessionStorage.setItem(SESSION_VAN_BODY, JSON.stringify(value))
}

export const getAskedVan = (): boolean => {
  return JSON.parse(sessionStorage.getItem(SESSION_ASKED_VAN) || 'false')
}

export const setAskedVan = () => {
  sessionStorage.setItem(SESSION_ASKED_VAN, JSON.stringify(true))
}

export const getAskedTint = (): boolean => {
  return JSON.parse(sessionStorage.getItem(SESSION_ASKED_TINT) || 'false')
}

export const setAskedTint = () => {
  sessionStorage.setItem(SESSION_ASKED_TINT, JSON.stringify(true))
}

export const getRequestedURL = (): string => {
  return JSON.parse(sessionStorage.getItem(SESSION_REQUESTED_URL) || '""')
}

export const setRequestedURL = (value: string) => {
  sessionStorage.setItem(SESSION_REQUESTED_URL, JSON.stringify(value))
}

export const clearRequestedURL = () => {
  sessionStorage.removeItem(SESSION_REQUESTED_URL)
}

export const getQuoteId = (): string => {
  return JSON.parse(sessionStorage.getItem(SESSION_QUOTE_ID) || '""')
}

export const setQuoteId = (value: string) => {
  clearNotificationChecked()
  sessionStorage.setItem(SESSION_QUOTE_ID, JSON.stringify(value))
}

export const clearQuoteId = () => {
  sessionStorage.removeItem(SESSION_QUOTE_ID)
}

export const getNotificationChecked = (): boolean => {
  return JSON.parse(sessionStorage.getItem(SESSION_NOTIFICATION_CHECKED) || '""')
}

export const setNotificationChecked = () => {
  sessionStorage.setItem(SESSION_NOTIFICATION_CHECKED, JSON.stringify(true))
}

export const clearNotificationChecked = () => {
  sessionStorage.removeItem(SESSION_NOTIFICATION_CHECKED)
}
