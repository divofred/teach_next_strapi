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
  // const context: any = useContext(SocketContext);
  const user = useTypedSelector((state) => state.user)
  const notification = useTypedSelector((state) => state.notification)
  const router = useRouter()
  const [socket, setSocket] = useState<any>()
  const [usersList, setUsersList] = useState<any>([])
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<any>([])
  const [messageId, setMessageId] = useState<string>('')
  const { setChat, setNotification } = useActions()
  const hasMounted = useHasMounted()
  const messageContainerRef = useRef<HTMLUListElement>(null)
  const isDisabled =
    !user?.currentChat ||
    user?.user?.banned?.some((obj) => obj.id === user?.currentChat?.id) ||
    (user?.user?.gender === 'male' && !user?.user?.isPaidMan) ||
    (user?.user?.gender === 'female' &&
      (!user?.user?.photo1 || !user?.user?.photo2 || !user?.user?.photo3))

  useEffect(() => {
    if (!user?.user || !user?.jwt) {
      router.push('/signin')
    }
  }, [])

  useEffect(() => {
    const CMS_LINK = process.env.CMS_LINK
    if (CMS_LINK) {
      setSocket(io(CMS_LINK))
    } else {
      console.error('Env variable CMS_LINK')
    }
  }, [])

  const handleSend = () => {
    if (user?.user?.id && user?.currentChat?.id && user?.jwt && message && messageId) {
      try {
        if (usersList.length === 0) {
          setUsersList([{ id: user?.currentChat?.id, name: user?.currentChat?.fullName }])
        }
        for (let i = 0; i < usersList.length; i++) {
          const element = usersList[i]
          if (element.name == user?.currentChat?.fullName) {
            throw 'User already exists'
          }
          if (i == usersList.length - 1 && element.name != user?.currentChat?.fullName) {
            setUsersList([
              ...usersList,
              { id: user?.currentChat?.id, name: user?.currentChat?.fullName },
            ])
          }
        }
      } catch (error) {}
      socket.emit(
        'sendMessage',
        {
          currentUserId: user?.user?.id,
          message,
          partnerId: user?.currentChat?.id,
          messageId,
          jwt: user?.jwt,
        },
        (error: any) => {
          if (error) {
            alert(error)
          }
        }
      )
      setMessages([...messages, { sentBy: user?.user?.id, message }])
      setMessage('')
    }
  }

  useEffect(() => {
    if (socket) {
      socket.emit(
        'join',
        {
          partnerName: user?.currentChat?.fullName,
          partnerId: user?.currentChat?.id,
          currentUserId: user?.user?.id,
          jwt: user?.jwt,
        },
        (error: any) => {
          if (error) {
            alert(error)
          }
        }
      )
      socket.on('allMessages', ({ element, messageId: mesId }: any) => {
        setMessages(element)
        setMessageId(mesId)
      })
      socket.on('message', ({ mes, sentBy, element }: any) => {
        setMessages([...element, { sentBy, message: mes }])
        if (sentBy !== user?.user?.id) {
          setNotification({ hasNewMessage: true, unreadMessages: notification?.unreadMessages + 1 })
        }
      })
      socket.emit('getUsers', { currentUserId: user?.user?.id, jwt: user?.jwt }, (error: any) => {
        if (error) {
          alert(error)
        }
      })
      socket.on('allUsers', ({ originalData }: any) => {
        if (!originalData) {
          setUsersList([])
        } else {
          setUsersList(originalData)
        }
      })
    }
  }, [user?.currentChat?.fullName, user?.currentChat?.id, socket])

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleBan = async () => {
    if (!user?.jwt && !user?.user) return router.push('/signin')
    const userBan = await client.put(
      `${process.env.CMS_LINK}/api/users/${user?.user?.id}`,
      {
        banned: {
          connect: [user?.currentChat?.id],
        },
      },
      { headers: { Authorization: `Bearer ${user?.jwt}`, 'Content-Type': 'application/json' } }
    )
    const partnerBan = await client.put(
      `${process.env.CMS_LINK}/api/users/${user?.currentChat?.id}`,
      {
        banned: {
          connect: [user?.user?.id],
        },
      },
      { headers: { Authorization: `Bearer ${user?.jwt}`, 'Content-Type': 'application/json' } }
    )

    if (userBan.status === 200 && partnerBan.status === 200) router.reload()
  }

  const handleChange = (e: any) => {
    setMessage(e.target.value)
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSend()
    }
  }

  if (!hasMounted) return null
  return (
    <section className={styles.wrapper}>
      <div className={styles.userList}>
        <h2>Диалоги:</h2>
        {usersList?.map((user: any) => {
          return (
            <button
              className={styles.user}
              key={user.id}
              onClick={() => {
                setChat({ id: user?.id, fullName: user?.name })
              }}
            >
              {user?.name}
            </button>
          )
        })}
      </div>
      <div className={styles.messageBlock}>
        {user?.currentChat && (
          <Link href={`/users/${user?.currentChat?.id}` || ''}>
            <h1>{user?.currentChat?.fullName}👀</h1>
          </Link>
        )}
        <ul ref={messageContainerRef}>
          {messages?.map((mes: any) => {
            return (
              <li
                className={mes.sentBy == user?.user?.id ? styles.me : styles.companion}
                key={Math.random()}
              >
                {mes.message}
              </li>
            )
          })}
        </ul>
        <input type="text" onChange={handleChange} value={message} onKeyDown={handleKeyDown} />
        <button onClick={handleSend} className={styles.sendMsg} disabled={isDisabled}>
          Отправить сообщение
        </button>
      </div>
      <div className={styles.suggestions}>
        <p>
          Мы только запустились! На сайте действует ограниченное предложение для мужчин:
          <br />
          <br />
          <strong>Навсегда разблокируйте аккаунт за 5000 рублей.</strong>
          <br />
          <br />
          Присоединяйтесь к нам и найдите свою идеальную пару!
        </p>
        {user?.currentChat && (
          <div className={styles.chatBtns}>
            {/* <button disabled={isDisabled}>Договорились о встрече</button> */}
            <button onClick={handleBan} disabled={isDisabled}>
              Заблокировать
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
export default React.memo(Chats)
