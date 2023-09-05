import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'

import loginUserReducer from './slices/login-user.slice'

const userPersistConfig = {
  key: 'user',
  storage,
}

const persistedUserReducer = persistReducer(userPersistConfig, loginUserReducer)

export const store = configureStore({
  reducer: {
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
