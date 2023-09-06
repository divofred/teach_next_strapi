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
    .required('required field')
    .matches(nameRegExp, 'only latin or cyrillic letters')
    .min(2, 'min 2 letters')
    .max(15, 'max 15 letters'),
  age: yup
    .number()
    .typeError('type your age')
    .required('age is required')
    .min(18, 'minimum age is 18')
    .max(100, 'invalid age'),
  city: yup.string().notOneOf(['--City'], 'choose city').required('specify your city'),
  email: yup
    .string()
    .required('enter email')
    .email('enter correct email format')
    .matches(emailRegex, 'incorrect email format'),
  password: yup.string().required('enter password'),
  accept: yup.bool().oneOf([true], 'read and accept the rules'),
}

export const SchemaForMan = yup.object().shape({
  ...CommonSchema,
  minPower: yup
    .number()
    .min(1000, 'we will not show it to other users')
    .max(2000000, 'invalid value')
    .typeError('enter your power')
    .required('enter your power'),
})

export const SchemaForWoman = yup.object().shape({
  ...CommonSchema,
  minDesiredPower: yup
    .number()
    .min(1000, 'enter expected power')
    .max(2000000, 'invalid value')
    .typeError('enter expected power')
    .required('enter expected power'),
  height: yup
    .number()
    .min(1, 'invalid value')
    .max(300, 'invalid value')
    .typeError('enter height')
    .required('enter height'),
  weight: yup
    .number()
    .min(1, 'invalid value')
    .max(300, 'invalid value')
    .typeError('enter weight')
    .required('enter weight'),
})
