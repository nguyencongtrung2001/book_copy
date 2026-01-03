"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Eye, 
  Check, 
  Truck, 
  Trash2, 
  Filter, 
  RotateCcw, 
  AlertCircle 
} from 'lucide-react';

import OrderStats from '@/components/admin/OrderStats';
// 1. Định nghĩa Kiểu dữ liệu
type OrderStatus = "ChoXacNhan" | "DangXuLy" | "DangGiao" | "DaGiao" | "DaHuy";

interface Order {
  id: string;
  customerName: string;
  address: string;
  createdAt: string;
  total: number;
  status: OrderStatus;
}

export default function OrderManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<{id: string, nextStatus: OrderStatus, message: string} | null>(null);

  // Giả lập dữ liệu
  const mockOrders: Order[] = [
    { id: "DH123", customerName: "Nguyễn Công Trung", address: "48 Cao Thắng, Đà Nẵng", createdAt: "2023-12-03 14:20", total: 450000, status: "ChoXacNhan" },
    { id: "DH124", customerName: "Bùi Xuân Văn", address: "Lạc Long Quân, Hà Nội", createdAt: "2023-12-03 15:10", total: 1250000, status: "DangXuLy" },
  ];

  const mockStats = [
    { label: "Chờ xác nhận", count: 5, amount: 2400000, color: "bg-slate-500" },
    { label: "Đang xử lý", count: 3, amount: 4500000, color: "bg-yellow-500" },
    { label: "Đang giao", count: 8, amount: 7200000, color: "bg-blue-500" },
    { label: "Đã giao", count: 150, amount: 145000000, color: "bg-green-500" },
    { label: "Đã hủy", count: 12, amount: 8900000, color: "bg-red-500" },
  ];

  const getStatusBadge = (status: OrderStatus) => {
    const styles: Record<OrderStatus, string> = {
      ChoXacNhan: "bg-slate-700 text-slate-100",
      DangXuLy: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50",
      DangGiao: "bg-blue-500/20 text-blue-400 border border-blue-500/50",
      DaGiao: "bg-green-500/20 text-green-400 border border-green-500/50",
      DaHuy: "bg-red-500/20 text-red-400 border border-red-500/50",
    };
    const labels: Record<OrderStatus, string> = {
      ChoXacNhan: "Chờ xác nhận", DangXuLy: "Đang xử lý", DangGiao: "Đang giao hàng", DaGiao: "Đã giao", DaHuy: "Đã hủy"
    };
    return <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${styles[status]}`}>{labels[status]}</span>;
  };

  const openConfirm = (id: string, nextStatus: OrderStatus, message: string) => {
    setPendingOrder({ id, nextStatus, message });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-[#1A202C] min-h-screen p-6 font-inter text-[#E2E8F0]">
      <h2 className="text-center text-3xl font-extrabold text-[#4FD1C5] mb-10 tracking-widest uppercase italic">
        Quản Lý Đơn Hàng
      </h2>

      {/* Stats Components */}
      <OrderStats stats={mockStats} />

      {/* Filter Section */}
      <div className="bg-[#2D3748] p-6 rounded-2xl mb-8 border border-[#4A5568] shadow-2xl">
        <form className="flex flex-wrap gap-4 items-center">
          <input 
            type="text" 
            placeholder="Mã đơn hoặc tên khách hàng..." 
            className="grow bg-[#1A202C] border border-[#4A5568] rounded-xl px-5 py-3 outline-none focus:border-[#4FD1C5] transition-all"
          />
          <select className="bg-[#1A202C] border border-[#4A5568] rounded-xl px-5 py-3 outline-none focus:border-[#4FD1C5]">
            <option value="">-- Tất cả trạng thái --</option>
            <option value="ChoXacNhan">Chờ xác nhận</option>
            <option value="DangXuLy">Đang xử lý</option>
          </select>
          <button className="bg-[#4FD1C5] text-[#1A202C] px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#38B2AC] transition-all transform active:scale-95">
            <Filter size={18} /> LỌC
          </button>
          <button type="button" className="text-[#A0AEC0] hover:text-white flex items-center gap-1 ml-2 transition-colors">
            <RotateCcw size={16} /> Làm mới
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden bg-[#2D3748] rounded-2xl border border-[#4A5568] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="bg-[#1A202C] text-[#4FD1C5]">
              <tr>
                <th className="px-6 py-5 font-bold uppercase tracking-wider">STT</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider">Mã ĐH</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider">Khách Hàng</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-left">Địa Chỉ Giao</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider">Ngày Tạo</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider">Tổng Tiền</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider">Trạng Thái</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4A5568]">
              {mockOrders.map((order, idx) => (
                <tr key={order.id} className="hover:bg-[#344054] transition-colors group">
                  <td className="px-6 py-4">{idx + 1}</td>
                  <td className="px-6 py-4 font-black text-[#4FD1C5]">{order.id}</td>
                  <td className="px-6 py-4 font-medium">{order.customerName}</td>
                  <td className="px-6 py-4 text-left max-w-xs wrap-break-words">{order.address}</td>
                  <td className="px-6 py-4 text-[#A0AEC0]">{order.createdAt}</td>
                  <td className="px-6 py-4 font-bold">{order.total.toLocaleString()}₫</td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-3">
                      <Link href={`/admin/orders/${order.id}`} className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition-all shadow-lg" title="Chi tiết">
                        <Eye size={16} />
                      </Link>
                      
                      {order.status === "ChoXacNhan" && (
                        <button 
                          onClick={() => openConfirm(order.id, "DangXuLy", "Xác nhận đơn hàng này?")}
                          className="bg-green-600 p-2 rounded-lg hover:bg-green-700 transition-all shadow-lg flex items-center gap-1 px-3"
                        >
                          <Check size={16} /> <span className="font-bold text-[10px] uppercase">Xác nhận</span>
                        </button>
                      )}

                      {order.status === "DangXuLy" && (
                        <button 
                          onClick={() => openConfirm(order.id, "DangGiao", "Chuyển đơn hàng sang giao hàng?")}
                          className="bg-orange-600 p-2 rounded-lg hover:bg-orange-700 transition-all shadow-lg flex items-center gap-1 px-3"
                        >
                          <Truck size={16} /> <span className="font-bold text-[10px] uppercase">Giao hàng</span>
                        </button>
                      )}

                      {(order.status === "DaGiao" || order.status === "DaHuy") && (
                        <button className="bg-red-600 p-2 rounded-lg hover:bg-red-700 transition-all shadow-lg">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#2D3748] border border-[#4A5568] p-10 rounded-3xl max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <AlertCircle size={60} className="mx-auto text-[#4FD1C5] mb-6" />
            <h3 className="text-xl font-bold mb-2">Xác Nhận Thay Đổi</h3>
            <p className="text-[#A0AEC0] mb-8">{pendingOrder?.message}</p>
            <div className="flex gap-4">
              <button 
                onClick={() => { setIsModalOpen(false); alert(`Đã cập nhật ${pendingOrder?.id}`); }}
                className="flex-1 bg-green-600 py-3 rounded-xl font-bold hover:bg-green-700 transition-all"
              >
                Đồng Ý
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-[#4A5568] py-3 rounded-xl font-bold hover:bg-[#718096] transition-all"
              >
                Hủy Bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}