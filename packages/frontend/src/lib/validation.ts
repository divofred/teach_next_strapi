import * as yup from 'yup'

const nameRegExp = /[a-zA-zа-яА-яёЁ]$/
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export const loginSchema: any = yup.object().shape({
  email: yup
    .string()
    .required('enter email')
    .email('enter correct email')
    .matches(emailRegex, 'email is not correct'),
  password: yup.string().required('enter password'),
})

const CommonSchema = {
  fullName: yup
    .string()
    .required('обязательное поле')
    .matches(nameRegExp, 'только латиница и кириллица')
    .min(2, 'не менее 2-х символов')
    .max(15, 'не более 15 символов'),
  age: yup
    .number()
    .typeError('укажите ваш возраст')
    .required('возраст обязателен для заполнения')
    .min(18, 'минимальный возраст - 18 лет')
    .max(100, 'некорректный возраст'),
  city: yup.string().notOneOf(['--Укажите город'], 'выберите город').required('укажите свой город'),
  email: yup
    .string()
    .required('введите почту')
    .email('введите почту в правильном формате')
    .matches(emailRegex, 'формат почты неверный'),
  password: yup.string().required('введите пароль'),
  accept: yup.bool().oneOf([true], 'прочитайте и согласитесь с правилами'),
}

export const SchemaForMan = yup.object().shape({
  ...CommonSchema,
  minPower: yup
    .number()
    .min(1000, 'мы не покажем его другим пользователям')
    .max(2000000, 'некорректное значение')
    .typeError('укажите ваш доход')
    .required('укажите ваш доход'),
})

export const SchemaForWoman = yup.object().shape({
  ...CommonSchema,
  minDesiredPower: yup
    .number()
    .min(1000, 'укажите ожидаемый доход мужчины')
    .max(2000000, 'некорректное значение')
    .typeError('укажите ожидаемый доход мужчины')
    .required('укажите ожидаемый доход мужчины'),
  height: yup
    .number()
    .min(1, 'некорректное значение')
    .max(300, 'некорректное значение')
    .typeError('укажите рост')
    .required('укажите рост'),
  weight: yup
    .number()
    .min(1, 'некорректное значение')
    .max(300, 'некорректное значение')
    .typeError('укажите вес')
    .required('укажите вес'),
})
