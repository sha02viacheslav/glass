import { WinLoc } from '@glass/enums'

export type WindowSelection = {
  name: string
  window: WinLoc
  broken: boolean
  source: string
  hasTinted: boolean
  tintedSource?: string
}
