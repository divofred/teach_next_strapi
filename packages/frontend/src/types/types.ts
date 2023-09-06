export interface FormCommon {
  fullName: string
  email: string
  password: string
  gender: 'male' | 'female'
  age: number
  city: 'Moscow' | 'Ekaterinburg' | 'Novosibirsk' | 'Kazan'
  hair?: 'blonde' | 'dark' | 'ginger'
  height?: string
  weight?: string
  description?: string
  minPower?: string
  minDesiredPower?: string
}

export type Photo = {
  url: string
}

export interface User extends FormCommon {
  id: number
  username: string
  isOnline: boolean
  blocked: boolean
  confirmed: boolean
  createdAt: string
  updatedAt: string
  provider: 'local'
  PokemanAttributes?: Man
  description?: string
  PokewomanAttributes?: Woman
  favorites?: User[]
  banned?: User[]
  isPaidService?: boolean
  photo1?: Photo
  photo2?: Photo
  photo3?: Photo
}

type Base<T> = T & {
  fullName: string
  city: string
  email: string
  age: number
  password: string
  accept: boolean
}

export type Woman = Base<{
  gender: 'female'
  height: number
  weight: number
  minDesiredPower: number
}>

export type Man = Base<{
  gender: 'male'
  height: number
  weight: number
  minPower: number
}>

export type RegisterForm = Woman | Man

export type loginType = {
  jwt: string | null
  user: User | null
}
