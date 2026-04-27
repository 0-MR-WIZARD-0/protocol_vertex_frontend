/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getMe } from '../../shared/api/auth';
import { useAuthStore } from '../../shared/store/useAuthStore';

export function ClientAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const user = await getMe();

      if (!user && pathname !== '/login') {
        router.replace('/login');
        return;
      }

      if (user && pathname === '/login') {
        router.replace('/dashboard');
      }

      setUser(user);
      setLoading(false);
    };

    init();
  }, [pathname]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}