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
          block p-3 rounded-lg border transition

          ${isActive 
            ? 'bg-green-600 text-white border-green-600'
            : 'text-white border-gray-700 hover:bg-green-600'
          }
        `}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="w-64 border-r p-4 text-white">
      <h1 className="text-xl mb-6 font-bold">Vertex</h1>

      <div className="space-y-2">
        {item('/dashboard', 'Главная')}
 {/* {item('/analytics', 'Аналитика')}
   {item('/appeals', 'Обжалования')} */}
        {user?.role === 'ADMIN' && item('/admin', 'Админ панель')}
      </div>
    </div>
  );
}