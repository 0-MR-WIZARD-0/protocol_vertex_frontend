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
    <div className="h-14 border-b bg-white flex items-center justify-between px-6">
      <h3>Роль: {user?.role}</h3>

      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-600">{user?.email}</p>

        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:underline"
        >
          Выйти
        </button>
      </div>
    </div>
  );
}