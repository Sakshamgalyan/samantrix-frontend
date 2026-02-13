'use client';

import { store } from '@/store';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            {children}
            <Toaster
                position="top-right"
                expand={true}
                richColors
                closeButton
                theme="light"
                toastOptions={{
                    style: {
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        padding: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    },
                    className: 'sonner-toast',
                }}
            />
        </Provider>
    );
}
