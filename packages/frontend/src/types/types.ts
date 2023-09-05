export interface FormCommon {
  fullName: string
  email: string
  password: string
  gender: 'male' | 'female'
  age: number
  city:
    | 'Москва'
    | 'Санкт-Петербург'
    | 'Нижний Новгород'
    | 'Екатеринбург'
    | 'Ростов-на-Дону'
    | 'Белгород'
    | 'Новосибирск'
    | 'Казань'
  hair?: 'блонд' | 'брюнет' | 'шатен' | 'рыжий' | 'русый' | 'седой'
  height?: string
  weight?: string
  description?: string
  salary?: string
  minDesiredSalary?: string
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
  manAttributes?: Man
  description?: string
  womanAttributes?: Woman
  favorites?: User[]
  banned?: User[]
  isPaidMan?: boolean
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
  minDesiredSalary: number
}>

export type Man = Base<{
  gender: 'male'
  height: number
  weight: number
  salary: number
}>

export type RegisterForm = Woman | Man

export type loginType = {
  jwt: string | null
  user: User | null
  currentChat: null | {
    id: number
    fullName: string
  }
}
