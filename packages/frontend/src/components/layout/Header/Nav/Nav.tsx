import { getCookie } from 'cookies-next'
import { decodeJwt } from 'jose'
import Link from 'next/link'
import { FC, useCallback, useEffect, useState } from 'react'
import React from 'react'
import cn from 'classnames'

import { client } from '@/src/lib/client'

import { useActions } from '@/src/hooks/useActions'
import { useHasMounted } from '@/src/hooks/useHasMounted'
import { useTypedSelector } from '@/src/hooks/useTypedSelector'

import styles from './Nav.module.scss'
import { useRouter } from 'next/router'

const Nav: FC = () => {
  const user = useTypedSelector((state) => state.user)
  const notification = useTypedSelector((state) => state.notification)
  const cookie = getCookie('token')
  const router = useRouter()
  const { logoutUser, setChat, setUser, setNotification } = useActions()
  const hasMounted = useHasMounted()
  const [logined, setLogined] = useState<boolean>()

  const loginChecker = useCallback(async () => {
    if (user?.jwt && cookie) {
      setLogined(true)
    } else if (!cookie || !user?.jwt) {
      setLogined(false)
      setNotification({ hasNewMessage: false, unreadMessages: 0 })
      return logoutUser()
    }
    try {
      const userCookie = decodeJwt(cookie.toString())
      if (userCookie && !user?.jwt) {
        setLogined(false)
        setNotification({ hasNewMessage: false, unreadMessages: 0 })
        return logoutUser()
      }
    } catch (e) {
      setLogined(false)
      setNotification({ hasNewMessage: false, unreadMessages: 0 })
      logoutUser()
    }
  }, [logoutUser])

  const handleClickLogout = () => {
    if (user?.jwt && cookie) {
      setLogined(false)
      setNotification({ hasNewMessage: false, unreadMessages: 0 })
      return logoutUser()
    } else return
  }

  useEffect(() => {
    loginChecker()
  }, [loginChecker])

  useEffect(() => {
    if (router?.pathname !== '/chats') {
      setChat(null as any)
    }
  }, [])

  useEffect(() => {
    if (logined) {
      const fetchData = async () => {
        const data = await client.get('/users/me?populate=*', {
          headers: { Authorization: `Bearer ${user?.jwt}`, 'Content-Type': 'application/json' },
        })
        setUser({ user: data?.data })
      }
      fetchData()
    }
  }, [logined])

  useEffect(() => {
    if (router?.pathname === '/chats') {
      setNotification({ hasNewMessage: false, unreadMessages: 0 })
    }
  }, [])

  if (!hasMounted) return null
  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li className={styles.navLink}>
          <Link href={'/'}>Поиск</Link>
        </li>
        <li className={cn(styles.navLink, notification?.hasNewMessage && styles.blinking)}>
          <Link href={cookie ? '/chats' : '/signin'}>
            Диалоги {notification?.hasNewMessage && `(+${notification?.unreadMessages})`}
          </Link>
        </li>
        <li className={styles.navLink}>
          <Link href={cookie ? '/profile' : '/signin'}>Профиль</Link>
        </li>
        <li onClick={handleClickLogout} className={styles.navLink}>
          <Link href="/signin">{logined ? 'Выйти' : 'Войти'}</Link>
        </li>
      </ul>
    </nav>
  )
}
export default React.memo(Nav)
