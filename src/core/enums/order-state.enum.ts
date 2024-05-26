export enum OrderState {
  //  Inquiry
  STEP1 = 'step_1',
  STEP2 = 'step_2',
  STEP3 = 'step_3',
  STEP4 = 'step_4',
  STEP5 = 'step_5',
  FINAL_CHECK = 'final_check',

  // Quote in progress
  NEW = 'new',
  OPEN = 'open',
  PAYMENT_IN_1H = 'payment_in_1h',
  PAYMENT_IN_1H_EXPIRED = 'payment_in_1h_expired',
  CONFIRM = 'confirm',
  WON = 'won',
  LOST = 'lost',
  REQUEST_TO_CANCEL = 'request_to_cancel',
  TO_REBOOK = 'to_rebook',
}
