"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, PlusCircle, Upload } from 'lucide-react';
import Image from 'next/image';

interface BookFormInput {
  tenSach: string;
  tacGia: string;
  nhaXuatBan: string;
  namXuatBan: number;
  gia: number;
  maTheLoai: string;
  soLuongTon: number;
  moTa: string;
}

export default function AddBookPage() {
  const router = useRouter(); // Đã khai báo
  const [preview, setPreview] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<BookFormInput>();

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: BookFormInput) => {
    console.log("Dữ liệu gửi đi:", data);
    // GIẢI QUYẾT LỖI: Sử dụng router để chuyển hướng sau khi hoàn tất
    alert("Thêm sách thành công!");
    router.push('/admin/products'); 
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 font-sans text-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-700">
          <h2 className="text-3xl font-bold text-teal-400 text-center mb-8 uppercase tracking-wider flex items-center justify-center gap-3">
            <PlusCircle size={32} /> Thêm Sách Mới
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">Tên Sách</label>
                  <input
                    {...register("tenSach", { required: "Tên sách không được để trống" })}
                    className={`w-full px-4 py-3 bg-gray-700 border ${errors.tenSach ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:border-teal-400 transition-all`}
                    placeholder="Nhập tên sách"
                  />
                  {errors.tenSach && <p className="text-red-400 text-sm mt-1">{errors.tenSach.message}</p>}
                </div>
                {/* ... Các trường khác giữ nguyên ... */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">Tác Giả</label>
                  <input
                    {...register("tacGia", { required: "Tác giả không được để trống" })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-teal-400"
                    placeholder="Nhập tên tác giả"
                  />
                </div>
              </div>

              <div className="space-y-6">
                 {/* ... Các trường khác giữ nguyên ... */}
                 <div>
                  <label className="flex-block text-gray-300 font-semibold mb-2 flex items-center gap-2">
                    <Upload size={18} /> Ảnh Bìa
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagePreview}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-teal-500 file:text-gray-900 hover:file:bg-teal-600 cursor-pointer"
                  />
                  {preview && (
                    <div className="mt-4 relative w-32 h-48">
                      <Image src={preview} alt="Preview" fill className="object-cover rounded-lg border border-gray-600 shadow-md" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <button type="submit" className="px-10 py-4 bg-linear-to-r from-teal-500 to-teal-600 text-gray-900 font-bold rounded-xl shadow-lg transition-all active:scale-95">
                Thêm Sách
              </button>
              <Link href="/admin/products" className="px-10 py-4 bg-linear-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl shadow-lg transition-all inline-flex items-center justify-center gap-2">
                <ArrowLeft size={20} /> Quay Lại
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}