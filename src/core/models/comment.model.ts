import { Attachment } from './attachment.model'

export type Comment = {
  comment: string
  comment_id: number
  attachments: Attachment[]
}
