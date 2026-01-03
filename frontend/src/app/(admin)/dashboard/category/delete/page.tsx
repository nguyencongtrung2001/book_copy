"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowLeftCircle, AlertTriangle } from 'lucide-react';

// Interface mô phỏng dữ liệu từ Model
interface Category {
  maTheLoai: string;
  tenTheLoai: string;
}

export default function DeleteCategoryPage() {
  const router = useRouter();
  
  // Giả lập dữ liệu thể loại cần xóa (Trong thực tế sẽ fetch theo ID)
  const [category] = useState<Category>({
    maTheLoai: "CNTT",
    tenTheLoai: "Công nghệ thông tin"
  });

  const handleDelete = async () => {
    // Logic gọi API xóa ở đây
    try {
      // await axios.delete(`/api/categories/${category.maTheLoai}`);
      alert("Xóa thể loại thành công!");
      router.push('/admin/categories');
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Không thể xóa thể loại này. Vui lòng kiểm tra lại.");
    }
  };

  return (
    <div className="container-fluid p-4 md:p-6 bg-[#1A202C] min-h-screen text-white font-inter">
      <h2 className="text-[#A0AEC0] text-3xl font-bold text-center mb-8 pt-4 uppercase tracking-wide">
        Xóa Thể Loại
      </h2>

      <div className="delete-container bg-[#2D3748] rounded-xl shadow-2xl p-8 max-w-150 mx-auto border border-red-500 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          <h3 className="text-red-500 text-2xl font-bold text-center leading-tight">
            Bạn có chắc chắn muốn xóa mục này?
          </h3>
        </div>

        <div className="border-t border-white/10 pt-6">
          <h4 className="text-xl font-semibold text-[#A0AEC0] text-center mb-6">
            Thông tin Thể Loại
          </h4>
          
          <dl className="grid grid-cols-[35%_1fr] gap-4 mb-8 text-sm md:text-base">
            <dt className="text-[#A0AEC0] font-bold text-right pr-2">Mã Thể Loại:</dt>
            <dd className="text-white font-medium">{category.maTheLoai}</dd>

            <dt className="text-[#A0AEC0] font-bold text-right pr-2">Tên Thể Loại:</dt>
            <dd className="text-white font-medium">{category.tenTheLoai}</dd>
          </dl>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:-translate-y-1 active:scale-95"
            >
              <Trash2 size={20} />
              Xác Nhận Xóa
            </button>
            
            <Link
              href="/admin/categories"
              className="flex items-center justify-center gap-2 text-[#60A5FA] border border-[#60A5FA]/50 hover:bg-[#60A5FA]/10 px-8 py-3 rounded-lg font-bold transition-all"
            >
              <ArrowLeftCircle size={20} />
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}