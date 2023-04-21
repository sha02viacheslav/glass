import { TransactionState } from '@glass/enums'

export type PaTransaction = {
  id: number
  assist_status: string
  state: TransactionState
  token: string
  url: string
}
