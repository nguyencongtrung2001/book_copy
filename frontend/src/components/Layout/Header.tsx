"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // Giả lập trạng thái để hiển thị giao diện (Chưa xử lý logic thật)
  const cartCount = 3; 
  const notificationCount = 2;
  const isLoggedIn = true; // Đổi thành false để xem giao diện nút Đăng nhập
  const userName = "Bui Van";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hàm kiểm tra active link
  const isActive = (path: string) => pathname === path ? "bg-[#0d9488] text-white shadow-md" : "text-[#1e293b] hover:bg-[#ccfbf1] hover:text-[#0d9488]";

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-white py-3'
    }`}>
      <div className="container mx-auto px-4 md:px-10">
        <nav className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <i className="fas fa-book-open text-2xl text-[#0d9488]"></i>
            <h1 className="text-2xl font-extrabold text-[#0d9488] tracking-tighter font-quicksand m-0 leading-none">
              NHÀ SÁCH UTE
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden xl:flex items-center space-x-1">
            <Link href="/" className={`px-4 py-2 rounded-full font-semibold transition-all ${isActive('/')}`}>
              Trang Chủ
            </Link>

            <Link href="/gio-hang" className={`px-4 py-2 rounded-full font-semibold flex items-center transition-all ${isActive('/gio-hang')}`}>
              <i className="fas fa-shopping-cart mr-2"></i>
              Giỏ hàng 
              <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            </Link>

            <Link href="/lien-he" className={`px-4 py-2 rounded-full font-semibold transition-all ${isActive('/lien-he')}`}>
              Liên hệ
            </Link>

            {isLoggedIn && (
              <Link href="/tai-khoan" className={`px-4 py-2 rounded-full font-semibold transition-all ${isActive('/tai-khoan')}`}>
                Tài khoản
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                {/* Notification */}
                <Link href="/thong-bao" className="relative group p-2">
                  <i className="fas fa-bell text-xl text-[#0d9488] group-hover:animate-bounce"></i>
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white font-bold">
                      {notificationCount}
                    </span>
                  )}
                </Link>

                <span className="hidden md:inline font-bold text-[#0d9488] font-quicksand">
                  Hi, {userName}!
                </span>

                <button className="bg-[#ff6f61] hover:bg-[#e55039] text-white px-5 py-2 rounded-full text-sm font-bold shadow-md transition-all hover:-translate-y-0.5">
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/dang-nhap" className="text-[#0d9488] font-bold border-2 border-[#0d9488] px-5 py-1.5 rounded-full hover:bg-[#0d9488] hover:text-white transition-all text-sm">
                  Đăng nhập
                </Link>
                <Link href="/dang-ky" className="bg-[#ff6f61] text-white font-bold px-5 py-2 rounded-full shadow-md hover:bg-[#e55039] transition-all text-sm">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;