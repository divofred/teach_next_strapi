import { getCookie } from 'cookies-next'
import { decodeJwt } from 'jose'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useState } from 'react'
import React from 'react'

import { client } from '@/src/lib/client'

import { useActions } from '@/src/hooks/useActions'
import { useHasMounted } from '@/src/hooks/useHasMounted'
import { useTypedSelector } from '@/src/hooks/useTypedSelector'

import styles from './Nav.module.scss'

const Nav: FC = () => {
  const user = useTypedSelector((state) => state.user)
  const cookie = getCookie('token')
  const { logoutUser, setUser } = useActions()
  const hasMounted = useHasMounted()
  const [logined, setLogined] = useState<boolean>()

  const loginChecker = useCallback(async () => {
    if (user?.jwt && cookie) {
      setLogined(true)
    } else if (!cookie || !user?.jwt) {
      setLogined(false)
      return logoutUser()
    }
    try {
      const userCookie = decodeJwt(cookie.toString())
      if (userCookie && !user?.jwt) {
        setLogined(false)
        return logoutUser()
      }
    } catch (e) {
      setLogined(false)
      logoutUser()
    }
  }, [logoutUser])

  const handleClickLogout = () => {
    if (user?.jwt && cookie) {
      setLogined(false)
      return logoutUser()
    } else return
  }

  useEffect(() => {
    loginChecker()
  }, [loginChecker])

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

  if (!hasMounted) return null
  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li className={styles.navLink}>
          <Link href={'/'}>Search pokemon</Link>
        </li>
        <li className={styles.navLink}>
          <Link href={cookie ? '/chats' : '/signin'}>Messages</Link>
        </li>
        <li className={styles.navLink}>
          <Link href={cookie ? '/profile' : '/signin'}>Profile</Link>
        </li>
        <li onClick={handleClickLogout} className={styles.navLink}>
          <Link href="/signin">{logined ? 'Logout' : 'Login'}</Link>
        </li>
      </ul>
    </nav>
  )
}
export default React.memo(Nav)
