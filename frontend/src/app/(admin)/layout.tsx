"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAuthenticated } from '@/api/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra authentication và role
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
      // Nếu không phải admin, redirect về trang chủ
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-800 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <a href="/dashboard" className="block px-6 py-3 hover:bg-slate-700">
            Dashboard
          </a>
          <a href="/dashboard/books" className="block px-6 py-3 hover:bg-slate-700">
            Quản lý sách
          </a>
          <a href="/dashboard/orders" className="block px-6 py-3 hover:bg-slate-700">
            Đơn hàng
          </a>
          <a href="/dashboard/users" className="block px-6 py-3 hover:bg-slate-700">
            Người dùng
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}