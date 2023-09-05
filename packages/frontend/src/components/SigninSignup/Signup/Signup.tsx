import { yupResolver } from '@hookform/resolvers/yup'
import cn from 'classnames'
import { setCookie } from 'cookies-next'
import useEmblaCarousel, { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel-react'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import ReCAPTCHA, { ReCAPTCHAProps } from 'react-google-recaptcha'
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
  // {
  //   img: '/swiper/girl_sitting2',
  //   rules: [
  //     'Регистрация для всех пользователей бесплатная',
  //     'Знакомство для мужчин доступно после оплаты аккаунта',
  //     'Никаких подписок, плата взимается один раз за дальнейшее пользование всеми возможностями сайта',
  //     'Чтобы знакомиться на сайте девушки должны прикрепить 3 фотографии: лицо анфас, средний или крупный план без макияжа; фото в полный рост; любая фотография на выбор девушки, где отчетливо видно ее лицо',
  //     'На сайте запрещено делать предложения сексуальных услуг. Сайт только для поиска партнеров для построения отношений с перспективой брака.',
  //     'На сайте действует строгая система банов',
  //     'Этот сайт, как "тиндер - топ профили", как "все серьезно" в пьюр для осознанных мужчин и честных девушек, которые нацелены найти отношения с перспективой брака',
  //     'Запрещено неуважительное отношение к собеседнику (мат, угрозы, немотивированная агрессия, просто неуважительное отношение).  При нарушении - блокировка на 1 день. При систематическом нарушении – удаление с сайта с запретом создания новых анкет.',
  //     'Администрация оставляет за собой право удалять сообщения и блокировать аккаунты нарушителей правил без предупреждения, а также настаивать на соблюдении правил. В случае удаления анкеты с оплаченным балансом / действующими сервисами деньги НЕ ВОЗВРАЩАЮТСЯ.',
  //     'лицо анфас, средний или крупный план без макияжа',
  //     'фото в полный рост, где отчетливо видно лицо',
  //     'любая фотография на выбор девушки, где также видно ее лицо',
  // 'Atolin без непристойных предложений',
  // 'Tinder - "топ профили" с функцией "ищу долгосрочно"',
  // '"Все серьезно" в Pure с осознанными мужчинами и честными девушками',
  //   ],
  // },
  {
    img: '/swiper/man_woman.jpg',
    rules: [
      'Skade - для тех, кто нацелен найти отношения с перспективой брака:',
      'состоятельных мужчин и честных девушек',
    ],
  },
  {
    img: '/swiper/girl_sitting4.jpg',
    rules: [
      'Девушки должны прикрепить 3 фотографии, где четко видно лицо',
      'администрация вручную проверяет фейков и виртов',
    ],
  },
  {
    img: '/swiper/man_sitting2.jpg',
    rules: [
      'Общение для мужчин доступно после оплаты аккаунта',
      'Никаких подписок, плата взимается один раз',
      'Цена MVP версии 5000 рублей - присоединяйся сегодня и навсегда!',
      // 'При регистрации необходимо указать доход - эта информация не доступна для других пользователей, нужна для подбора партнера',
    ],
  },
  {
    img: '/swiper/man_woman3.jpg',
    rules: [
      'На сайте действует строгая система банов',
      'Соблюдайте правила общения онлайн и при встрече',
      // 'Не указывайте ложную информацию о себе',
      // 'Не забывайте нажимать кнопку "Договорился о встрече"',
    ],
  },
]

const Signup: React.FC<SignupProps> = ({ handleClickLogin }) => {
  const { setJwt } = useActions()
  const router = useRouter()

  const [gender, setGender] = useState<'male' | 'female'>('female')
  const [isCaptchaPassed, setIsCaptchaPassed] = useState<boolean>(false)
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
    // TODO fix types
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

  const roundSalaryTo1000 = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value
    const roundedValue = Math.floor(Number(inputValue) / 1000) * 1000 // округление до тысячи
    const name = e.currentTarget.name as Parameters<typeof setValue>[0]
    setValue(name, roundedValue, { shouldValidate: true })
  }

  const recapchaChangeHandler: ReCAPTCHAProps['onChange'] = (value) => {
    if (value) setIsCaptchaPassed(true)
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
            для девушек
          </button>
          <button
            className={cn(styles.switchButton, gender === 'male' && styles.switchButton_man)}
            onClick={() => {
              setGender('male')
            }}
          >
            для мужчин
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
                имя*
              </label>
              <p className={styles.errorMessage}>{errors.fullName && errors.fullName.message}</p>
            </div>
            <div className={styles.selectWrapper}>
              <select {...register('city')} className={styles.select}>
                <option value="--Укажите город">--Укажите город*</option>
                <option value="Москва">Москва</option>
                <option value="Санкт-Петербург">Санкт-Петербург</option>
                <option value="Нижний Новгород">Нижний Новгород</option>
                <option value="Екатеринбург">Екатеринбург</option>
                <option value="Ростов-на-Дону">Ростов-на-Дону</option>
                <option value="Белгород">Белгород</option>
                <option value="Новосибирск">Новосибирск</option>
                <option value="Казань">Казань</option>
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
                placeholder="введите возраст"
                min={18}
                max={100}
                id="age"
                name="age"
              />
              <label htmlFor="age" className={styles.inputLabel}>
                возраст*
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
                пароль*
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
                  {...register('salary')}
                  placeholder="ваш доход (руб. в мес.)*"
                  id="salary"
                  name="salary"
                  onBlur={roundSalaryTo1000}
                />
                <label htmlFor="salary" className={styles.inputLabel}>
                  ваш доход (руб. в мес.)*
                </label>
                <p className={styles.errorMessage}>
                  {'salary' in errors && errors?.salary?.message}
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
                    {...register('minDesiredSalary')}
                    placeholder="доход мужчины (руб. в мес.)*"
                    id="minDesiredSalary"
                    name="minDesiredSalary"
                    onBlur={roundSalaryTo1000}
                  />
                  <label htmlFor="minDesiredSalary" className={styles.inputLabel}>
                    доход мужчины (руб. в мес.)*
                  </label>
                  <p className={styles.errorMessage}>
                    {'minDesiredSalary' in errors && errors?.minDesiredSalary?.message}
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
                      рост *
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
                      вес *
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
              Принимаю <a href="/rules"> правила пользования сайтом и оферту</a>
            </label>
          </div>
          <ReCAPTCHA
            className={styles.captcha}
            sitekey="6LdgbegmAAAAABMHgwrOFohHkytDEJp690FQARCP"
            onChange={recapchaChangeHandler}
          />
          <button
            type="submit"
            className={styles.signUpButton}
            disabled={!isValid || !isCaptchaPassed}
          >
            Зарегистрироваться
          </button>
        </form>
        <p className={styles.switch}>
          Уже есть аккаунт?<span onClick={handleClickLogin}>Войти</span>
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
