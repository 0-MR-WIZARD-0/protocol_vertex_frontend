'use client';

import { api } from '@/src/shared/api/axios';
import { useAuthStore } from '@/src/shared/store/useAuthStore';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function Sidebar() {
  const path = usePathname();
  const user = useAuthStore((s) => s.user);

  const router = useRouter();

  const setUser = useAuthStore((s) => s.setUser);

  const logout =
    async () => {
      try {
        await api.post('/auth/logout');
      } catch {
        //
      }
      localStorage.removeItem('token');
      setUser(null);
      router.push('/login');
  };

  const item = (href: string, label: string) => {
    const isActive = path === href;

    return (
      <Link
        href={href}
        className={`
          px-3 py-2 rounded-lg border text-sm whitespace-nowrap
          ${isActive
            ? 'bg-green-600 text-white border-green-600'
            : 'text-white border-gray-700'}
        `}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="
      w-full sm:w-64 
      border-b sm:border-b-0 sm:border-r 
      p-3 sm:p-4 
      text-white
    ">
      <h1 className="text-lg sm:text-xl font-bold mb-2">
        Vertex
      </h1>
      <p className="text-sm mb-3">Email: {user?.email}</p>
      <div className="
        flex sm:flex-col 
        gap-2 
        overflow-x-auto
        ">
        {item('/dashboard', 'Главная')}
        {item('/notifications', 'Уведомления')}
        {item('/appeals', 'Обжалования')}
        {user?.role === 'ADMIN' && item('/admin', 'Панель управления')}
        {user && (
          <button
            onClick={logout}
            className="
              rounded-lg
              border
              border-red-600
              px-3
              py-2
              text-sm
              text-red-400
              transition
              hover:bg-red-600
              hover:text-white
            "
          >
            Выход
          </button>
        )}
      </div>
    </div>
  );
}