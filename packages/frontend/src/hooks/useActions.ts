import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import { logoutUser, setUser, setChat, setJwt } from '../store/slices/login-user.slice'
import { setNotification } from '../store/slices/notification.slice'

export const useActions = () => {
  const dispatch = useDispatch()
  return useMemo(
    () =>
      bindActionCreators(
        {
          logoutUser,
          setNotification,
          setUser,
          setJwt,
          setChat,
        },
        dispatch
      ),
    [dispatch]
  )
}
