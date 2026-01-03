"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit3, ArrowLeftCircle, ChevronRight, Info } from 'lucide-react';

// Interface mô phỏng dữ liệu từ Model
interface Category {
  maTheLoai: string;
  tenTheLoai: string;
}

export default function CategoryDetailPage() {
  const router = useRouter();
  
  // Giả lập dữ liệu thể loại (Trong thực tế sẽ fetch từ API dựa trên params.id)
  const [category] = useState<Category>({
    maTheLoai: "CNTT",
    tenTheLoai: "Công nghệ thông tin"
  });

  return (
    <div className="container-fluid p-4 md:p-6 bg-[#1A202C] min-h-screen text-white font-inter">
      {/* Page Title */}
      <h2 className="text-[#A0AEC0] text-3xl font-bold text-center mb-8 pt-4 uppercase tracking-wider drop-shadow-md">
        Chi Tiết Thể Loại
      </h2>

      {/* Main Details Container */}
      <div className="max-w-162.5 mx-auto bg-[#2D3748] rounded-xl shadow-2xl p-8 md:p-10 border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="border-b border-white/10 pb-4 mb-8">
          <h4 className="text-xl font-semibold text-[#A0AEC0] text-center flex items-center justify-center gap-2">
            <Info size={24} className="text-[#4FD1C5]" />
            Thông tin Thể Loại
          </h4>
        </div>
        
        {/* Description List using Tailwind Grid */}
        <dl className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-x-8 items-baseline">
          <dt className="text-[#A0AEC0] font-bold md:text-right text-sm md:text-base uppercase tracking-tight">
            Mã Thể Loại:
          </dt>
          <dd className="text-white font-medium text-lg bg-[#1A202C]/50 px-4 py-2 rounded-lg border border-white/5">
            {category.maTheLoai}
          </dd>

          <dt className="text-[#A0AEC0] font-bold md:text-right text-sm md:text-base uppercase tracking-tight">
            Tên Thể Loại:
          </dt>
          <dd className="text-white font-medium text-lg bg-[#1A202C]/50 px-4 py-2 rounded-lg border border-white/5 wrap-break-words">
            {category.tenTheLoai}
          </dd>
        </dl>

        {/* Note Area (Optional extension) */}
        <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg">
           <p className="text-xs text-gray-400 italic text-center">
             * Thông tin này được sử dụng để phân loại sách trong hệ thống cửa hàng.
           </p>
        </div>
      </div>

      {/* Action Buttons Container */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
        <Link
          href={`/admin/categories/edit/${category.maTheLoai}`}
          className="flex items-center justify-center gap-2 bg-[#FCD34D] hover:bg-[#FBBF24] text-[#1A202C] px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
        >
          <Edit3 size={20} />
          Chỉnh Sửa
        </Link>
        
        <Link
          href="/admin/categories"
          className="flex items-center justify-center gap-2 text-[#60A5FA] border border-[#60A5FA] hover:bg-[#60A5FA]/10 px-8 py-3 rounded-lg font-bold transition-all hover:-translate-y-1 w-full sm:w-auto"
        >
          <ArrowLeftCircle size={20} />
          Quay lại danh sách
        </Link>
      </div>
    </div>
  );
}