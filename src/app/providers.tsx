/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const client = new QueryClient();

export function Providers({ children }: any) {
  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}