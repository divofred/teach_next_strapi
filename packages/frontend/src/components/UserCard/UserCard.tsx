import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

import { client } from '@/src/lib/client'

import { useTypedSelector } from '@/src/hooks/useTypedSelector'

import { UserCardTypes } from './_types'
import styles from './UserCard.module.scss'

const UserCard: FC<UserCardTypes> = ({ fullName, id, photo1, city, age, description, banned }) => {
  const user = useTypedSelector((state) => state?.user)
  const strapi_url = process.env.CMS_LINK
  const router = useRouter()

  const isFavorite = user?.user?.favorites?.some((obj) => obj?.id === id)

  const isDisabled =
    user?.user?.banned?.some((obj) => obj.id === id) ||
    banned?.some((obj) => obj.id === user?.user?.id) ||
    user?.user?.gender === 'male' ||
    (user?.user?.gender === 'female' &&
      (!user?.user?.photo1 || !user?.user?.photo2 || !user?.user?.photo3))

  const handleClickAddFavourite = () => {
    if (!user?.jwt || !user?.user) {
      return router.push('/signin')
    }
    client.put(
      `${strapi_url}/api/users/${user?.user?.id}`,
      {
        favorites: {
          connect: [id],
        },
      },
      { headers: { Authorization: `Bearer ${user?.jwt}`, 'Content-Type': 'application/json' } }
    )
  }

  const handleBan = async () => {
    if (!user?.jwt && !user?.user) return router.push('/signin')
    const userBan = await client.put(
      `${strapi_url}/api/users/${user?.user?.id}`,
      {
        banned: {
          connect: [id],
        },
      },
      { headers: { Authorization: `Bearer ${user?.jwt}`, 'Content-Type': 'application/json' } }
    )
    const partnerBan = await client.put(
      `${strapi_url}/api/users/${id}`,
      {
        banned: {
          connect: [user?.user?.id],
        },
      },
      { headers: { Authorization: `Bearer ${user?.jwt}`, 'Content-Type': 'application/json' } }
    )

    if (userBan.status === 200 && partnerBan.status === 200) router.reload()
  }

  const handleClickMessage = () => {
    if (!user?.jwt || !user?.user) {
      return router.push('/signin')
    } else if (user?.jwt && user?.user) {
      return router.push('/chats')
    }
  }

  return (
    <article className={styles.user}>
      <Link href={`/users/${id}`} className={styles.linkContainer}>
        <h2
          className={cn(
            styles.name,
            user?.user?.gender === 'male' ? styles.name_blue : styles.name_red
          )}
        >
          {fullName}
        </h2>
        <h3 className={styles.meta}>
          {city}, {age}
        </h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.img}>
          <Image
            src={photo1?.url ? strapi_url + photo1?.url : '/swiper/avatar.jpg'}
            alt={fullName}
            width={250}
            height={250}
          />
        </div>
      </Link>
      <div className={styles.actions}>
        <button onClick={handleClickMessage} disabled={isDisabled}>
          Message
        </button>
        <button onClick={handleClickAddFavourite} disabled={isFavorite}>
          Save to favorite
        </button>
        <button onClick={handleBan}>Block</button>
      </div>
    </article>
  )
}

export default React.memo(UserCard)
