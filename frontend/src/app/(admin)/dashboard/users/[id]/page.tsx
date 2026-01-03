"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Edit, 
  ArrowLeft,
  Info
} from "lucide-react";

// 1. Định nghĩa Interface cho dữ liệu Người dùng
interface UserDetail {
  maNguoiDung: string;
  hoTen: string;
  email: string;
  matKhau: string;
  soDienThoai: string;
  diaChi: string;
  vaiTro: string;
  ngayTao: string;
}

export default function UserDetailsPage() {
  const params = useParams();
  const id = params.id;

  // Giả lập dữ liệu (Thực tế sẽ fetch từ API dựa trên id)
  const [userData, setUserData] = useState<UserDetail | null>({
    maNguoiDung: id as string,
    hoTen: "Nguyễn Công Trung",
    email: "trung.nc@gmail.com",
    matKhau: "********",
    soDienThoai: "0905123456",
    diaChi: "48 Cao Thắng, Đà Nẵng",
    vaiTro: "Quản trị viên",
    ngayTao: "01/01/2024",
  });

  if (!userData) return <div className="text-white p-10 text-center">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-[#1A202C] py-10 px-4 font-inter text-[#E2E8F0] flex flex-col items-center">
      {/* Container chính (Card) */}
      <div className="w-full max-w-200 bg-[#2D3748] rounded-2xl shadow-2xl p-6 md:p-10 border border-white/5 transition-all hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#4FD1C5] mb-8 uppercase tracking-widest flex items-center justify-center gap-3">
          <Info size={32} />
          Chi Tiết Người Dùng
        </h2>

        <hr className="border-[#4A5568] mb-8" />

        {/* Details List using Grid */}
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12">
          <DetailItem 
            icon={<User size={18} />} 
            label="Họ Tên" 
            value={userData.hoTen} 
          />
          <DetailItem 
            icon={<Mail size={18} />} 
            label="Email" 
            value={userData.email} 
          />
          <DetailItem 
            icon={<Lock size={18} />} 
            label="Mật Khẩu" 
            value={userData.matKhau} 
          />
          <DetailItem 
            icon={<Phone size={18} />} 
            label="Số Điện Thoại" 
            value={userData.soDienThoai} 
          />
          <DetailItem 
            icon={<MapPin size={18} />} 
            label="Địa Chỉ" 
            value={userData.diaChi} 
            className="md:col-span-2" // Địa chỉ dài nên cho chiếm 2 cột
          />
          <DetailItem 
            icon={<ShieldCheck size={18} />} 
            label="Vai Trò" 
            value={userData.vaiTro} 
          />
          <DetailItem 
            icon={<Calendar size={18} />} 
            label="Ngày Tạo" 
            value={userData.ngayTao} 
          />
        </dl>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
          <Link
            href={`/dashboard/users/edit/${userData.maNguoiDung}`}
            className="w-full sm:w-auto px-10 py-3.5 bg-[#FCD34D] hover:bg-[#FBBF24] text-[#1A202C] font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 uppercase text-sm"
          >
            <Edit size={18} />
            Chỉnh Sửa
          </Link>

          <Link
            href="/dashboard/users"
            className="w-full sm:w-auto px-10 py-3.5 bg-linear-to-r from-[#63B3ED] to-[#4299E1] text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 uppercase text-sm"
          >
            <ArrowLeft size={18} />
            Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Component phụ hiển thị từng dòng thông tin
 */
function DetailItem({ 
  icon, 
  label, 
  value, 
  className = "" 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  className?: string 
}) {
  return (
    <div className={`flex flex-col gap-1 border-b border-[#4A5568] pb-3 ${className}`}>
      <dt className="text-xs font-bold text-[#A0AEC0] flex items-center gap-2 uppercase tracking-wider">
        <span className="text-[#4FD1C5]">{icon}</span>
        {label}
      </dt>
      <dd className="text-white font-medium text-base ml-7">
        {value || "---"}
      </dd>
    </div>
  );
}