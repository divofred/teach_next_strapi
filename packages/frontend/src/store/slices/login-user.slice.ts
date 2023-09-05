import { User, loginType } from '@/src/types/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { deleteCookie } from 'cookies-next';

const initialState: loginType = {
  jwt: null,
  user: null,
  currentChat: null,
};

export const loginUserSlice = createSlice({
  name: 'loginUser',
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<{ user?: User }>) => {
      if (payload.user) {
        state.user = payload?.user;
      }
    },
    setJwt: (state, { payload }: PayloadAction<{ jwt?: string }>) => {
      if (payload.jwt) {
        state.jwt = payload?.jwt;
      }
    },
    logoutUser(state) {
      state.user = null;
      state.jwt = null;
      state.currentChat = null;
      deleteCookie('token');
    },
    setChat: (state, action: PayloadAction<loginType['currentChat']>) => {
      if (!state?.user && !state?.jwt) return;
      state.currentChat = action?.payload;
    },
  },
});

export const { setUser, logoutUser, setChat, setJwt } = loginUserSlice.actions;
export default loginUserSlice.reducer;
