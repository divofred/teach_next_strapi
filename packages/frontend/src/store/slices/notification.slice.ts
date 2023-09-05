import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  hasNewMessage: false,
  unreadMessages: 0,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      state.hasNewMessage = action?.payload?.hasNewMessage
      state.unreadMessages = action?.payload?.unreadMessages
    },
  },
})

export const { setNotification } = notificationSlice.actions

export default notificationSlice.reducer
