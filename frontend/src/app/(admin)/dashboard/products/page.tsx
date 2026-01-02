"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  PlusCircle, 
  Tags, 
  Filter, 
  RotateCcw, 
  Eye, 
  Edit, 
  Trash2 
} from "lucide-react";

// 1. Định nghĩa Interface cho đối tượng Sách (Book) để thay thế 'any'
interface Book {
  maSach: string;
  anhBia: string;
  tenSach: string;
  theLoai: string;
  maTheLoai: string;
  tacGia: string;
  gia: number;
  daBan: number;
  tonKho: number;
}

const AdminProductManagement = () => {
  // 2. Gán kiểu dữ liệu Book[] cho mảng books
  const [books, setBooks] = useState<Book[]>([
    {
      maSach: "S001",
      anhBia: "/images/cpp-book.jpg",
      tenSach: "Lập trình hướng đối tượng C++",
      theLoai: "Công nghệ thông tin",
      maTheLoai: "IT",
      tacGia: "Nguyễn Văn A",
      gia: 150000,
      daBan: 45,
      tonKho: 120,
    },
    {
      maSach: "S002",
      anhBia: "/images/java-book.jpg",
      tenSach: "Java Core cho người mới bắt đầu",
      theLoai: "Công nghệ thông tin",
      maTheLoai: "IT",
      tacGia: "Trần Thị B",
      gia: 180000,
      daBan: 12,
      tonKho: 8,
    },
  ]);

  const handleDelete = (maSach: string) => {
    if (confirm("Xác nhận xóa sách này?")) {
      setBooks(books.filter((b) => b.maSach !== maSach));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-inter">
      {/* 1. Control Buttons Section */}
      <div className="bg-[#2D3748] p-6 rounded-xl shadow-lg flex flex-wrap gap-4 border border-gray-700">
        <Link
          href="/dashboard/products/add"
          className="flex items-center justify-center gap-2 bg-[#4CAF50] hover:bg-[#45a049] text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-md hover:-translate-y-0.5 active:scale-95"
        >
          <PlusCircle size={20} />
          Thêm Sách Mới
        </Link>
        <Link
          href="/admin/categories"
          className="flex items-center justify-center gap-2 bg-[#007bff] hover:bg-[#0056b3] text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-md hover:-translate-y-0.5 active:scale-95"
        >
          <Tags size={20} />
          Quản Lý Thể Loại
        </Link>
      </div>

      {/* 2. Filter Form Section */}
      <div className="bg-[#2D3748] p-6 rounded-xl shadow-lg border border-gray-700">
        <form className="flex flex-wrap md:flex-nowrap gap-4 items-center">
          <div className="grow relative">
            <input
              type="text"
              placeholder="Tìm tên sách hoặc tác giả..."
              className="w-full bg-[#1A202C] border border-[#4A5568] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#4CAF50] transition-colors"
            />
          </div>

          <select className="w-full md:w-64 bg-[#1A202C] border border-[#4A5568] text-white px-4 py-2.5 rounded-lg outline-none focus:border-[#4CAF50]">
            <option value="">-- Tất cả thể loại --</option>
            <option value="IT">Công nghệ thông tin</option>
            <option value="EDU">Giáo dục</option>
          </select>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-[#4CAF50] hover:bg-[#45a049] text-white px-6 py-2.5 rounded-lg font-bold transition-all"
          >
            <Filter size={18} />
            LỌC
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg font-bold transition-all"
          >
            <RotateCcw size={18} />
            Làm mới
          </button>
        </form>
      </div>

      {/* 3. Table Container Section */}
      <div className="bg-[#2D3748] rounded-xl shadow-xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse min-w-250">
            <thead className="bg-[#1A202C] text-[#A0AEC0] uppercase font-bold text-xs">
              <tr>
                <th className="px-4 py-4 w-[5%] border-b border-gray-700">STT</th>
                <th className="px-4 py-4 w-[10%] border-b border-gray-700">Ảnh bìa</th>
                <th className="px-4 py-4 w-[25%] border-b border-gray-700 text-left">Tên sách</th>
                <th className="px-4 py-4 w-[15%] border-b border-gray-700 text-left">Thể loại</th>
                <th className="px-4 py-4 w-[15%] border-b border-gray-700 text-left">Tác giả</th>
                <th className="px-4 py-4 w-[10%] border-b border-gray-700">Giá</th>
                <th className="px-4 py-4 w-[10%] border-b border-gray-700">Đã bán</th>
                <th className="px-4 py-4 w-[10%] border-b border-gray-700">Tồn kho</th>
                <th className="px-4 py-4 w-[10%] border-b border-gray-700 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {books.length > 0 ? (
                books.map((book, index) => (
                  <tr key={book.maSach} className="hover:bg-[#3D4A5E] transition-colors group">
                    <td className="px-4 py-4">{index + 1}</td>
                    <td className="px-4 py-4">
                      <div className="relative w-10 h-14 mx-auto shadow-md rounded overflow-hidden">
                        <Image
                          src={book.anhBia}
                          alt={book.tenSach}
                          fill
                          className="object-cover"
                          // 3. SỬA LỖI TẠI ĐÂY: Sử dụng placeholder hoặc logic hợp lệ thay cho any
                          placeholder="blur"
                          blurDataURL="/images/sach_default.jpg"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-left font-semibold text-white truncate max-w-xs" title={book.tenSach}>
                      {book.tenSach}
                    </td>
                    <td className="px-4 py-4 text-left text-blue-400">{book.theLoai}</td>
                    <td className="px-4 py-4 text-left">{book.tacGia}</td>
                    <td className="px-4 py-4 font-bold text-green-400 whitespace-nowrap">
                      {book.gia.toLocaleString("vi-VN")} VNĐ
                    </td>
                    <td className="px-4 py-4">{book.daBan}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${book.tonKho < 10 ? "bg-orange-500 text-white" : ""}`}>
                        {book.tonKho}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-1.5">
                        <Link
                          href={`/dashboard/products/detail/${book.maSach}`}
                          className="p-1.5 bg-[#60A5FA] hover:bg-[#3B82F6] text-white rounded transition-colors"
                        >
                          <Eye size={14} />
                        </Link>
                        <Link
                          href={`/dashboard/products/edit/${book.maSach}`}
                          className="p-1.5 bg-[#FCD34D] hover:bg-[#FBBF24] text-[#1A202C] rounded transition-colors"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(book.maSach)}
                          className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-20 text-center text-gray-500 text-lg italic">
                    Không có dữ liệu sách nào được tìm thấy.
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

export default AdminProductManagement;