import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'
import loginUserReducer from './slices/login-user.slice'
import notificationReducer from './slices/notification.slice'

const userPersistConfig = {
  key: 'user',
  storage,
}

const userNewMessageNotification = {
  key: 'newmessage',
  storage,
}

const persistedUserReducer = persistReducer(userPersistConfig, loginUserReducer)
const persistedNotificationReducer = persistReducer(userNewMessageNotification, notificationReducer)

export const store = configureStore({
  reducer: {
    notification: persistedNotificationReducer,
    user: persistedUserReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(thunk),
})
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
