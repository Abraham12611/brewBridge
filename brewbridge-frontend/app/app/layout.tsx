'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Toaster } from 'sonner';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0F1116]">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}