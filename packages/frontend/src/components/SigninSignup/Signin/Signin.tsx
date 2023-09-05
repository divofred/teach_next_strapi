import { yupResolver } from '@hookform/resolvers/yup'
import { isAxiosError } from 'axios'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { client } from '@/src/lib/client'
import { loginSchema } from '@/src/lib/validation'

import { useActions } from '@/src/hooks/useActions'

import { SigninTypes } from './_types'
import styles from './Signin.module.scss'

const Signin: React.FC<SigninTypes> = ({ handleClickRegistration }) => {
  const router = useRouter()
  const { setJwt } = useActions()
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(loginSchema),
  })

  const onSubmit = async (data: any) => {
    try {
      const { data: user } = await client.post('/auth/local', {
        identifier: data.email,
        password: data.password,
      })
      setJwt({ jwt: user?.jwt })
      setCookie('token', user?.jwt)
      router.push('/')
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error?.response?.data?.error?.message)
      }
    }
  }

  return (
    <section className={styles.signin}>
      <div className={styles.formWrapper}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className={styles.inputWrapper}>
              <input
                {...register('email')}
                type="input"
                placeholder="введите email"
                id="email"
                name="email"
                required
                className={styles.input}
              />
              <label htmlFor="email" className={styles.inputLabel}>
                введите email
              </label>
            </div>
            <div className={styles.inputWrapper}>
              <input
                {...register('password')}
                placeholder="password"
                type="password"
                name="password"
                id="password"
                required
                className={styles.input}
              />
              <label htmlFor="password" className={styles.inputLabel}>
                введите пароль
              </label>
            </div>
          </div>

          {error || Object.values(errors)?.length ? (
            <p className={styles.error}>Введите данные, указанные при регистрации</p>
          ) : null}
          <button type="submit" className={styles.signInBtn} disabled={!isValid}>
            Войти
          </button>
        </form>
        <p className={styles.switch}>
          Новый пользователь? <span onClick={handleClickRegistration}>Зарегистрироваться</span>
        </p>
      </div>
      <div className={styles.signInPicContainer} />
    </section>
  )
}

export default React.memo(Signin)
