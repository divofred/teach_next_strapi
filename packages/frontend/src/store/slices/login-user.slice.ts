import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { deleteCookie } from 'cookies-next'

import { loginType, User } from '@/src/types/types'

const initialState: loginType = {
  jwt: null,
  user: null,
}

export const loginUserSlice = createSlice({
  name: 'loginUser',
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<{ user?: User }>) => {
      if (payload.user) {
        state.user = payload?.user
      }
    },
    setJwt: (state, { payload }: PayloadAction<{ jwt?: string }>) => {
      if (payload.jwt) {
        state.jwt = payload?.jwt
      }
    },
    logoutUser(state) {
      state.user = null
      state.jwt = null
      deleteCookie('token')
    },
  },
})

export const { setUser, logoutUser, setJwt } = loginUserSlice.actions
export default loginUserSlice.reducer
