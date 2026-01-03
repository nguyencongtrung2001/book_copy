"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ChevronLeft, PlusCircle } from 'lucide-react';

// Định nghĩa cấu trúc dữ liệu cho Form
interface CategoryFormInput {
  maTheLoai: string;
  tenTheLoai: string;
}

export default function CreateCategoryPage() {
  const router = useRouter();
  
  // Khởi tạo React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CategoryFormInput>();

  // Hàm xử lý khi nhấn Submit
  const onSubmit = async (data: CategoryFormInput) => {
    console.log("Dữ liệu thể loại mới:", data);
    
    // Giả lập gọi API
    try {
      // await axios.post('/api/categories', data);
      alert("Thêm thể loại thành công!");
      router.push('/admin/categories'); // Quay lại trang danh sách
    } catch (error) {
      console.error("Lỗi khi thêm thể loại:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-[#1A202C] py-12 px-4 font-inter text-[#E2E8F0]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[#A0AEC0] text-3xl font-bold text-center mb-8 uppercase tracking-wide">
          Thêm Mới Thể Loại
        </h2>

        {/* Form Container */}
        <div className="bg-[#2D3748] rounded-xl shadow-2xl p-8 max-w-150 mx-auto border border-gray-700">
          <div className="border-b border-white/10 pb-4 mb-6">
            <h4 className="text-xl font-semibold text-[#A0AEC0] flex items-center gap-2">
              <PlusCircle size={20} className="text-[#4CAF50]" />
              Thông tin Thể Loại
            </h4>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Mã Thể Loại */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
              <label className="md:basis-1/4 text-[#A0AEC0] font-semibold md:text-right md:pr-4">
                Mã Thể Loại
              </label>
              <div className="md:basis-3/4">
                <input
                  {...register("maTheLoai", { required: "Mã thể loại không được để trống" })}
                  placeholder="Nhập mã (VD: IT, EDU...)"
                  className={`w-full bg-[#1A202C] border ${errors.maTheLoai ? 'border-red-500' : 'border-white/10'} text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#60A5FA] focus:ring-2 focus:ring-[#60A5FA]/25 transition-all`}
                />
                {errors.maTheLoai && (
                  <span className="text-red-500 text-xs mt-1 block font-medium">
                    {errors.maTheLoai.message}
                  </span>
                )}
              </div>
            </div>

            {/* Tên Thể Loại */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
              <label className="md:basis-1/4 text-[#A0AEC0] font-semibold md:text-right md:pr-4">
                Tên Thể Loại
              </label>
              <div className="md:basis-3/4">
                <input
                  {...register("tenTheLoai", { required: "Tên thể loại không được để trống" })}
                  placeholder="Nhập tên thể loại sách"
                  className={`w-full bg-[#1A202C] border ${errors.tenTheLoai ? 'border-red-500' : 'border-white/10'} text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#60A5FA] focus:ring-2 focus:ring-[#60A5FA]/25 transition-all`}
                />
                {errors.tenTheLoai && (
                  <span className="text-red-500 text-xs mt-1 block font-medium">
                    {errors.tenTheLoai.message}
                  </span>
                )}
              </div>
            </div>

            {/* Nút Submit */}
            <div className="md:flex">
              <div className="md:basis-1/4"></div>
              <div className="md:basis-3/4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-2.5 px-8 rounded-lg shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:transform-none"
                >
                  {isSubmitting ? "Đang xử lý..." : "Thêm Mới"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link 
            href="/admin/categories" 
            className="inline-flex items-center gap-1 text-[#60A5FA] font-bold hover:text-[#3B82F6] hover:underline transition-all"
          >
            <ChevronLeft size={20} />
            Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
}