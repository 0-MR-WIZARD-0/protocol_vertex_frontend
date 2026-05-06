'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../shared/store/useAuthStore';
import { api } from '@/src/shared/api/axios';

export function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const router = useRouter();

  const handleLogout = async () => {
    await api.post('/auth/logout');
    logout();
    router.push('/login');
  };

  return (
    <div className="
      h-14 border-b 
      flex items-center justify-between 
      px-3 sm:px-6 
      text-white text-sm sm:text-base
    ">
      <h3 className="truncate">
        Роль: {user?.role}
      </h3>

      <div className="flex items-center gap-2 sm:gap-4">
        <p className="hidden sm:block text-sm">
          {user?.email}
        </p>

        <button
          onClick={handleLogout}
          className="text-xs sm:text-sm text-red-500"
        >
          Выйти
        </button>
      </div>
    </div>
  );
}