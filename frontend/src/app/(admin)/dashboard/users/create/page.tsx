"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { 
  UserPlus, 
  ChevronLeft, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Calendar 
} from "lucide-react";

// Định nghĩa kiểu dữ liệu cho Form
interface UserFormInput {
  maNguoiDung: string;
  hoTen: string;
  email: string;
  matKhau: string;
  soDienThoai: string;
  diaChi: string;
  vaiTro: string;
  ngayTao: string;
}

export default function CreateUserPage() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormInput>({
    defaultValues: {
      vaiTro: "User",
      ngayTao: new Date().toISOString().split("T")[0], // Mặc định là ngày hôm nay
    },
  });

  const onSubmit = async (data: UserFormInput) => {
    console.log("Dữ liệu tạo người dùng:", data);
    // Tại đây bạn sẽ gọi API xử lý
    // await axios.post('/api/users', data);
    alert("Thêm người dùng thành công!");
    router.push("/dashboard/users");
  };

  return (
    <div className="min-h-screen bg-[#1A202C] py-10 px-4 font-inter text-[#E2E8F0] flex flex-col items-center">
      {/* Card chứa form */}
      <div className="w-full max-w-200 bg-[#2D3748] rounded-2xl shadow-2xl p-6 md:p-10 border border-white/5 transition-transform  hover:-translate-y-1 animate-in fade-in zoom-in duration-500">
        
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#4FD1C5] mb-6 uppercase tracking-widest flex items-center justify-center gap-3">
          <UserPlus size={32} />
          Tạo Tài Khoản Mới
        </h2>

        <hr className="border-[#4A5568] mb-8" />

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Mã Người Dùng */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#A0AEC0] flex items-center gap-2">
              <ShieldCheck size={16} /> Mã Người Dùng
            </label>
            <input
              {...register("maNguoiDung", { required: "Vui lòng nhập mã người dùng" })}
              placeholder="Nhập mã (VD: ND001)"
              className="w-full bg-[#1A202C] border border-[#4A5568] rounded-lg px-4 py-3 focus:outline-none focus:border-[#4FD1C5] transition-all"
            />
            {errors.maNguoiDung && <span className="text-red-500 text-xs">{errors.maNguoiDung.message}</span>}
          </div>

          {/* Họ Tên */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#A0AEC0] flex items-center gap-2">
              <UserIcon size={16} /> Họ Tên
            </label>
            <input
              {...register("hoTen", { required: "Họ tên không được để trống" })}
              placeholder="Nhập họ và tên"
              className="w-full bg-[#1A202C] border border-[#4A5568] rounded-lg px-4 py-3 focus:outline-none focus:border-[#4FD1C5] transition-all"
            />
            {errors.hoTen && <span className="text-red-500 text-xs">{errors.hoTen.message}</span>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#A0AEC0] flex items-center gap-2">
              <Mail size={16} /> Email
            </label>
            <input
              type="email"
              {...register("email", { 
                required: "Vui lòng nhập email",
                pattern: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" }
              })}
              placeholder="example@gmail.com"
              className="w-full bg-[#1A202C] border border-[#4A5568] rounded-lg px-4 py-3 focus:outline-none focus:border-[#4FD1C5] transition-all"
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>

          {/* Mật Khẩu */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#A0AEC0] flex items-center gap-2">
              <Lock size={16} /> Mật Khẩu
            </label>
            <input
              type="password"
              {...register("matKhau", { required: "Mật khẩu không được để trống", minLength: { value: 6, message: "Tối thiểu 6 ký tự" } })}
              placeholder="••••••••"
              className="w-full bg-[#1A202C] border border-[#4A5568] rounded-lg px-4 py-3 focus:outline-none focus:border-[#4FD1C5] transition-all"
            />
            {errors.matKhau && <span className="text-red-500 text-xs">{errors.matKhau.message}</span>}
          </div>

          {/* Số Điện Thoại */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#A0AEC0] flex items-center gap-2">
              <Phone size={16} /> Số Điện Thoại
            </label>
            <input
              type="tel"
              {...register("soDienThoai")}
              placeholder="09xx xxx xxx"
              className="w-full bg-[#1A202C] border border-[#4A5568] rounded-lg px-4 py-3 focus:outline-none focus:border-[#4FD1C5] transition-all"
            />
          </div>

          {/* Địa Chỉ */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#A0AEC0] flex items-center gap-2">
              <MapPin size={16} /> Địa Chỉ
            </label>
            <input
              {...register("diaChi")}
              placeholder="Nhập địa chỉ cư trú"
              className="w-full bg-[#1A202C] border border-[#4A5568] rounded-lg px-4 py-3 focus:outline-none focus:border-[#4FD1C5] transition-all"
            />
          </div>

          {/* Vai Trò */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#A0AEC0] flex items-center gap-2">
              <ShieldCheck size={16} /> Vai Trò
            </label>
            <select
              {...register("vaiTro")}
              className="w-full bg-[#1A202C] border border-[#4A5568] rounded-lg px-4 py-3 focus:outline-none focus:border-[#4FD1C5] transition-all cursor-pointer appearance-none"
            >
              <option value="Admin">Quản trị viên (Admin)</option>
              <option value="User">Người dùng (User)</option>
            </select>
          </div>

          {/* Ngày Tạo */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#A0AEC0] flex items-center gap-2">
              <Calendar size={16} /> Ngày Tạo
            </label>
            <input
              type="date"
              {...register("ngayTao")}
              className="w-full bg-[#1A202C] border border-[#4A5568] rounded-lg px-4 py-3 focus:outline-none focus:border-[#4FD1C5] transition-all"
            />
          </div>

          {/* Nút Submit */}
          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-4 bg-linear-to-r from-[#4FD1C5] to-[#38B2AC] text-[#1A202C] font-bold text-lg rounded-xl shadow-lg shadow-[#4FD1C5]/20 hover:brightness-110 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang xử lý..." : "THÊM NGƯỜI DÙNG"}
            </button>
          </div>
        </form>
      </div>

      {/* Nút Quay Lại */}
      <div className="mt-8">
        <Link 
          href="/dashboard/users" 
          className="flex items-center gap-2 text-[#63B3ED] font-semibold hover:text-[#4299E1] transition-colors"
        >
          <ChevronLeft size={20} /> Quay lại danh sách
        </Link>
      </div>
    </div>
  );
}