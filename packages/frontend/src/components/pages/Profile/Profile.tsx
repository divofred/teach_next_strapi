import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Head from 'next/head'

import { client } from '@/src/lib/client'

import { useActions } from '@/src/hooks/useActions'
import { useHasMounted } from '@/src/hooks/useHasMounted'
import { useTypedSelector } from '@/src/hooks/useTypedSelector'

import { FormCommon } from '@/src/types/types'

import styles from './Profile.module.scss'

const Profile: React.FC = ({
  age,
  fullName,
  manAttributes,
  womanAttributes,
  photo1,
  photo2,
  photo3,
  city,
  hair,
  description,
  id,
}: any) => {
  const [selectedImage1, setSelectedImage1] = useState('')
  const [selectedImage2, setSelectedImage2] = useState('')
  const [selectedImage3, setSelectedImage3] = useState('')
  const [mainImg, setMainImg] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const user = useTypedSelector((state) => state?.user)
  const router = useRouter()
  const hasMounted = useHasMounted()
  const { setChat } = useActions()
  const strapi_url = process.env.CMS_LINK
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormCommon>({
    mode: 'onBlur',
  })

  useEffect(() => {
    if (router?.pathname === '/profile' && (!user?.user || !user?.jwt)) {
      router.push('/signin')
    }
  }, [])

  useEffect(() => {
    if (router?.pathname === '/profile' && user?.user?.photo1) {
      setSelectedImage1(strapi_url + user.user.photo1.url)
    } else if (photo1) {
      setSelectedImage1(strapi_url + photo1.url)
    }
  }, [photo1, strapi_url, user, router])

  useEffect(() => {
    if (router?.pathname === '/profile' && user?.user?.photo2) {
      setSelectedImage2(strapi_url + user.user.photo2.url)
    } else if (photo2) {
      setSelectedImage2(strapi_url + photo2.url)
    }
  }, [photo2, strapi_url, user, router])

  useEffect(() => {
    if (router?.pathname === '/profile' && user?.user?.photo3) {
      setSelectedImage3(strapi_url + user.user.photo3.url)
    } else if (photo3) {
      setSelectedImage3(strapi_url + photo3.url)
    }
  }, [photo3, strapi_url, user, router])

  useEffect(() => {
    if (selectedImage1) {
      setMainImg(selectedImage1)
    } else if (selectedImage2) {
      setMainImg(selectedImage2)
    } else if (selectedImage3) {
      setMainImg(selectedImage3)
    }
  }, [selectedImage1, selectedImage2, selectedImage3])

  const [selectedFile1, setSelectedFile1] = useState<File>()
  const [selectedFile2, setSelectedFile2] = useState<File>()
  const [selectedFile3, setSelectedFile3] = useState<File>()

  const isDisabled =
    (user?.user?.gender === 'male' && !user?.user?.isPaidMan) ||
    (user?.user?.gender === 'female' &&
      (!user?.user?.photo1 || !user?.user?.photo2 || !user?.user?.photo3)) ||
    user?.user?.banned?.some((obj) => obj.id === user?.user?.id)

  const isFavorite = user?.user?.favorites?.includes(id)

  const handleClickAddFavourite = () => {
    if (!user?.jwt && !user?.user) return router.push('/signin')
    client.put(
      `${process.env.CMS_LINK}/api/users/${user?.user?.id}`,
      {
        favorites: {
          connect: [id],
        },
      },
      { headers: { Authorization: `Bearer ${user?.jwt}`, 'Content-Type': 'application/json' } }
    )
  }

  const onSubmit: SubmitHandler<FormCommon> = async (data) => {
    if (router?.pathname !== '/profile') return

    try {
      const updatedData = {
        age: data.age || user?.user?.age,
        city: data.city || user?.user?.city,
        hair: data.hair || user?.user?.hair || '',
        description: data.description || user?.user?.description,
        ...(user?.user?.gender === 'male'
          ? {
              manAttributes: {
                ...(user?.user?.isPaidService
                  ? { salary: data.salary || user?.user?.manAttributes?.salary }
                  : { salary: user?.user?.manAttributes?.salary }),
                height: data.height || user?.user?.manAttributes?.height,
                weight: data.weight || user?.user?.manAttributes?.weight,
              },
            }
          : {}),
        ...(user?.user?.gender === 'female'
          ? {
              womanAttributes: {
                ...(user?.user?.isPaidService
                  ? {
                      minDesiredSalary:
                        data.minDesiredSalary || user?.user?.womanAttributes?.minDesiredSalary,
                    }
                  : { minDesiredSalary: user?.user?.womanAttributes?.minDesiredSalary }),
                height: data.height || user?.user?.womanAttributes?.height,
                weight: data.weight || user?.user?.womanAttributes?.weight,
              },
            }
          : {}),
      }

      const res = await client.put('/users/me', updatedData, {
        headers: { Authorization: `Bearer ${user.jwt}`, 'Content-Type': 'application/json' },
      })

      if (res.status === 200) {
        setIsEditing(false)
        if (
          user?.user?.isPaidService &&
          user.user?.gender === 'male' &&
          data?.salary &&
          +data?.salary !== user?.user?.manAttributes?.salary
        ) {
          await client.put(
            '/users/me',
            { isPaidService: false },
            {
              headers: {
                Authorization: `Bearer ${user.jwt}`,
                'Content-Type': 'application/json',
              },
            }
          )
        } else if (
          user?.user?.isPaidService &&
          user.user?.gender === 'female' &&
          data?.minDesiredSalary &&
          +data?.minDesiredSalary !== user?.user?.womanAttributes?.minDesiredSalary
        ) {
          await client.put(
            '/users/me',
            { isPaidService: false },
            {
              headers: {
                Authorization: `Bearer ${user.jwt}`,
                'Content-Type': 'application/json',
              },
            }
          )
        }
        router.reload()
      }
    } catch (error) {
      setIsEditing(false)
    }
  }

  const handleHoverImg1 = () => {
    setMainImg(selectedImage1)
  }
  const handleHoverImg2 = () => {
    setMainImg(selectedImage2)
  }
  const handleHoverImg3 = () => {
    setMainImg(selectedImage3)
  }

  const handleUpload = async () => {
    if (!selectedFile1 && !selectedFile2 && !selectedFile3) return
    try {
      setUploading(true)
      const uploadPromises = []
      if (selectedFile1) {
        const formData1 = new FormData()
        formData1.append('files', selectedFile1)
        formData1.append('ref', 'plugin::users-permissions.user')
        const id = user?.user?.id
        if (id) formData1.append('refId', id.toString())
        formData1.append('field', 'photo1')
        uploadPromises.push(
          client.post('/upload', formData1, {
            headers: {
              Authorization: `Bearer ${user?.jwt}`,
              'Content-Type': 'multipart/form-data',
            },
          })
        )
      }

      if (selectedFile2) {
        const formData2 = new FormData()
        formData2.append('files', selectedFile2)
        formData2.append('ref', 'plugin::users-permissions.user')
        const id = user?.user?.id
        if (id) formData2.append('refId', id.toString())
        formData2.append('field', 'photo2')
        uploadPromises.push(
          client.post('/upload', formData2, {
            headers: {
              Authorization: `Bearer ${user?.jwt}`,
              'Content-Type': 'multipart/form-data',
            },
          })
        )
      }

      if (selectedFile3) {
        const formData3 = new FormData()
        formData3.append('files', selectedFile3)
        formData3.append('ref', 'plugin::users-permissions.user')
        const id = user?.user?.id
        if (id) formData3.append('refId', id.toString())
        formData3.append('field', 'photo3')
        uploadPromises.push(
          client.post('/upload', formData3, {
            headers: {
              Authorization: `Bearer ${user?.jwt}`,
              'Content-Type': 'multipart/form-data',
            },
          })
        )
      }

      await Promise.all(uploadPromises)

      router.reload()
    } catch (error: unknown) {}
    setUploading(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleClickMessage = () => {
    if (!user?.jwt || !user?.user) {
      return router.push('/signin')
    } else if (user?.jwt && user?.user) {
      setChat({ id, fullName })
      return router.push('/chats')
    }
  }

  const handleDeletePhoto1 = async () => {
    const res = await client.put(
      '/users/me',
      { photo1: null },
      {
        headers: { Authorization: `Bearer ${user.jwt}`, 'Content-Type': 'application/json' },
      }
    )
    if (res.status === 200) {
      setSelectedImage1('')
      setSelectedFile1(undefined)
    }
  }
  const handleDeletePhoto2 = async () => {
    const res = await client.put(
      '/users/me',
      { photo2: null },
      {
        headers: { Authorization: `Bearer ${user.jwt}`, 'Content-Type': 'application/json' },
      }
    )
    if (res.status === 200) {
      setSelectedImage2('')
      setSelectedFile2(undefined)
    }
  }
  const handleDeletePhoto3 = async () => {
    const res = await client.put(
      '/users/me',
      { photo3: null },
      {
        headers: { Authorization: `Bearer ${user.jwt}`, 'Content-Type': 'application/json' },
      }
    )
    if (res.status === 200) {
      setSelectedImage3('')
      setSelectedFile3(undefined)
    }
  }

  if (!hasMounted) return null
  return (
    <section className={styles.wrapper}>
      <Head>
        <title>{`${fullName || user?.user?.fullName}, ${city || user?.user?.city}, ${
          age || user?.user?.age
        } - хочет познакомиться. Скейд (Skade) - знакомства для осознанных, состоятельных мужчин и честных девушек.`}</title>
      </Head>
      <div className={styles.photoBlock}>
        <div className={styles.nameAndPayment}>
          <h1
            className={cn(
              styles.userFullName,
              router?.pathname !== '/profile' && user?.user?.gender === 'male'
                ? styles.userFullName_man
                : user?.user?.gender === 'female'
                ? styles.userFullName_woman
                : ''
            )}
          >
            {fullName || user?.user?.fullName}
          </h1>
          <div className={styles.payment}>
            {router?.pathname === '/profile' &&
              (!user?.user?.isPaidService ||
                (user.user?.gender === 'male' && !user.user.isPaidMan)) && (
                <p>при оплате укажите email регистрации</p>
              )}
            <div className={styles.iframeBtns}>
              {router?.pathname === '/profile' &&
                user.user?.gender === 'male' &&
                !user.user.isPaidMan && (
                  <iframe
                    src="https://widgets.freekassa.ru?type=payment-button&currency=RUB&destination=Оплата аккаунта&theme=light&default_amount=5000&button_text=Оплатить аккаунт&button_size=24px&shopId=36370&s=4a8a56838fa9c0c96d98bb43be6fdee3"
                    width="300"
                    height="50"
                  ></iframe>
                )}
              {router?.pathname === '/profile' && !user?.user?.isPaidService && (
                <iframe
                  src="https://widgets.freekassa.ru?type=payment-button&currency=RUB&destination=Оплата услуги&theme=light&default_amount=500&button_text=Оплатить услугу&button_size=24px&shopId=36370&s=42936c22133ff6e7b09591193e63814d"
                  width="300"
                  height="50"
                ></iframe>
              )}
            </div>
          </div>
        </div>

        {/* <button onClick={handleCreatePaymentUrl}>сформировать ссылку</button> */}
        <div className={styles.photoWrapper}>
          <div
            className={styles.mainImg}
            style={{
              backgroundImage: `url(${mainImg})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div className={styles.asideImgWrapper}>
            <div className={styles.asideImg}>
              <label
                onMouseEnter={handleHoverImg1}
                className={cn(
                  router?.pathname === '/profile' && user?.user?.gender === 'female'
                    ? styles.imgLabel_anfas
                    : styles.imgLabel
                )}
                style={
                  selectedFile1 || selectedImage1
                    ? {
                        backgroundImage: `url(${selectedImage1})`,
                        backgroundSize: '100%',
                      }
                    : {}
                }
              >
                {router?.pathname === '/profile' && (
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    required
                    onChange={({ target }) => {
                      if (target.files) {
                        const file = target.files[0]
                        setSelectedImage1(URL.createObjectURL(file))
                        setSelectedFile1(file)
                      }
                    }}
                  />
                )}
              </label>
              {router?.pathname === '/profile' && (photo1 || user?.user?.photo1) && (
                <button className={styles.deletePhotoIcon} onClick={handleDeletePhoto1}>
                  удалить
                </button>
              )}
            </div>
            <div className={styles.asideImg}>
              <label
                className={cn(
                  router?.pathname === '/profile' && user?.user?.gender === 'female'
                    ? styles.imgLabel_full
                    : styles.imgLabel
                )}
                onMouseEnter={handleHoverImg2}
                style={
                  selectedFile2 || selectedImage2
                    ? { backgroundImage: `url(${selectedImage2})`, backgroundSize: '100%' }
                    : {}
                }
              >
                {router?.pathname === '/profile' && (
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    required
                    onChange={({ target }) => {
                      if (target.files) {
                        const file = target.files[0]
                        setSelectedImage2(URL.createObjectURL(file))
                        setSelectedFile2(file)
                      }
                    }}
                  />
                )}
              </label>
              {router?.pathname === '/profile' && (photo2 || user?.user?.photo2) && (
                <button className={styles.deletePhotoIcon} onClick={handleDeletePhoto2}>
                  удалить
                </button>
              )}
            </div>
            <div className={styles.asideImg}>
              <label
                className={cn(
                  router?.pathname === '/profile' && user?.user?.gender === 'female'
                    ? styles.imgLabel_any
                    : styles.imgLabel
                )}
                onMouseEnter={handleHoverImg3}
                style={
                  selectedFile3 || selectedImage3
                    ? { backgroundImage: `url(${selectedImage3})`, backgroundSize: '100%' }
                    : {}
                }
              >
                {router?.pathname === '/profile' && (
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    required
                    onChange={({ target }) => {
                      if (target.files) {
                        const file = target.files[0]
                        setSelectedImage3(URL.createObjectURL(file))
                        setSelectedFile3(file)
                      }
                    }}
                  />
                )}
              </label>
              {router?.pathname === '/profile' && (photo3 || user?.user?.photo3) && (
                <button className={styles.deletePhotoIcon} onClick={handleDeletePhoto3}>
                  удалить
                </button>
              )}
            </div>

            {router?.pathname === '/profile' && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className={styles.uploadPhotosBtn}
                style={{ opacity: uploading ? '.5' : '1' }}
              >
                {uploading ? 'Загружаю...' : 'Загрузить выбранные фото'}
              </button>
            )}
          </div>
        </div>
        {router?.query?.userId != user?.user?.id && router?.pathname !== '/profile' && (
          <div className={styles.buttonsContainer}>
            <button onClick={handleClickAddFavourite} disabled={isFavorite}>
              В избранное
            </button>
            <button onClick={handleClickMessage} disabled={isDisabled}>
              Написать
            </button>
          </div>
        )}
        {user?.user?.gender === 'female' &&
          (!user?.user?.photo1 || !user?.user?.photo2 || !user?.user?.photo3) &&
          router?.pathname === '/profile' && (
            <p className={styles.warning}>загрузите фотографии, чтобы начать общаться</p>
          )}
        {user?.user?.gender === 'male' &&
          !user?.user?.isPaidMan &&
          router?.pathname === '/profile' && (
            <p className={styles.warning}>оплатите аккаунт, чтобы начать общаться</p>
          )}
      </div>
      <div className={styles.metaBlock}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
          <div className={styles.about}>
            <h2>О себе:</h2>
            {isEditing ? (
              <textarea
                maxLength={350}
                className={styles.aboutEdit}
                placeholder="Введите описание"
                {...register('description')}
                defaultValue={user?.user?.description}
              />
            ) : router?.pathname === '/profile' ? (
              user?.user?.description && <p>{user?.user?.description}</p>
            ) : (
              description && <p>{description}</p>
            )}
          </div>

          <h2>Данные:</h2>
          <ul className={styles.metaNumbers}>
            <li className={styles.metaItem}>
              <div className={styles.attributeName}>возраст</div>
              {isEditing ? (
                <input
                  className={styles.input}
                  type="number"
                  {...register('age')}
                  defaultValue={user?.user?.age}
                />
              ) : router?.pathname === '/profile' ? (
                user?.user?.age && <p>{user?.user?.age}</p>
              ) : (
                age && <p>{age}</p>
              )}
            </li>

            <li className={styles.metaItem}>
              <div className={styles.attributeName}>рост</div>
              {isEditing ? (
                <input
                  className={styles.input}
                  type="number"
                  {...register('height')}
                  defaultValue={
                    user?.user?.manAttributes?.height || user?.user?.womanAttributes?.height
                  }
                />
              ) : router?.pathname === '/profile' ? (
                (user?.user?.manAttributes || user?.user?.womanAttributes) && (
                  <p>{user?.user?.manAttributes?.height || user?.user?.womanAttributes?.height}</p>
                )
              ) : (
                (manAttributes || womanAttributes) && (
                  <p>{manAttributes?.height || womanAttributes?.height}</p>
                )
              )}
            </li>
            <li className={styles.metaItem}>
              <div className={styles.attributeName}>вес</div>
              {isEditing ? (
                <input
                  className={styles.input}
                  type="number"
                  {...register('weight')}
                  defaultValue={
                    user?.user?.manAttributes?.weight || user?.user?.womanAttributes?.weight
                  }
                />
              ) : router?.pathname === '/profile' ? (
                (user?.user?.manAttributes || user?.user?.womanAttributes) && (
                  <p>{user?.user?.manAttributes?.weight || user?.user?.womanAttributes?.weight}</p>
                )
              ) : (
                (manAttributes || womanAttributes) && (
                  <p>{manAttributes?.weight || womanAttributes?.weight}</p>
                )
              )}
            </li>
            <li className={styles.metaItem}>
              <div className={styles.attributeName}>цвет волос</div>
              {isEditing ? (
                <select
                  {...register('hair')}
                  className={styles.select}
                  defaultValue={user?.user?.hair}
                >
                  <option value="брюнет">--Цвет волос*</option>
                  <option value="блонд">блонд</option>
                  <option value="брюнет">брюнет</option>
                  <option value="шатен">шатен</option>
                  <option value="рыжий">рыжий</option>
                  <option value="русый">русый</option>
                  <option value="седой">седой</option>
                </select>
              ) : router?.pathname === '/profile' ? (
                user?.user?.hair && <p>{user?.user?.hair}</p>
              ) : (
                hair && <p>{hair}</p>
              )}
            </li>
            <li className={styles.metaItem}>
              <div className={styles.attributeName}>город</div>
              {isEditing ? (
                <select
                  {...register('city')}
                  className={styles.select}
                  defaultValue={user?.user?.city}
                >
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
              ) : router?.pathname === '/profile' ? (
                user?.user?.city && <p>{user?.user?.city}</p>
              ) : (
                city && <p>{city}</p>
              )}
            </li>
            {router?.pathname === '/profile' && (
              <>
                {user?.user?.gender === 'male' && (
                  <li className={styles.metaItem}>
                    <div className={styles.attributeName}>доход</div>
                    {isEditing && user?.user?.isPaidService ? (
                      <input
                        className={styles.input}
                        min={1000}
                        max={2000000}
                        type="number"
                        {...register('salary')}
                        defaultValue={user?.user?.manAttributes?.salary}
                      />
                    ) : (
                      <p>{user?.user?.manAttributes?.salary}</p>
                    )}
                  </li>
                )}

                {user?.user?.gender === 'female' && (
                  <li className={styles.metaItem}>
                    <div className={styles.attributeName}>доход от</div>
                    {isEditing && user?.user?.isPaidService ? (
                      <input
                        min={1000}
                        max={2000000}
                        className={styles.input}
                        type="number"
                        {...register('minDesiredSalary')}
                        defaultValue={user?.user?.womanAttributes?.minDesiredSalary}
                      />
                    ) : (
                      <p>{user?.user?.womanAttributes?.minDesiredSalary}</p>
                    )}
                  </li>
                )}
              </>
            )}
          </ul>
          {router?.pathname === '/profile' && (
            <div className={styles.changeDataBtn}>
              {isEditing && (
                <button type="button" onClick={handleCancelEdit}>
                  Отменить
                </button>
              )}
              {isEditing && <button type="submit">Сохранить</button>}

              {!isEditing && (
                <button type="button" onClick={handleEdit}>
                  Изменить данные
                </button>
              )}
            </div>
          )}
        </form>
        {isEditing && (
          <>
            {user?.user?.isPaidService ? (
              <p className={styles.warning_green}>услуга оплачена, можете изменить доход</p>
            ) : (
              <p className={styles.warning}>изменение дохода платно, оплатите услугу</p>
            )}
          </>
        )}
        <ul className={styles.favorites}>
          {router?.pathname === '/profile' &&
            !!user?.user?.favorites?.length &&
            user?.user?.favorites?.map((favorite: any) =>
              user?.user?.gender === 'male' ? (
                <Link href={`/users/${favorite?.id}`}>
                  <div className={styles.favouriteImg}>
                    <Image
                      src={favorite?.photo1 ? favorite?.photo1 : '/girl.png'}
                      alt={favorite?.fullName}
                      fill
                    />
                  </div>
                </Link>
              ) : (
                <Link href={`/users/${favorite?.id}`}>{favorite?.fullName}</Link>
              )
            )}
        </ul>
      </div>
    </section>
  )
}

export default React.memo(Profile)
