'use client';

import { useAuthStore } from '@/src/shared/store/useAuthStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const path = usePathname();
  const user = useAuthStore((s) => s.user);

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
      <h1 className="text-lg sm:text-xl mb-3 sm:mb-6 font-bold">
        Vertex
      </h1>

      <div className="
        flex sm:flex-col 
        gap-2 
        overflow-x-auto
      ">
        {item('/dashboard', 'Главная')}
        {item('/appeals', 'Обжалования')}
        {user?.role === 'ADMIN' && item('/admin', 'Админ')}
      </div>
    </div>
  );
}