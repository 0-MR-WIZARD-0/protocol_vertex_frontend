'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const path = usePathname();

  const item = (href: string, label: string) => (
    <Link
      href={href}
      className={`block p-3 rounded-lg ${
        path === href ? 'bg-green-600 text-white' : 'hover:bg-gray-200'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="w-64 bg-white border-r p-4">
      <h1 className="text-xl mb-6 font-bold">Vertex</h1>

      <div className="space-y-2">
        {item('/dashboard', 'Главная')}
        {item('/analytics', 'Аналитика')}
        {item('/appeals', 'Обжалования')}
        {item('/admin', 'Админка')}
      </div>
    </div>
  );
}