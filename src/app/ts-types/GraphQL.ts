import { Member } from "@prisma/client"

export interface MemberQueryResult {
  member: Member[]
}