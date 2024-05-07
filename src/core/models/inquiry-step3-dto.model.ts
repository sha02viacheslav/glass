import { CommentAttachment } from './quote-dto.model'

export type InquiryStep3Dto = {
  fe_token: string
  customer_comment: string
  customer_attachments: CommentAttachment[]
  remove_attachment_ids: number[]
}
