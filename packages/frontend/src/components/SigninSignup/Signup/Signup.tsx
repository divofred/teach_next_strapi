import { yupResolver } from '@hookform/resolvers/yup'
import cn from 'classnames'
import { setCookie } from 'cookies-next'
import useEmblaCarousel, { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel-react'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { client } from '@/src/lib/client'
import { SchemaForMan, SchemaForWoman } from '@/src/lib/validation'

import { useActions } from '@/src/hooks/useActions'

import { Man, Woman } from '@/src/types/types'

import styles from './Signup.module.scss'

type SignupProps = {
  handleClickLogin: () => void
}

const options: EmblaOptionsType = { align: 'center' }
const slides = [
  {
    img: '/swiper/man_woman.jpg',
    rules: ['1 pokemon title', '1 paragrapgh'],
  },
  {
    img: '/swiper/girl_sitting4.jpg',
    rules: ['2 pokemon title', '2 paragrapgh'],
  },
  {
    img: '/swiper/man_sitting2.jpg',
    rules: ['3 pokemon title', '3 paragrapgh'],
  },
  {
    img: '/swiper/man_woman3.jpg',
    rules: ['4 pokemon title', '4 paragrapgh'],
  },
]

const Signup: React.FC<SignupProps> = ({ handleClickLogin }) => {
  const { setJwt } = useActions()
  const router = useRouter()

  const [gender, setGender] = useState<'male' | 'female'>('female')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const onScroll = useCallback((emblaApi: EmblaCarouselType) => {
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()))
    setScrollProgress(progress * 100)
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onScroll(emblaApi)
    emblaApi.on('reInit', onScroll)
    emblaApi.on('scroll', onScroll)
  }, [emblaApi, onScroll])

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<Man | Woman>({
    mode: 'onBlur',
    // @ts-ignore
    resolver: yupResolver(gender === 'male' ? SchemaForMan : SchemaForWoman),
  })

  useEffect(() => {
    reset()
    setValue('gender', gender)
  }, [gender])

  async function onSubmit(data: Man | Woman) {
    try {
      const { data: user } = await client.post('/auth/local/register', data)
      setJwt({ jwt: user?.jwt })
      setCookie('token', user.jwt)
      reset()
      router.push('/profile')
    } catch (e) {}
  }

  const roundPowerTo1000 = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value
    const roundedValue = Math.floor(Number(inputValue) / 1000) * 1000
    const name = e.currentTarget.name as Parameters<typeof setValue>[0]
    setValue(name, roundedValue, { shouldValidate: true })
  }

  return (
    <section className={styles.signup}>
      <div className={styles.wrapper}>
        <div className={styles.switchRole}>
          <button
            className={cn(styles.switchButton, gender === 'female' && styles.switchButton_woman)}
            onClick={() => {
              setGender('female')
            }}
          >
            Pokewoman
          </button>
          <button
            className={cn(styles.switchButton, gender === 'male' && styles.switchButton_man)}
            onClick={() => {
              setGender('male')
            }}
          >
            Pokeman
          </button>
        </div>
        <form className={styles.signupForm} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                type="text"
                {...register('fullName')}
                placeholder="имя*"
                id="fullName"
                name="fullName"
              />
              <label htmlFor="fullName" className={styles.inputLabel}>
                name*
              </label>
              <p className={styles.errorMessage}>{errors.fullName && errors.fullName.message}</p>
            </div>
            <div className={styles.selectWrapper}>
              <select {...register('city')} className={styles.select}>
                <option value="--Укажите город">--City*</option>
                <option value="Moscow">Moscow</option>
                <option value="Ekaterinburg">Ekaterinburg</option>
                <option value="Novosibirsk">Novosibirsk</option>
                <option value="Kazan">Kazan</option>
              </select>
              <p className={styles.errorMessage}>{errors.city && errors.city.message}</p>
            </div>
            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                type="email"
                {...register('email')}
                placeholder="введите email"
                id="email"
                name="email"
              />
              <label htmlFor="email" className={styles.inputLabel}>
                email*
              </label>
              <p className={styles.errorMessage}>{errors.email && errors.email.message}</p>
            </div>
            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                type="number"
                {...register('age')}
                placeholder="age"
                min={18}
                max={100}
                id="age"
                name="age"
              />
              <label htmlFor="age" className={styles.inputLabel}>
                age*
              </label>
              <p className={styles.errorMessage}>{errors.age && errors.age.message}</p>
            </div>
            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                type="password"
                {...register('password')}
                placeholder="придумайте пароль"
                id="password"
                name="password"
              />
              <label htmlFor="password" className={styles.inputLabel}>
                password*
              </label>
              <p className={styles.errorMessage}>{errors.password && errors.password.message}</p>
            </div>
            {gender === 'male' ? (
              <div className={styles.inputWrapper}>
                <input
                  className={cn(styles.input, styles.clearArrowsInput)}
                  type="number"
                  min={1000}
                  max={2000000}
                  {...register('minPower')}
                  placeholder="ваш доход (руб. в мес.)*"
                  id="minPower"
                  name="minPower"
                  onBlur={roundPowerTo1000}
                />
                <label htmlFor="minPower" className={styles.inputLabel}>
                  your power*
                </label>
                <p className={styles.errorMessage}>
                  {'minPower' in errors && errors?.minPower?.message}
                </p>
              </div>
            ) : (
              <>
                <div className={styles.inputWrapper}>
                  <input
                    className={cn(styles.input, styles.clearArrowsInput)}
                    type="number"
                    min={1000}
                    max={2000000}
                    {...register('minDesiredPower')}
                    placeholder="доход мужчины (руб. в мес.)*"
                    id="minDesiredPower"
                    name="minDesiredPower"
                    onBlur={roundPowerTo1000}
                  />
                  <label htmlFor="minDesiredPower" className={styles.inputLabel}>
                    desired power*
                  </label>
                  <p className={styles.errorMessage}>
                    {'minDesiredPower' in errors && errors?.minDesiredPower?.message}
                  </p>
                </div>
                <div className={styles.inlineInputsContainer}>
                  <div className={styles.inputWrapper}>
                    <input
                      className={cn(styles.input, styles.clearArrowsInput)}
                      type="number"
                      step="1"
                      min={100}
                      max={250}
                      {...register('height')}
                      id="height"
                      name="height"
                      placeholder="рост *"
                    />
                    <label htmlFor="height" className={styles.inputLabel}>
                      height *
                    </label>
                    <p className={styles.errorMessage}>
                      {errors?.height && errors?.height?.message}
                    </p>
                  </div>
                  <div className={styles.inputWrapper}>
                    <input
                      className={cn(styles.input, styles.clearArrowsInput)}
                      type="number"
                      step="1"
                      min={1}
                      max={150}
                      {...register('weight')}
                      placeholder="вес *"
                      id="weight"
                      name="weight"
                    />
                    <label htmlFor="weight" className={styles.inputLabel}>
                      weight *
                    </label>
                    <p className={styles.errorMessage}>
                      {errors?.weight && errors?.weight?.message}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={styles.acceptTerms}>
            <input type="checkbox" {...register('accept')} id="accept" name="accept" />
            <label htmlFor="accept">
              I agree <a href="/rules">with rules</a>
            </label>
          </div>
          <button type="submit" className={styles.signUpButton} disabled={!isValid}>
            Зарегистрироваться
          </button>
        </form>
        <p className={styles.switch}>
          Have an account?<span onClick={handleClickLogin}>Login</span>
        </p>
      </div>
      <div className={styles.swiper}>
        <div className="embla">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {slides.map((slide, index) => (
                <div className="embla__slide" key={index}>
                  <div className="embla__slide__number">
                    <span>{index + 1}</span>
                  </div>
                  <div className={styles.cardWrapper}>
                    <ul className={styles.rulesList}>
                      {slide.rules.map((rule) => (
                        <li className={styles.rulesItem}>{rule}</li>
                      ))}
                    </ul>
                    <img className={styles.cardImg} src={slide.img} alt="Your alt text" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="embla__progress">
            <div
              className="embla__progress__bar"
              style={{ transform: `translate3d(${scrollProgress}%,0px,0px)` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default React.memo(Signup)
