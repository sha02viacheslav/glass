import { TransactionState } from '@glass/enums'

export type StripeTransaction = {
  id: number
  assist_status: string
  state: TransactionState
  token: string
  url: string
}
