"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  PlusCircle, 
  ArrowLeftCircle, 
  Edit, 
  Eye, 
  Trash2 
} from "lucide-react";

// 1. Định nghĩa Interface cho Thể Loại
interface Category {
  maTheLoai: string;
  tenTheLoai: string;
  soLoaiSach: number;
  tongSachTheoTheLoai: number;
}

const CategoryManagement = () => {
  // Giả lập dữ liệu từ ViewModel (Sau này sẽ fetch từ API)
  const [categories, setCategories] = useState<Category[]>([
    {
      maTheLoai: "TL01",
      tenTheLoai: "Công nghệ thông tin",
      soLoaiSach: 25,
      tongSachTheoTheLoai: 1500,
    },
    {
      maTheLoai: "TL02",
      tenTheLoai: "Kinh tế & Tài chính",
      soLoaiSach: 15,
      tongSachTheoTheLoai: 800,
    },
    {
      maTheLoai: "TL03",
      tenTheLoai: "Văn học nghệ thuật",
      soLoaiSach: 40,
      tongSachTheoTheLoai: 2100,
    },
  ]);

  const handleDelete = (id: string) => {
    if (confirm("Xác nhận xóa thể loại này?")) {
      setCategories(categories.filter((c) => c.maTheLoai !== id));
    }
  };

  return (
    <div className="container-fluid p-4 md:p-6 bg-[#1A202C] min-h-screen text-white font-inter">
      <h2 className="text-[#A0AEC0] text-3xl font-bold text-center mb-8 pt-4 uppercase tracking-wide">
        Quản Lý Thể Loại Sách
      </h2>

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Link
          href="/dashboard/products"
          className="flex items-center justify-center gap-2 bg-[#007bff] hover:bg-[#0056b3] text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-md hover:-translate-y-0.5 active:scale-95"
        >
          <ArrowLeftCircle size={20} />
          Quay Lại
        </Link>
        <Link
          href="/dashboard/category/create"
          className="flex items-center justify-center gap-2 bg-[#4CAF50] hover:bg-[#45a049] text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-md hover:-translate-y-0.5 active:scale-95"
        >
          <PlusCircle size={20} />
          Thêm Thể Loại Mới
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-[#2D3748] rounded-xl shadow-xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse min-w-175">
            <thead className="bg-[#1A202C] text-[#A0AEC0] uppercase font-bold text-xs tracking-wider">
              <tr>
                <th className="px-4 py-4 w-[8%] border-b border-gray-700">STT</th>
                <th className="px-4 py-4 w-[35%] border-b border-gray-700 text-left">Tên thể loại</th>
                <th className="px-4 py-4 w-[17%] border-b border-gray-700">Số sách khác nhau</th>
                <th className="px-4 py-4 w-[17%] border-b border-gray-700">Tổng tồn kho</th>
                <th className="px-4 py-4 w-[23%] border-b border-gray-700 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {categories.length > 0 ? (
                categories.map((item, index) => (
                  <tr
                    key={item.maTheLoai}
                    className="hover:bg-[#3D4A5E] transition-colors group"
                  >
                    <td className="px-4 py-4">{index + 1}</td>
                    <td className="px-4 py-4 text-left font-medium text-white group-hover:text-[#4FD1C5]">
                      {item.tenTheLoai}
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      {item.soLoaiSach.toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      {item.tongSachTheoTheLoai.toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2 action-buttons">
                        <Link
                          href={`/dashboard/categories/edit/${item.maTheLoai}`}
                          className="p-1.5 bg-[#FCD34D] hover:bg-[#FBBF24] text-[#1A202C] rounded transition-all shadow-sm"
                          title="Sửa"
                        >
                          <Edit size={14} />
                        </Link>
                        <Link
                          href={`/dashboard/categories/details/${item.maTheLoai}`}
                          className="p-1.5 bg-[#60A5FA] hover:bg-[#3B82F6] text-white rounded transition-all shadow-sm"
                          title="Chi tiết"
                        >
                          <Eye size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.maTheLoai)}
                          className="p-1.5 bg-[#F29F05] hover:bg-[#DB8A00] text-white rounded transition-all shadow-sm"
                          title="Xóa"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-20 text-center text-gray-500 text-lg italic bg-[#2D3748]"
                  >
                    Không có dữ liệu thể loại sách nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;