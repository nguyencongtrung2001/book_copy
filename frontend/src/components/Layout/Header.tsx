"use client";

import React, { useState, useEffect } from 'react'; // Bỏ useCallback vì không cần nữa
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, logoutUser, isAuthenticated } from '@/api/auth';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Init state sync thay vì dùng effect
  const [isLoggedIn] = useState(() => isAuthenticated()); // Đọc-only vì không thay đổi trong component này
  const [userName] = useState(() => {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      return user?.fullname || '';
    }
    return '';
  });

  // Giả lập số lượng giỏ hàng và thông báo
  const cartCount = 3; 
  const notificationCount = 2;

  useEffect(() => {
    // Bỏ checkAuth() vì đã init sync

    // Scroll handler (giữ nguyên)
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty deps vì chỉ scroll

  const handleLogout = () => {
    logoutUser();
    // Không cần set state ở đây vì AuthContext sẽ handle global state
    // Nếu cần, reload page hoặc dùng context để update
    router.push('/login');
  };

  // Hàm kiểm tra active link (giữ nguyên)
  const isActive = (path: string) => 
    pathname === path 
      ? "bg-[#0d9488] text-white shadow-md" 
      : "text-[#1e293b] hover:bg-[#ccfbf1] hover:text-[#0d9488]";

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-white py-3'
    }`}>
      <div className="container mx-auto px-4 md:px-10">
        <nav className="flex items-center justify-between">
          
          {/* Logo (giữ nguyên) */}
          <Link href="/" className="flex items-center gap-2 group">
            <i className="fas fa-book-open text-2xl text-[#0d9488]"></i>
            <h1 className="text-2xl font-extrabold text-[#0d9488] tracking-tighter font-quicksand m-0 leading-none">
              NHÀ SÁCH UTE
            </h1>
          </Link>

          {/* Desktop Menu (giữ nguyên, dùng isLoggedIn từ state init) */}
          <div className="hidden xl:flex items-center space-x-1">
            <Link href="/" className={`px-4 py-2 rounded-full font-semibold transition-all ${isActive('/')}`}>
              Trang Chủ
            </Link>

            <Link href="/cart" className={`px-4 py-2 rounded-full font-semibold flex items-center transition-all ${isActive('/cart')}`}>
              <i className="fas fa-shopping-cart mr-2"></i>
              Giỏ hàng 
              {cartCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/home/contact" className={`px-4 py-2 rounded-full font-semibold transition-all ${isActive('/home/contact')}`}>
              Liên hệ
            </Link>

            {isLoggedIn && (
              <Link href="/tai-khoan" className={`px-4 py-2 rounded-full font-semibold transition-all ${isActive('/tai-khoan')}`}>
                Tài khoản
              </Link>
            )}
          </div>

          {/* Right Actions (giữ nguyên) */}
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

                <button 
                  onClick={handleLogout}
                  className="bg-[#ff6f61] hover:bg-[#e55039] text-white px-5 py-2 rounded-full text-sm font-bold shadow-md transition-all hover:-translate-y-0.5"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-[#0d9488] font-bold border-2 border-[#0d9488] px-5 py-1.5 rounded-full hover:bg-[#0d9488] hover:text-white transition-all text-sm">
                  Đăng nhập
                </Link>
                <Link href="/register" className="bg-[#ff6f61] text-white font-bold px-5 py-2 rounded-full shadow-md hover:bg-[#e55039] transition-all text-sm">
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