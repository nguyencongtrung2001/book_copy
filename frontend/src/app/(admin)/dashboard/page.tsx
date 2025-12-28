"use client";

import React, { useMemo } from 'react';
import { getCurrentUser } from '@/api/auth';
import { Users, BookOpen, ShoppingCart, DollarSign } from 'lucide-react';

const DashboardPage = () => {
  // Use useMemo instead of useState + useEffect to avoid cascading renders
  const userName = useMemo(() => {
    const user = getCurrentUser();
    return user ? user.fullname : 'Admin';
  }, []);

  const stats = [
    { title: 'Tổng người dùng', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { title: 'Tổng sách', value: '789', icon: BookOpen, color: 'bg-green-500' },
    { title: 'Đơn hàng', value: '456', icon: ShoppingCart, color: 'bg-purple-500' },
    { title: 'Doanh thu', value: '123M', icon: DollarSign, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Chào mừng, {userName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Đây là trang quản trị của nhà sách UTE
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">
                    {stat.value}
                  </h3>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Hoạt động gần đây
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div>
                <p className="font-medium">Đơn hàng mới #00{item}</p>
                <p className="text-sm text-gray-500">2 phút trước</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                Mới
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;