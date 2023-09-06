import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import '@/styles/embla.css'
import '@/styles/globals.css'

import { useHasMounted } from '../hooks/useHasMounted'
import { persistor, store } from '../store/store'

export default function App({ Component, pageProps }: AppProps) {
  const hasMounted = useHasMounted()
  return (
    <Provider store={store}>
      {hasMounted ? (
        <PersistGate persistor={persistor} loading={null}>
          <Component {...pageProps} />
        </PersistGate>
      ) : (
        <Component {...pageProps} />
      )}
    </Provider>
  )
}
