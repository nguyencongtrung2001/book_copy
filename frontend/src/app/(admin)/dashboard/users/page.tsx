"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  RotateCcw, 
  Edit, 
  Eye, 
  Trash2 
} from "lucide-react";

// 1. Định nghĩa Interface cho dữ liệu Người dùng
interface User {
  maNguoiDung: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  diaChi: string;
  vaiTro: string;
  ngayTao: string;
}

export default function UserManagementPage() {
  // Giả lập dữ liệu (Thực tế sẽ fetch từ API)
  const [users, setUsers] = useState<User[]>([
    {
      maNguoiDung: "U001",
      hoTen: "Nguyễn Công Trung",
      email: "trung.nc@gmail.com",
      soDienThoai: "0905123456",
      diaChi: "48 Cao Thắng, Đà Nẵng",
      vaiTro: "Admin",
      ngayTao: "01/01/2024",
    },
    {
      maNguoiDung: "U002",
      hoTen: "Bùi Xuân Văn",
      email: "vanbx@gmail.com",
      soDienThoai: "0905654321",
      diaChi: "Lạc Long Quân, Hà Nội",
      vaiTro: "KhachHang",
      ngayTao: "02/01/2024",
    },
  ]);

  return (
    <div className="min-h-screen bg-[#1A202C] p-4 md:p-8 font-inter text-[#E2E8F0]">
      <h2 className="text-center text-3xl font-bold text-[#4FD1C5] mb-8 uppercase tracking-widest italic">
        Danh Sách Người Dùng Trong Hệ Thống
      </h2>

      {/* Search & Filter Wrapper */}
      <div className="bg-[#2D3748] p-6 rounded-2xl mb-8 shadow-2xl border border-[#4A5568]">
        <form className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-62.5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên, email, SĐT..."
              className="w-full bg-[#1A202C] border border-[#4A5568] rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#4FD1C5] transition-all"
            />
          </div>
          
          <div className="w-full md:w-52">
            <select className="w-full bg-[#1A202C] border border-[#4A5568] rounded-xl px-4 py-3 outline-none focus:border-[#4FD1C5] cursor-pointer">
              <option value="">-- Tất cả vai trò --</option>
              <option value="Admin">Quản trị viên (Admin)</option>
              <option value="KhachHang">Khách hàng</option>
            </select>
          </div>

          <button className="bg-[#4FD1C5] text-[#1A202C] px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#38B2AC] transition-all transform active:scale-95 shadow-lg shadow-[#4FD1C5]/20">
            <Filter size={18} /> LỌC
          </button>
          
          <button type="button" className="text-[#A0AEC0] hover:text-white flex items-center gap-1 ml-2 transition-colors">
            <RotateCcw size={16} /> Làm mới
          </button>

          <div className="ml-auto w-full lg:w-auto mt-4 lg:mt-0">
            <Link
              href="/admin/users/create"
              className="flex items-center justify-center gap-2 bg-linear-to-r from-[#10B981] to-[#059669] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1 active:scale-95"
            >
              <PlusCircle size={20} />
              Thêm Người Dùng Mới
            </Link>
          </div>
        </form>
      </div>

      {/* User Table */}
      <div className="overflow-hidden bg-[#2D3748] rounded-2xl border border-[#4A5568] shadow-2xl mb-20">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#1A202C] text-[#4FD1C5]">
              <tr className="uppercase tracking-wider font-bold">
                <th className="px-6 py-5 border border-[#4A5568]">Họ Tên</th>
                <th className="px-6 py-5 border border-[#4A5568]">Email</th>
                <th className="px-6 py-5 border border-[#4A5568]">Số Điện Thoại</th>
                <th className="px-6 py-5 border border-[#4A5568]">Địa Chỉ</th>
                <th className="px-6 py-5 border border-[#4A5568]">Vai Trò</th>
                <th className="px-6 py-5 border border-[#4A5568]">Ngày Tạo</th>
                <th className="px-6 py-5 border border-[#4A5568] text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4A5568]">
              {users.map((user) => (
                <tr key={user.maNguoiDung} className="hover:bg-[#3D4A5E] transition-colors group">
                  <td className="px-6 py-4 font-medium border border-[#4A5568]">{user.hoTen}</td>
                  <td className="px-6 py-4 border border-[#4A5568] text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 border border-[#4A5568]">{user.soDienThoai}</td>
                  <td className="px-6 py-4 border border-[#4A5568] max-w-xs truncate">{user.diaChi}</td>
                  <td className="px-6 py-4 border border-[#4A5568]">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${user.vaiTro === 'Admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                      {user.vaiTro}
                    </span>
                  </td>
                  <td className="px-6 py-4 border border-[#4A5568] text-[#A0AEC0]">{user.ngayTao}</td>
                  <td className="px-6 py-4 border border-[#4A5568]">
                    <div className="flex justify-center items-center gap-2">
                      <Link 
                        href={`/admin/users/edit/${user.maNguoiDung}`} 
                        className="bg-[#FCD34D] p-2 rounded-lg text-[#1A202C] hover:bg-[#FBBF24] transition-all transform hover:-translate-y-1 shadow-md"
                        title="Sửa"
                      >
                        <Edit size={16} />
                      </Link>
                      <Link 
                        href={`/admin/users/details/${user.maNguoiDung}`} 
                        className="bg-[#60A5FA] p-2 rounded-lg text-white hover:bg-[#3B82F6] transition-all transform hover:-translate-y-1 shadow-md"
                        title="Chi tiết"
                      >
                        <Eye size={16} />
                      </Link>
                      <button 
                        className="bg-[#EF4444] p-2 rounded-lg text-white hover:bg-[#DC2626] transition-all transform hover:-translate-y-1 shadow-md"
                        title="Xóa"
                        onClick={() => confirm('Bạn có chắc chắn muốn xóa người dùng này?')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}