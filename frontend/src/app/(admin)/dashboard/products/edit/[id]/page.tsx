"use client";
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Image from 'next/image'; // Đã import và sẽ sử dụng bên dưới
import Link from 'next/link';

interface ProductFormData {
  tenSach: string;
  tacGia: string;
  nhaXuatBan: string;
  namXuatBan: number;
  gia: number;
  soLuongTon: number;
  moTa: string;
  maTheLoai: string;
}

const EditProduct = () => {
  const [preview, setPreview] = useState<string | null>(null); // Sẽ dùng để hiển thị ảnh xem trước
  const { register, handleSubmit } = useForm<ProductFormData>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onEditSubmit: SubmitHandler<ProductFormData> = (data) => {
    console.log("Cập nhật dữ liệu:", data);
    alert("Lưu thay đổi thành công!");
  };

  return (
    <div className="bg-[#1A202C] min-h-screen py-10 px-4 text-gray-100">
      <div className="max-w-5xl mx-auto bg-[#2D3748] rounded-2xl p-8 shadow-2xl border border-gray-700">
        <h2 className="text-center text-3xl font-bold text-[#4FD1C5] mb-10 tracking-widest uppercase">
          Chỉnh Sửa Sách
        </h2>
        
        <form onSubmit={handleSubmit(onEditSubmit)} className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Cột trái: Quản lý ảnh */}
          <div className="md:col-span-4 space-y-6 bg-black/20 p-6 rounded-xl border border-dashed border-gray-600">
            <div className="text-center">
              <label className="block text-sm font-semibold mb-3 italic text-gray-400">Ảnh bìa hiện tại</label>
              <div className="relative h-64 w-full bg-[#1A202C] rounded-lg overflow-hidden border border-gray-700">
                {/* FIX LỖI: Sử dụng component Image của Next.js */}
                <Image 
                  src="/images/book_default.jpg" // Thay bằng đường dẫn ảnh thật từ database nếu có
                  alt="Current Book Cover" 
                  fill 
                  className="object-contain" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#4FD1C5]">Thay đổi ảnh mới</label>
              {/* FIX LỖI: Gắn hàm handleImageChange vào sự kiện onChange */}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange} 
                className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#4FD1C5] file:text-[#1A202C] hover:file:bg-[#38B2AC] cursor-pointer" 
              />
            </div>

            {/* FIX LỖI: Sử dụng biến preview để hiển thị ảnh xem trước khi người dùng chọn file */}
            {preview && (
              <div className="animate-in fade-in duration-500">
                <label className="block text-sm font-semibold mb-3 text-green-400">Ảnh mới đã chọn:</label>
                <div className="relative h-48 w-full bg-[#1A202C] rounded-lg overflow-hidden border-2 border-green-500">
                  <Image src={preview} alt="New Preview" fill className="object-contain" />
                </div>
              </div>
            )}
          </div>

          {/* Cột phải: Form thông tin */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-300 mb-2">Tên Sách</label>
              <input {...register("tenSach")} className="w-full bg-[#2D3748] border border-gray-600 p-3 rounded-lg focus:border-[#4FD1C5] outline-none" />
            </div>
            
            {/* ... Các trường input khác (Tác giả, Giá, v.v.) ... */}

            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700">
              <button type="submit" className="grow bg-linear-to-r from-[#4FD1C5] to-[#38B2AC] text-[#1A202C] font-bold py-4 rounded-xl shadow-lg hover:brightness-110 transition-all uppercase">
                Lưu Thay Đổi
              </button>
              <Link href="/admin/products" className="grow text-center bg-linear-to-r from-[#63B3ED] to-[#4299E1] text-white font-bold py-4 rounded-xl shadow-lg hover:brightness-110 transition-all uppercase flex items-center justify-center">
                Quay Lại
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;