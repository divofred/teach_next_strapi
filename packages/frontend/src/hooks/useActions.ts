import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import { logoutUser, setJwt, setUser } from '../store/slices/login-user.slice'

export const useActions = () => {
  const dispatch = useDispatch()
  return useMemo(
    () =>
      bindActionCreators(
        {
          logoutUser,
          setUser,
          setJwt,
        },
        dispatch
      ),
    [dispatch]
  )
}
