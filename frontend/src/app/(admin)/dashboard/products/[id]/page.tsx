"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Star, 
  StarHalf, 
  Edit3, 
  Trash2, 
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

export default function AdminProductDetailPage() {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  // Giả lập dữ liệu Model (Thay bằng API thực tế sau)
  const book = {
    maSach: "S001",
    tenSach: "Lập trình hướng đối tượng với C++",
    gia: 150000,
    urlAnhBia: "/images/cpp-book.jpg",
    tacGia: "Nguyễn Văn A",
    nhaXuatBan: "NXB Giáo Dục",
    namXuatBan: 2023,
    tenTheLoai: "Công nghệ thông tin",
    soLuongTon: 15,
    soLuongDaBan: 45,
    moTa: "Cuốn sách cung cấp kiến thức cơ bản về lập trình hướng đối tượng, các nguyên lý cơ bản và ứng dụng thực tế trong ngôn ngữ C++.",
    ngayTao: "15/10/2023",
    ratingAverage: 4.5,
    danhGia: [
      { id: 1, user: "Bùi Xuân Văn", content: "Sách rất hay và chi tiết!", stars: 5, date: "12/12/2023" },
      { id: 2, user: "Nguyễn Văn Viên", content: "Giao hàng nhanh, đóng gói kỹ.", stars: 4, date: "20/12/2023" }
    ]
  };

  // Hàm render sao đánh giá
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} size={16} className="fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} size={16} className="text-gray-600" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-[#1A202C] min-h-screen p-4 md:p-8 text-[#E2E8F0] font-sans">
      <div className="max-w-6xl mx-auto bg-[#2D3748] rounded-2xl p-6 md:p-10 shadow-2xl border border-gray-700">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/admin/products" className="hover:text-[#4FD1C5] transition-colors">Quản lý sách</Link>
          <ChevronRight size={14} />
          <span className="text-[#4FD1C5] font-medium truncate max-w-50 md:max-w-none">{book.tenSach}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row gap-8 bg-[#252F3F] p-6 rounded-xl mb-8 border border-gray-700 shadow-lg">
              <div className="w-full md:w-[30%] relative h-80 bg-[#1A202C] rounded-lg overflow-hidden group">
                <Image 
                  src={book.urlAnhBia} 
                  alt={book.tenSach} 
                  fill 
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <h1 className="text-3xl font-extrabold text-white leading-tight">{book.tenSach}</h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-400">Giá bán:</span>
                  <h2 className="text-4xl font-black text-[#4FD1C5]">{book.gia.toLocaleString('vi-VN')}đ</h2>
                </div>
                
                <div className="flex items-center gap-3">
                   <div className="flex gap-1">{renderStars(book.ratingAverage)}</div>
                   <span className="text-sm text-gray-400">({book.ratingAverage}/5)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400 font-medium">Mã sách:</span>
                    <span className="bg-[#1A202C] px-2 py-1 rounded text-[#4FD1C5] font-mono">{book.maSach}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400 font-medium">Tác giả:</span>
                    <span className="text-white">{book.tacGia}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400 font-medium">Thể loại:</span>
                    <span className="text-[#F6AD55]">{book.tenTheLoai}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex gap-3 mb-6">
              <button 
                onClick={() => setActiveTab('description')}
                className={`px-8 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === 'description' ? 'bg-[#4FD1C5] text-[#1A202C] shadow-lg shadow-[#4FD1C5]/20' : 'bg-[#3D4A5E] text-gray-400 hover:bg-gray-600'}`}
              >
                MÔ TẢ CHI TIẾT
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`px-8 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === 'reviews' ? 'bg-[#4FD1C5] text-[#1A202C] shadow-lg shadow-[#4FD1C5]/20' : 'bg-[#3D4A5E] text-gray-400 hover:bg-gray-600'}`}
              >
                ĐÁNH GIÁ ({book.danhGia.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="bg-[#252F3F] p-6 md:p-8 rounded-xl border border-gray-700 shadow-inner min-h-75">
              {activeTab === 'description' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 divide-gray-700">
                    <DetailRow label="Nhà xuất bản" value={book.nhaXuatBan} />
                    <DetailRow label="Năm xuất bản" value={book.namXuatBan.toString()} />
                    <DetailRow label="Cập nhật gần nhất" value={book.ngayTao} />
                  </div>
                  <div className="pt-6 mt-6 border-t border-gray-700">
                    <h4 className="text-[#4FD1C5] font-bold mb-3 uppercase text-xs tracking-widest">Tóm tắt nội dung</h4>
                    <p className="text-gray-300 leading-relaxed text-justify">{book.moTa}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {book.danhGia.length > 0 ? book.danhGia.map(dg => (
                    <div key={dg.id} className="flex gap-4 p-4 rounded-lg bg-[#1A202C]/50 border border-gray-700">
                      <div className="w-12 h-12 bg-linear-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center font-bold text-white shrink-0">
                        {dg.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-bold text-white">{dg.user}</h5>
                          <span className="text-[10px] text-gray-500 font-mono">{dg.date}</span>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} size={12} className={i < dg.stars ? "fill-yellow-400 text-yellow-400" : "text-gray-700"} />
                           ))}
                        </div>
                        <p className="text-sm text-gray-400">{dg.content}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-gray-500 py-10 italic">Chưa có đánh giá nào cho cuốn sách này.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Action Panel */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="sticky top-8 space-y-4">
              <div className="bg-[#252F3F] p-6 rounded-xl border border-gray-700 shadow-xl">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-6">Thống kê kho</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center bg-[#1A202C] p-3 rounded-lg">
                    <span className="text-xs text-gray-400">Hiện còn</span>
                    <span className="text-xl font-bold text-[#4FD1C5]">{book.soLuongTon}</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#1A202C] p-3 rounded-lg">
                    <span className="text-xs text-gray-400">Đã bán</span>
                    <span className="text-xl font-bold text-[#F6AD55]">{book.soLuongDaBan}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href={`/admin/products/edit/${book.maSach}`} className="flex items-center justify-center gap-2 w-full bg-[#F6AD55] hover:bg-[#ED8936] text-[#1A202C] py-3 rounded-lg font-bold transition-all transform hover:-translate-y-1">
                    <Edit3 size={18} /> Chỉnh Sửa
                  </Link>
                  <button 
                    onClick={() => confirm('Xác nhận xóa sách này khỏi hệ thống?')}
                    className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold transition-all transform hover:-translate-y-1"
                  >
                    <Trash2 size={18} /> Xóa Sách
                  </button>
                  <Link href="/admin/products" className="flex items-center justify-center gap-2 w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-bold transition-all">
                    <ArrowLeft size={18} /> Quay Lại
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Sub-component cho các dòng thông tin chi tiết
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-3 px-2 rounded hover:bg-[#3D4A5E]/30 transition-colors">
    <span className="text-sm text-gray-400 font-medium">{label}</span>
    <span className="text-sm text-white text-right font-semibold">{value}</span>
  </div>
);