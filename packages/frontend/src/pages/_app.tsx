import '@/styles/globals.css';
import '@/styles/embla.css';
import { useState, createContext } from 'react';
import SocketContext from '@/src/components/SocketContext';
import type { AppProps } from 'next/app';
import { useHasMounted } from '../hooks/useHasMounted';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../store/store';

export default function App({ Component, pageProps }: AppProps) {
  const [socket, setSocket] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const hasMounted = useHasMounted();
  return (
    <SocketContext.Provider value={{ socket, setSocket, currentUser, setCurrentUser }}>
      <Provider store={store}>
        {hasMounted ? (
          <PersistGate persistor={persistor} loading={null}>
            <Component {...pageProps} />
          </PersistGate>
        ) : (
          <Component {...pageProps} />
        )}
      </Provider>
    </SocketContext.Provider>
  );
}
