"use client";

import React, { Children } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Box, 
  Users, 
  ShoppingCart, 
  MessageSquare, 
  LogOut 
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Trang chủ", href: "/admin", icon: <Home size={20} /> },
    { name: "Quản lý sản phẩm", href: "/dashboard/products", icon: <Box size={20} /> },
    { name: "Quản lý người dùng", href: "/dashboard/users", icon: <Users size={20} /> },
    { name: "Quản lý đơn hàng", href: "/dashboard/orders", icon: <ShoppingCart size={20} /> },
    { name: "Phản hồi liên hệ", href: "/dashboard/contacts", icon: <MessageSquare size={20} /> },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-70 bg-[#1A202C] text-white shadow-2xl z-40 p-4 transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-700 mb-6">
          <span className="text-2xl font-bold text-[#4FD1C5] tracking-tight">
            ADMIN DASHBOARD
          </span>
        </div>

        <nav className="grow">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group font-medium
                    ${isActive(item.href) 
                      ? "bg-[#63B3ED] text-white" 
                      : "hover:bg-[#4A5568] text-gray-300 hover:translate-x-1"}`}
                >
                  <span className={`mr-3 ${isActive(item.href) ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              </li>
            ))}
            
            {/* Logout Button */}
            <li>
              <button
                onClick={() => console.log("Logout function here")}
                className="w-full flex items-center px-4 py-3 rounded-xl text-gray-300 font-medium hover:bg-red-500 hover:text-white transition-all duration-200 mt-4"
              >
                <LogOut size={20} className="mr-3 text-red-500 group-hover:text-white" />
                Đăng xuất
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      {Children} # nằm bên phải
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;