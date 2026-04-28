'use client';

import { useAuthStore } from '../../shared/store/useAuthStore';

export function Header() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="h-14 border-b bg-white flex items-center justify-between px-6">
      <h3>Planner</h3>
      <p className="text-sm text-gray-600">{user?.email}</p>
    </div>
  );
}