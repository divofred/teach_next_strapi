import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

import { client } from '@/src/lib/client'

import { useActions } from '@/src/hooks/useActions'
import { useHasMounted } from '@/src/hooks/useHasMounted'
import { useTypedSelector } from '@/src/hooks/useTypedSelector'

import styles from './Chats.module.scss'

const Chats: React.FC = () => {
  const user = useTypedSelector((state) => state.user)
  const router = useRouter()
  const messageContainerRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!user?.user || !user?.jwt) {
      router.push('/signin')
    }
  }, [])
  return (
    <section className={styles.wrapper}>
      <div className={styles.userList}>
        <h2>Диалоги:</h2>
      </div>
      <div className={styles.messageBlock}>
        <ul ref={messageContainerRef}></ul>
        <input type="text" />
        <button className={styles.sendMsg}>Отправить сообщение</button>
      </div>
    </section>
  )
}
export default React.memo(Chats)
