import { Photo, User } from '@/src/types/types'

export type UserCardTypes = {
  fullName: string
  id: number
  photo1?: Photo
  photo2?: Photo
  photo3?: Photo
  city: string
  age: number
  description?: string
  banned?: User[]
}
