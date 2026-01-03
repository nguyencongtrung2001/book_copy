"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { 
  Trash2, 
  ChevronLeft, 
  AlertCircle, 
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
  Lock
} from "lucide-react";

// Định nghĩa kiểu dữ liệu người dùng
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

export default function DeleteUserPage() {
  const router = useRouter();
  const params = useParams();
  const [isDeleting, setIsDeleting] = useState(false);

  // Giả lập dữ liệu fetch từ API dựa trên params.id
  const [user] = useState<UserDetail>({
    maNguoiDung: params.id as string,
    hoTen: "Nguyễn Công Trung",
    email: "trung.nc@gmail.com",
    matKhau: "********",
    soDienThoai: "0905123456",
    diaChi: "48 Cao Thắng, Đà Nẵng",
    vaiTro: "Khách hàng",
    ngayTao: "01/01/2024",
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      console.log("Xóa người dùng ID:", user.maNguoiDung);
      // await axios.delete(`/api/users/${user.maNguoiDung}`);
      alert(`Đã xóa người dùng ${user.hoTen} thành công!`);
      router.push("/dashboard/users");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi xóa người dùng.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A202C] py-10 px-4 font-inter text-[#E2E8F0] flex flex-col items-center">
      {/* Container chính (Card) */}
      <div className="w-full max-w-200 bg-[#2D3748] rounded-2xl shadow-2xl p-6 md:p-10 border border-red-500/20 transition-all hover:shadow-red-500/5 animate-in fade-in zoom-in duration-500">
        
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#4FD1C5] mb-6 uppercase tracking-widest flex items-center justify-center gap-3">
          <Trash2 size={32} className="text-red-500" />
          Xóa Người Dùng
        </h2>

        {/* Thông báo xác nhận */}
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500 p-4 rounded-xl mb-8">
          <AlertCircle className="text-red-500 shrink-0" size={24} />
          <p className="text-red-500 font-medium text-sm md:text-base">
            Bạn có chắc chắn muốn xóa người dùng <strong className="underline">{user.hoTen}</strong> không? Hành động này không thể hoàn tác.
          </p>
        </div>

        <hr className="border-[#4A5568] mb-8" />

        {/* Danh sách chi tiết */}
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12">
          <DetailItem icon={<UserIcon size={18} />} label="Họ Tên" value={user.hoTen} />
          <DetailItem icon={<Mail size={18} />} label="Email" value={user.email} />
          <DetailItem icon={<Lock size={18} />} label="Mật Khẩu" value={user.matKhau} />
          <DetailItem icon={<Phone size={18} />} label="Số Điện Thoại" value={user.soDienThoai} />
          <DetailItem icon={<MapPin size={18} />} label="Địa Chỉ" value={user.diaChi} className="md:col-span-2" />
          <DetailItem icon={<Shield size={18} />} label="Vai Trò" value={user.vaiTro} />
          <DetailItem icon={<Calendar size={18} />} label="Ngày Tạo" value={user.ngayTao} />
        </dl>

        {/* Nhóm nút hành động */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full sm:w-auto px-10 py-4 bg-linear-to-r from-red-500 to-red-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-red-500/20 hover:brightness-110 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50"
          >
            {isDeleting ? "Đang xóa..." : "XÁC NHẬN XÓA"}
          </button>

          <Link
            href="/dashboard/users"
            className="w-full sm:w-auto px-10 py-4 bg-linear-to-r from-blue-400 to-blue-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/20 hover:brightness-110 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2"
          >
            <ChevronLeft size={20} />
            Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
}

// Component phụ hiển thị từng mục chi tiết
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
    <div className={`flex flex-col gap-1 border-b border-[#4A5568] pb-2 ${className}`}>
      <dt className="text-sm font-semibold text-[#A0AEC0] flex items-center gap-2 uppercase tracking-tighter">
        {icon} {label}
      </dt>
      <dd className="text-white font-medium text-base pl-7">
        {value || "---"}
      </dd>
    </div>
  );
}