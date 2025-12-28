"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UserPen, 
  Book, 
  PackageOpen, 
  Star, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Ban, 
  LibraryBig,
  CheckCircle
} from 'lucide-react';
import Image from 'next/image';

const BookDetailPage = () => {
  const book = {
    maSach: "S001",
    tenSach: "Lập trình hướng đối tượng với C++",
    donGia: 150000,
    hinh: "cpp-book.jpg",
    soLuongTon: 15,
    tacGia: "Nguyễn Văn A",
    moTa: "Cuốn sách cung cấp kiến thức cơ bản về lập trình hướng đối tượng, các nguyên lý cơ bản và ứng dụng thực tế trong ngôn ngữ C++.",
    tenTheLoai: "Công nghệ thông tin"
  };

  const relatedBooks = [
    { maSach: "S002", tenSach: "Cấu trúc dữ liệu & Giải thuật", donGia: 120000, hinh: "/images/data-structure.jpg" },
    { maSach: "S003", tenSach: "Lập trình Java căn bản", donGia: 180000, hinh: "/images/java.jpg" },
    { maSach: "S004", tenSach: "Python cho người mới bắt đầu", donGia: 99000, hinh: "/images/python.jpg" },
  ];

  const [quantity, setQuantity] = useState(book.soLuongTon > 0 ? 1 : 0);
  const [showModal, setShowModal] = useState(false);

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= book.soLuongTon) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (book.soLuongTon > 0) {
      setShowModal(true);
    }
  };

  return (
    <div className="bg-[#f2fbf7] min-h-screen pb-20 font-roboto">
      {/* Header Wave Effect */}
      <div className="relative bg-linear-to-br from-[#ccfbf1]/95 to-[#e0f2fe]/95 pt-16 pb-24 text-center overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#333] mb-4 font-quicksand">
            Chi Tiết Sản Phẩm
          </h1>
          <nav className="flex justify-center space-x-2 text-sm text-gray-500 font-medium">
            <Link href="/" className="hover:text-[#0F9D58] transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-[#0F9D58] font-bold">{book.tenSach}</span>
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full leading-0">
          <svg className="relative block w-[calc(130%+1.3px)] h-17.5" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f2fbf7"></path>
          </svg>
        </div>
      </div>

      {/* Main Product Card */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-[20px] shadow-[0_15px_35px_rgba(15,157,88,0.1)] p-6 md:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            <div className="lg:col-span-5 flex items-center justify-center bg-white rounded-2xl relative min-h-100">
              {book.soLuongTon === 0 && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-2xl">
                  <span className="bg-black/80 text-white px-6 py-2 rounded-lg font-bold text-xl tracking-wider">HẾT HÀNG</span>
                </div>
              )}
              <Image 
                src={`/images/${book.hinh}`} 
                alt={book.tenSach}
                width={400}
                height={600}
                className={`max-h-112.5 w-auto object-contain transition-transform duration-300 hover:scale-105 drop-shadow-2xl ${book.soLuongTon === 0 ? 'grayscale opacity-40' : ''}`}
              />
            </div>

            <div className="lg:col-span-7">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#333] mb-4 font-quicksand leading-tight">
                {book.tenSach}
              </h2>

              <div className="flex flex-wrap gap-3 mb-6">
                <MetaTag icon={<UserPen size={16}/>} label="Tác giả" value={book.tacGia} />
                <MetaTag icon={<Book size={16}/>} label="Thể loại" value={book.tenTheLoai} />
                <div className="bg-[#f8f9fa] border border-gray-100 px-4 py-2 rounded-full flex items-center text-sm">
                  <PackageOpen size={16} className="text-[#0F9D58] mr-2" />
                  <span className="font-bold mr-1 text-gray-700">Tình trạng:</span>
                  {book.soLuongTon > 0 ? (
                    <span className="text-[#0F9D58] font-bold">Còn hàng ({book.soLuongTon})</span>
                  ) : (
                    <span className="text-red-500 font-bold">Hết hàng</span>
                  )}
                </div>
              </div>

              <div className="flex text-yellow-400 mb-6 items-center">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                <span className="text-gray-400 text-sm ml-3">(Đánh giá khách hàng)</span>
              </div>

              <h3 className="text-4xl font-bold text-[#0F9D58] mb-6">
                {book.donGia.toLocaleString('vi-VN')} đ
              </h3>

              <p className="text-gray-500 leading-relaxed mb-8 text-justify">
                {book.moTa}
              </p>

              <hr className="border-gray-100 mb-8" />

              <form onSubmit={handleAddToCart} className="flex flex-wrap items-end gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">Số lượng</label>
                  <div className="flex items-center bg-[#f8f9fa] border border-gray-100 rounded-full p-1 w-fit">
                    <button 
                      type="button" 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={book.soLuongTon === 0}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-[#0F9D58] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus size={16} />
                    </button>
                    <input 
                      type="text" 
                      readOnly 
                      value={quantity}
                      className="w-16 text-center bg-transparent font-bold text-lg outline-none"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleQuantityChange(1)}
                      disabled={book.soLuongTon === 0}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-[#0F9D58] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={book.soLuongTon === 0}
                  className={`flex items-center justify-center gap-2 px-10 py-3.5 rounded-full font-bold text-lg transition-all shadow-lg ${
                    book.soLuongTon > 0 
                    ? 'bg-[#0F9D58] text-white hover:bg-[#0B8043] hover:-translate-y-1 shadow-[#0F9D58]/30' 
                    : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                >
                  {book.soLuongTon > 0 ? (
                    <><ShoppingCart size={20} /> Thêm vào giỏ</>
                  ) : (
                    <><Ban size={20} /> Hết hàng</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Related Books Section */}
      <div className="container mx-auto px-4 mt-20">
        <div className="flex items-center gap-4 mb-10">
          <h3 className="text-2xl font-bold text-[#333] flex items-center whitespace-nowrap font-quicksand">
            <LibraryBig className="text-[#0F9D58] mr-3" /> Sách Cùng Thể Loại
          </h3>
          <div className="h-0.5 bg-gray-200 w-full rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedBooks.map((item) => (
            <div key={item.maSach} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-[#0F9D58]/20">
              <div className="h-64 bg-white relative flex items-center justify-center p-6">
                <Image 
                  src={item.hinh} 
                  alt={item.tenSach}
                  fill
                  className="object-contain p-4 drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-5 bg-white text-center">
                <h4 className="font-bold text-gray-800 truncate mb-2 hover:text-[#0F9D58] transition-colors cursor-pointer">
                  {item.tenSach}
                </h4>
                <p className="text-[#0F9D58] font-bold text-lg">
                  {item.donGia.toLocaleString('vi-VN')} đ
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-[#0F9D58] text-white p-6 text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={40} />
              </div>
              <h5 className="text-xl font-bold">Thành công</h5>
            </div>
            <div className="p-8 text-center text-lg text-gray-600 font-medium">
              Đã thêm sản phẩm vào giỏ hàng!
            </div>
            <div className="p-6 pt-0 flex gap-4 justify-center">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border-2 border-gray-200 text-gray-500 rounded-full font-bold hover:bg-gray-50 transition-all"
              >
                Ở lại trang
              </button>
              <Link 
                href="/"
                className="px-6 py-2 bg-[#0F9D58] text-white rounded-full font-bold hover:bg-[#0B8043] transition-all"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MetaTag = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="bg-[#f8f9fa] border border-gray-100 px-4 py-2 rounded-full flex items-center text-sm shadow-sm">
    <span className="text-[#0F9D58] mr-2">{icon}</span>
    <span className="font-bold mr-1 text-gray-700">{label}:</span>
    <span className="text-gray-500">{value}</span>
  </div>
);

export default BookDetailPage;