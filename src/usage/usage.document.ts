import { Timestamp } from '@google-cloud/firestore'

export class UsageDocument {
  static collectionName = 'usage'
  minute: Timestamp
  bytes: number
}
