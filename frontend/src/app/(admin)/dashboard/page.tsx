"use client";
import React from 'react';
import { Users, ShoppingBag, Book } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import DashboardCharts from '@/components/admin/DashboardCharts';

export default function AdminDashboard() {
  // Giả lập dữ liệu từ ViewModel (Sau này bạn fetch từ API)
  const mockData = {
    months: ['T1', 'T2', 'T3', 'T4', 'T5'],
    delivered: [10, 25, 45, 30, 55],
    cancelled: [2, 5, 3, 8, 4],
    revenue: [1500000, 3200000, 4100000, 2900000, 5000000],
    statusCounts: [15, 10, 5, 50, 5] // Theo thứ tự doughnutData.labels
  };

  return (
    <div className="bg-[#1A202C] min-h-screen p-6 md:p-8 flex flex-col gap-8">
      <header className="border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold text-white mb-2">Tổng quan hệ thống</h1>
        <p className="text-white/60 text-sm">
          Cập nhật lúc: {new Date().toLocaleTimeString('vi-VN')} - {new Date().toLocaleDateString('vi-VN')}
        </p>
      </header>

      {/* Stats Grid */}
      <div className="flex flex-wrap gap-6">
        <StatCard 
          title="Tổng người dùng" 
          value={1250} 
          description="Khách: 1200 | Admin: 50" 
          icon={<Users />} 
          variant="primary" 
        />
        <StatCard 
          title="Tổng đơn hàng" 
          value={456} 
          description="Doanh thu dự kiến tăng trưởng tốt" 
          icon={<ShoppingBag />} 
          variant="success" 
        />
        <StatCard 
          title="Kho sách" 
          value={890} 
          description="Tồn: 700 | Đã bán: 190" 
          icon={<Book />} 
          variant="warning" 
        />
      </div>

      {/* Status Detail Section */}
      <div className="bg-[#2D3748] rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-[#E2E8F0] mb-6 border-b border-white/10 pb-4">
          Chi tiết trạng thái đơn hàng
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: 'Chờ xác nhận', val: 15, color: 'text-[#ECC94B]', border: 'border-[#ECC94B]' },
            { label: 'Đang xử lý', val: 10, color: 'text-[#4FD1C5]', border: 'border-[#4FD1C5]' },
            { label: 'Đang giao', val: 5, color: 'text-[#805AD5]', border: 'border-[#805AD5]' },
            { label: 'Đã giao', val: 50, color: 'text-[#48BB78]', border: 'border-[#48BB78]' },
            { label: 'Đã hủy', val: 5, color: 'text-[#F56565]', border: 'border-[#F56565]' },
          ].map((item, idx) => (
            <div key={idx} className={`bg-[#1A202C] p-4 rounded-xl text-center border border-[#4A5568] border-b-4 ${item.border} hover:-translate-y-1 transition-all`}>
              <div className={`text-2xl font-bold ${item.color}`}>{item.val}</div>
              <div className="text-[#EDF2F7] text-[10px] uppercase font-medium">{item.label}</div>
            </div>
          ))}
        </div>

        <DashboardCharts data={mockData} />
      </div>
    </div>
  );
}