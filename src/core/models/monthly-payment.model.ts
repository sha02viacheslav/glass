export type PaymentSchedule = {
  date: string
  amount: number
}

export type MonthlyPayment = {
  summary: string
  schedule: PaymentSchedule[]
}
