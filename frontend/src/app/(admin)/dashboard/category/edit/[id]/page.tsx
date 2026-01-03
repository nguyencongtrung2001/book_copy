"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Save, ChevronLeft } from 'lucide-react';

// 1. Định nghĩa Interface cho dữ liệu Form
interface CategoryFormInput {
  maTheLoai: string;
  tenTheLoai: string;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams(); // Lấy ID từ URL
  const { id } = params;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CategoryFormInput>();

  // 2. Giả lập tải dữ liệu cũ từ server khi trang load
  useEffect(() => {
    // Trong thực tế sẽ gọi: const data = await getCategoryById(id);
    if (id) {
      // Giả lập dữ liệu trả về
      setValue("maTheLoai", id as string);
      setValue("tenTheLoai", "Tên thể loại cũ"); 
    }
  }, [id, setValue]);

  // 3. Hàm xử lý cập nhật dữ liệu
  const onSubmit = async (data: CategoryFormInput) => {
    console.log("Dữ liệu cập nhật:", data);
    try {
      // await axios.put(`/api/categories/${id}`, data);
      alert("Cập nhật thể loại thành công!");
      router.push('/admin/categories');
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi lưu thay đổi.");
    }
  };

  return (
    <div className="min-h-screen bg-[#1A202C] py-12 px-4 font-inter text-[#E2E8F0]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[#A0AEC0] text-3xl font-bold text-center mb-8 uppercase tracking-wide">
          Chỉnh Sửa Thể Loại
        </h2>

        {/* Form Container */}
        <div className="bg-[#2D3748] rounded-xl shadow-2xl p-8 max-w-150 mx-auto border border-white/5 animate-in fade-in duration-500">
          <div className="border-b border-white/10 pb-4 mb-8">
            <h4 className="text-xl font-semibold text-[#A0AEC0] text-center">
              Thông tin Thể Loại
            </h4>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Mã Thể Loại (Readonly) */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
              <label className="md:basis-1/4 text-[#A0AEC0] font-semibold md:text-right md:pr-6">
                Mã Thể Loại:
              </label>
              <div className="md:basis-3/4">
                <input
                  {...register("maTheLoai")}
                  readOnly
                  className="w-full bg-[#1A202C]/50 border border-white/10 text-gray-400 rounded-lg px-4 py-2.5 cursor-not-allowed outline-none italic font-mono"
                />
              </div>
            </div>

            {/* Tên Thể Loại */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
              <label className="md:basis-1/4 text-[#A0AEC0] font-semibold md:text-right md:pr-6">
                Tên Thể Loại:
              </label>
              <div className="md:basis-3/4">
                <input
                  {...register("tenTheLoai", { required: "Tên thể loại không được để trống" })}
                  placeholder="Nhập tên thể loại mới"
                  className={`w-full bg-[#1A202C] border ${errors.tenTheLoai ? 'border-red-500' : 'border-white/10'} text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#60A5FA] focus:ring-2 focus:ring-[#60A5FA]/25 transition-all`}
                />
                {errors.tenTheLoai && (
                  <span className="text-red-500 text-xs mt-1 block font-medium">
                    {errors.tenTheLoai.message}
                  </span>
                )}
              </div>
            </div>

            {/* Nút Hành Động */}
            <div className="md:flex pt-4">
              <div className="md:basis-1/4"></div>
              <div className="md:basis-3/4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-[#28a745] hover:bg-[#218838] text-white font-bold py-3 px-10 rounded-lg shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Back Link */}
        <div className="mt-10 text-center">
          <Link 
            href="/admin/categories" 
            className="inline-flex items-center gap-2 text-[#60A5FA] font-bold hover:text-[#3B82F6] hover:underline px-6 py-2 rounded-lg border border-transparent hover:border-[#60A5FA]/30 transition-all"
          >
            <ChevronLeft size={20} />
            Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
}