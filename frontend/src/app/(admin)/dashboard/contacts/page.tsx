"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  MailOpen, 
  Reply, 
  CheckCheck, 
  Clock, 
  Mail,
} from "lucide-react";

// 1. Định nghĩa Interface cho dữ liệu Liên hệ
interface Contact {
  maLienHe: string;
  hoTen: string;
  email: string;
  tieuDe: string;
  ngayGui: string;
  trangThai: "ChuaXuLy" | "DaTraLoi";
}

export default function AdminContactManagement() {
  // Giả lập dữ liệu (Sau này bạn sẽ fetch từ API)
  const [contacts] = useState<Contact[]>([
    {
      maLienHe: "LH001",
      hoTen: "Nguyễn Công Trung",
      email: "trung.nc@gmail.com",
      tieuDe: "Hỏi về thời gian giao hàng sách lập trình",
      ngayGui: "03/01/2026 14:30",
      trangThai: "ChuaXuLy",
    },
    {
      maLienHe: "LH002",
      hoTen: "Bùi Xuân Văn",
      email: "vanbx@student.ute.edu.vn",
      tieuDe: "Yêu cầu xuất hóa đơn đỏ cho đơn hàng DH123",
      ngayGui: "02/01/2026 09:15",
      trangThai: "DaTraLoi",
    },
  ]);

  return (
    <div className="container-fluid p-4 md:p-6 bg-[#1A202C] min-h-screen text-white font-inter">
      {/* Section Tiêu đề & Thống kê nhanh */}
      <div className="bg-[#2D3748] rounded-xl p-6 mb-6 shadow-lg flex flex-col md:flex-row justify-between items-center border border-white/5 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#4FD1C5]/10 rounded-lg flex items-center justify-center text-[#4FD1C5]">
            <MailOpen size={28} />
          </div>
          <div>
            <h2 className="m-0 text-xl font-bold uppercase tracking-wider text-[#4FD1C5]">
              Quản lý phản hồi liên hệ
            </h2>
            <p className="text-gray-400 text-xs">Hệ thống quản lý tin nhắn khách hàng</p>
          </div>
        </div>
        
        <div className="bg-[#1A202C] px-4 py-2 rounded-full border border-gray-700">
          <span className="text-gray-400 text-sm">Tổng cộng: </span>
          <span className="text-white font-bold">{contacts.length}</span>
          <span className="text-gray-400 text-sm ml-1 ">liên hệ</span>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-[#2D3748] rounded-xl shadow-xl overflow-hidden border border-gray-700 animate-in fade-in duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse min-w-225">
            <thead className="bg-[#1A202C] text-[#A0AEC0] uppercase font-bold text-xs tracking-tight">
              <tr>
                <th className="px-4 py-4 w-[5%] border-b border-gray-700">STT</th>
                <th className="px-4 py-4 w-[25%] border-b border-gray-700 text-left">Khách hàng</th>
                <th className="px-4 py-4 w-[30%] border-b border-gray-700 text-left">Tiêu đề</th>
                <th className="px-4 py-4 w-[15%] border-b border-gray-700">Thời gian gửi</th>
                <th className="px-4 py-4 w-[15%] border-b border-gray-700">Trạng thái</th>
                <th className="px-4 py-4 w-[10%] border-b border-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {contacts.map((item, index) => (
                <tr key={item.maLienHe} className="hover:bg-[#3D4A5E] transition-all group">
                  <td className="px-4 py-5 text-gray-500 font-mono">{index + 1}</td>
                  <td className="px-4 py-5 text-left ">
                    <div className="font-bold text-white group-hover:text-[#4FD1C5] transition-colors uppercase text-xs">
                      {item.hoTen}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-1 lowercase italic">
                      <Mail size={12} /> {item.email}
                    </div>
                  </td>
                  <td className="px-4 py-5 text-left text-gray-200 line-clamp-2 mt-3 block border-none">
                    {item.tieuDe}
                  </td>
                  <td className="px-4 py-5 text-gray-400 font-medium">
                    {item.ngayGui}
                  </td>
                  <td className="px-4 py-5">
                    {item.trangThai === "ChuaXuLy" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                        <Clock size={12} /> Đang chờ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <CheckCheck size={12} /> Đã trả lời
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-5">
                    {item.trangThai === "ChuaXuLy" ? (
                      <Link
                        href={`/admin/contacts/reply/${item.maLienHe}`}
                        className="inline-flex items-center gap-2 bg-[#63B3ED] hover:bg-[#4299E1] text-[#1A202C] hover:text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md active:scale-95 whitespace-nowrap"
                      >
                        <Reply size={16} /> Phản hồi
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center gap-1 text-[#10B981] font-bold drop-shadow-sm">
                        <CheckCheck size={18} />
                        <span className="text-[10px] uppercase tracking-tighter">Hoàn tất</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}