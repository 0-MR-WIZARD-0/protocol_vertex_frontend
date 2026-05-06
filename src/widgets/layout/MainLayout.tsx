'use client';

import { Sidebar } from '../sidebar/Sidebar';
import { Header } from '../header/Header';

export function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#020817]">

      <Header />

      <div className="block sm:hidden">
        <Sidebar />

        <main className="p-2 overflow-auto">
          {children}
        </main>
      </div>

      <div className="hidden sm:flex">
        <Sidebar />

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

    </div>
  );
}