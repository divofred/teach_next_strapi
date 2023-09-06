import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'

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
        <h2>Dialogues:</h2>
      </div>
      <div className={styles.messageBlock}>
        <ul ref={messageContainerRef}></ul>
        <input type="text" />
        <button className={styles.sendMsg}>Send message</button>
      </div>
    </section>
  )
}
export default React.memo(Chats)
