import { ServiceKey } from '../enums/service-key.enum'

export type Service = {
  key: ServiceKey
  background: string
  title: string
  description: string
  glass: string
  quality: string
  time: string
  detailTitle: string
  processTitle: string
  processDescription: string
}
