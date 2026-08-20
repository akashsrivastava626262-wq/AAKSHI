'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hydrateAuth } from '@/store/authSlice';

function AuthHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);
  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthHydrator>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1A1A1A',
              color: '#FFFEF9',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#B76E79', secondary: '#FFFEF9' } },
          }}
        />
      </AuthHydrator>
    </Provider>
  );
}
