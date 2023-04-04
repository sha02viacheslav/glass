export type PaymentSchedule = {
  date: string
  amount: number
}

export type MonthlyPayment = {
  amount: number
  interest: number
  plan: string
  repayable: number
  summary: string
  schedule: PaymentSchedule[]
}
