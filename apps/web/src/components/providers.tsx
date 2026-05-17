'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

import { BottomNav } from '@/components/bottom-nav';
import { ApiError } from '@/services/http';
import { useAuthStore } from '@/store/auth.store';

/**
 * Providers globais do client: React Query, revalidação de sessão
 * persistida e o sistema de toasts (feedback visual consistente).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const refresh = useAuthStore((s) => s.refresh);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              // Não reintenta erros de cliente (4xx).
              if (error instanceof ApiError && error.status < 500) return false;
              return failureCount < 2;
            },
          },
        },
      }),
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <BottomNav />
        <Toaster
          position="top-center"
          richColors
          theme="system"
          toastOptions={{ duration: 4000 }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
