"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { 
  UserCog, 
  ChevronLeft, 
  Eye, 
  EyeOff, 
  Save,
  Mail,
  Phone,
  Calendar
} from "lucide-react";

// 1. Định nghĩa Interface cho dữ liệu Người dùng
interface UserEditInput {
  maNguoiDung: string;
  hoTen: string;
  email: string;
  matKhau: string;
  soDienThoai: string;
  diaChi: string;
  vaiTro: string;
  ngayTao: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [showPassword, setShowPassword] = useState(false);

  // 2. Khởi tạo React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserEditInput>();

  // 3. Giả lập tải dữ liệu người dùng từ Database dựa trên ID
  useEffect(() => {
    // Trong thực tế sẽ gọi: const response = await fetch(`/api/users/${id}`);
    const mockUserData = {
      maNguoiDung: id as string,
      hoTen: "Nguyễn Công Trung",
      email: "trung.nc@gmail.com",
      matKhau: "123456",
      soDienThoai: "0905123456",
      diaChi: "48 Cao Thắng, Đà Nẵng",
      vaiTro: "Admin",
      ngayTao: "2024-01-01",
    };

    // Điền dữ liệu vào form
    Object.keys(mockUserData).forEach((key) => {
      setValue(key as keyof UserEditInput, mockUserData[key as keyof typeof mockUserData]);
    });
  }, [id, setValue]);

  const onSubmit = async (data: UserEditInput) => {
    console.log("Dữ liệu cập nhật:", data);
    try {
      // await axios.put(`/api/users/${id}`, data);
      alert("Cập nhật thông tin thành công!");
      router.push("/dashboard/users");
    } catch (error) {
      console.log('Cập nhập không thành công ')
      alert("Có lỗi xảy ra khi cập nhật.");
    }
  };

  return (
    <div className="min-h-screen bg-[#1A202C] py-10 px-4 font-inter text-[#E2E8F0] flex flex-col items-center">
      <div className="w-full max-w-200 bg-[#2D3748] rounded-2xl shadow-2xl p-8 md:p-10 border border-white/5 transition-all hover:-translate-y-1 animate-in fade-in duration-500">
        
        <h2 className="text-center text-3xl font-bold text-[#4FD1C5] mb-8 uppercase tracking-widest flex items-center justify-center gap-3">
          <UserCog size={32} />
          Chỉnh Sửa Người Dùng
        </h2>

        <hr className="border-[#4A5568] mb-8" />

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Họ Tên */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#A0AEC0]">Họ Tên</label>
            <input
              {...register("hoTen", { required: "Họ tên không được để trống" })}
              placeholder="Nhập họ tên"
              className="w-full bg-[#2D3748] border border-[#4A5568] rounded-lg px-4 py-3 focus:outline-none focus:border-[#4FD1C5] transition-all"
            />
            {errors.hoTen && <span className="text-red-500 text-xs">{errors.hoTen.message}</span>}
          </div>

          {/* Email: Readonly */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#A0AEC0] flex items-center gap-2">
               <Mail size={14}/> Email (Không thể sửa)
            </label>
            <input
              {...register("email")}
              readOnly
              className="w-full bg-[#1A202C] border border-[#4A5568] rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed outline-none"
            />
          </div>

          {/* Mật Khẩu: Toggle visibility */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#A0AEC0]">Mật Khẩu</label>
            <div className="relative">
              <input
                {...register("matKhau", { required: "Mật khẩu không được để trống" })}
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                className="w-full bg-[#2D3748] border border-[#4A5568] rounded-lg px-4 py-3 focus:outline-none focus:border-[#4FD1C5] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4FD1C5] hover:text-[#38B2AC]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.matKhau && <span className="text-red-500 text-xs">{errors.matKhau.message}</span>}
          </div>

          {/* Số Điện Thoại: Readonly */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#A0AEC0] flex items-center gap-2">
              <Phone size={14}/> Số Điện Thoại (Không thể sửa)
            </label>
            <input
              {...register("soDienThoai")}
              readOnly
              className="w-full bg-[#1A202C] border border-[#4A5568] rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed outline-none"
            />
          </div>

          {/* Địa Chỉ */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-[#A0AEC0]">Địa Chỉ</label>
            <input
              {...register("diaChi")}
              placeholder="Nhập địa chỉ"
              className="w-full bg-[#2D3748] border border-[#4A5568] rounded-lg px-4 py-3 focus:outline-none focus:border-[#4FD1C5] transition-all"
            />
          </div>

          {/* Vai Trò */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#A0AEC0]">Vai Trò</label>
            <select
              {...register("vaiTro")}
              className="w-full bg-[#2D3748] border border-[#4A5568] rounded-lg px-4 py-3 focus:outline-none focus:border-[#4FD1C5] transition-all cursor-pointer appearance-none"
            >
              <option value="KhachHang">Khách Hàng</option>
              <option value="Admin">Quản Trị Viên (Admin)</option>
            </select>
          </div>

          {/* Ngày Tạo: Readonly */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#A0AEC0] flex items-center gap-2">
              <Calendar size={14}/> Ngày Tạo (Không thể sửa)
            </label>
            <input
              {...register("ngayTao")}
              readOnly
              className="w-full bg-[#1A202C] border border-[#4A5568] rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-4 bg-linear-to-r from-[#4FD1C5] to-[#38B2AC] text-[#1A202C] font-bold text-lg rounded-xl shadow-lg shadow-[#4FD1C5]/20 hover:brightness-110 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Save size={20} />
                {isSubmitting ? "ĐANG LƯU..." : "LƯU THAY ĐỔI"}
              </div>
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 text-center">
        <Link 
          href="/dashboard/users" 
          className="inline-flex items-center gap-2 text-[#63B3ED] font-bold hover:text-[#4299E1] transition-all"
        >
          <ChevronLeft size={20} />
          Quay lại danh sách
        </Link>
      </div>
    </div>
  );
}