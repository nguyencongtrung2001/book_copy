"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Minus, 
  Plus, 
  X, 
  ShoppingBasket, 
  Truck, 
  ArrowRight, 
  CheckCircle 
} from 'lucide-react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      maSach: "S001",
      tenSach: "Lập trình hướng đối tượng với C++",
      gia: 150000,
      soLuong: 1,
      urlAnhBia: "/images/cpp-book.jpg"
    },
    {
      maSach: "S002",
      tenSach: "Cấu trúc dữ liệu & Giải thuật",
      gia: 120000,
      soLuong: 2,
      urlAnhBia: "/images/data-structure.jpg"
    }
  ]);

  // FIX: Chỉ giữ lại biến coupon nếu chưa có logic setCoupon để tránh lỗi no-unused-vars
  const [coupon] = useState({ code: "SALE10", percent: 10 }); 
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const shippingFee = 30000;

  const subTotal = cartItems.reduce((acc, item) => acc + (item.gia * item.soLuong), 0);
  const discount = Math.round(subTotal * (coupon.percent / 100));
  const total = subTotal - discount + shippingFee;

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.maSach === id) {
        const newQty = Math.max(1, item.soLuong + delta);
        return { ...item, soLuong: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.maSach !== id));
  };

  return (
    <div className="bg-[#f2fbf7] min-h-screen pb-20 font-roboto">
      {/* FIX: bg-gradient-to-br -> bg-linear-to-br */}
      <div className="relative bg-linear-to-br from-[#ccfbf1]/95 to-[#e0f2fe]/95 pt-16 pb-24 text-center overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#333] mb-4 font-quicksand">
            Giỏ Hàng Của Bạn
          </h1>
          <nav className="flex justify-center space-x-2 text-sm text-gray-500 font-medium">
            <Link href="/" className="hover:text-[#0F9D58] transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-[#0F9D58] font-bold">Giỏ hàng</span>
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full leading-0">
          {/* FIX: h-[70px] -> h-17.5 */}
          <svg className="relative block w-[calc(130%+1.3px)] h-17.5" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f2fbf7"></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(15,157,88,0.1)] overflow-hidden p-4 md:p-6 animate-fade-up">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-50 text-[#0F9D58] font-bold text-sm uppercase tracking-wider">
                      <th className="py-4 px-4">Sản phẩm</th>
                      <th className="py-4 px-4">Đơn giá</th>
                      <th className="py-4 px-4 text-center">Số lượng</th>
                      <th className="py-4 px-4">Thành tiền</th>
                      <th className="py-4 px-4 text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {cartItems.map((item) => (
                      <tr key={item.maSach} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-6 px-4">
                          <div className="flex items-center gap-4">
                            {/* FIX: flex-shrink-0 -> shrink-0 */}
                            <div className="relative w-16 h-20 shadow-md rounded-lg overflow-hidden shrink-0">
                              <Image 
                                src={item.urlAnhBia} 
                                alt={item.tenSach} 
                                fill 
                                className="object-cover"
                              />
                            </div>
                            <span className="font-bold text-gray-800 text-sm line-clamp-2">{item.tenSach}</span>
                          </div>
                        </td>
                        <td className="py-6 px-4 text-gray-600 font-medium">
                          {item.gia.toLocaleString('vi-VN')}đ
                        </td>
                        <td className="py-6 px-4">
                          <div className="flex items-center justify-center bg-gray-100 rounded-full p-1 mx-auto w-fit border border-gray-200">
                            <button onClick={() => updateQuantity(item.maSach, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-500 hover:text-red-500 border border-transparent transition-all shadow-sm">
                              <Minus size={14} />
                            </button>
                            <span className="w-10 text-center font-bold text-gray-800">{item.soLuong}</span>
                            <button onClick={() => updateQuantity(item.maSach, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-500 hover:text-[#0F9D58] border border-transparent transition-all shadow-sm">
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="py-6 px-4 font-bold text-[#0F9D58]">
                          {(item.gia * item.soLuong).toLocaleString('vi-VN')}đ
                        </td>
                        <td className="py-6 px-4 text-center">
                          <button onClick={() => removeItem(item.maSach)} className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-full text-red-500 hover:rotate-90 transition-all shadow-sm mx-auto">
                            <X size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {cartItems.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <ShoppingBasket size={64} className="mb-4 text-gray-300 mx-auto" />
                          <p className="text-lg font-medium text-gray-400">Giỏ hàng trống.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(15,157,88,0.1)] p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* FIX: flex-grow -> grow */}
                  <input 
                    type="text" 
                    placeholder="Mã giảm giá"
                    className="grow bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 focus:outline-none focus:border-[#0F9D58] transition-all"
                  />
                  <button className="px-8 py-3 border-2 border-[#0F9D58] text-[#0F9D58] font-bold rounded-full hover:bg-[#0F9D58] hover:text-white transition-all">
                    Áp dụng
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-8 sticky top-24">
              <h4 className="text-xl font-bold text-gray-800 mb-6 font-quicksand">Tổng Giỏ Hàng</h4>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Tổng phụ:</span>
                  <span className="text-gray-800 font-bold">{subTotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Vận chuyển:</span>
                  <span className="text-gray-800 font-bold">{shippingFee.toLocaleString('vi-VN')}đ</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Giảm giá ({coupon.code}):</span>
                    <span className="text-red-500 font-bold">-{discount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
              </div>

              <hr className="border-gray-50 mb-6" />

              <div className="flex justify-between items-center mb-8">
                <h5 className="text-lg font-bold text-[#0F9D58]">Tổng cộng:</h5>
                <h5 className="text-2xl font-black text-[#0F9D58]">{total.toLocaleString('vi-VN')}đ</h5>
              </div>

              <button 
                onClick={() => setShowSuccessModal(true)}
                disabled={cartItems.length === 0}
                className="w-full bg-[#0F9D58] hover:bg-[#0B8043] text-white py-4 rounded-full font-bold uppercase transition-all shadow-lg disabled:grayscale flex items-center justify-center gap-2"
              >
                Tiến Hành Đặt Hàng <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        /* FIX: z-[100] -> z-100 */
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-[#0F9D58] text-white p-8 text-center">
              <CheckCircle size={48} className="mx-auto mb-4" />
              <h5 className="text-2xl font-bold">Thành công</h5>
            </div>
            <div className="p-8 text-center">
              <p className="text-gray-500 font-medium">Đặt hàng thành công!</p>
            </div>
            <div className="p-6 pt-0 flex justify-center pb-8">
              <Link href="/" className="px-12 py-3 bg-[#0F9D58] text-white rounded-full font-bold">
                OK
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;