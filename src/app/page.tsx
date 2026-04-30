'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../shared/api/axios';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get('/auth/me');
        setTimeout(() => {
          router.replace('/dashboard');
        }, 4000);
      } catch {
        setTimeout(() => {
          router.replace('/login');
        }, 4000);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-5xl font-bold text-white animate-pulse">
        VERTEX
      </h1>
    </div>
  );
}