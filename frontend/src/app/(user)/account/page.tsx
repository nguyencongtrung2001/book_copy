"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Thêm để tối ưu ảnh
import { 
  IdCard, 
  PackageOpen, // Thay BoxOpen bằng PackageOpen
  Save, 
  Eye, 
  Pen, 
  X, 
  ChevronRight,
  AlertTriangle,
  Receipt,
  ShoppingBasket,
  Loader2
} from "lucide-react";

// --- Interfaces ---
interface OrderDetail {
  maSach: string;
  tenSach: string;
  urlAnhBia: string;
  soLuong: number;
  giaBan: number;
}

type OrderStatus = "ChoXacNhan" | "DangXuLy" | "DangGiao" | "DaGiao" | "DaHuy";

interface Order {
  maDonHang: string;
  ngayTao: string;
  tongTien: number;
  trangThaiDonHang: OrderStatus;
  chiTiets: OrderDetail[];
}

export default function UserProfilePage() {
  const [activeModal, setActiveModal] = useState<"detail" | "cancel" | "review" | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    hoTen: "Nguyễn Công Trung",
    email: "trung.nc@gmail.com",
    soDienThoai: "0905123456",
    diaChi: "48 Cao Thắng, Đà Nẵng",
  });

  // Mock data
  const orders: Order[] = [
    {
      maDonHang: "DH001",
      ngayTao: "01/01/2026 14:30",
      tongTien: 450000,
      trangThaiDonHang: "DangGiao",
      chiTiets: [
        { maSach: "S01", tenSach: "Lập trình Next.js", urlAnhBia: "/images/book1.jpg", soLuong: 1, giaBan: 450000 }
      ]
    }
  ];

  const handleUpdateInfo = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Cập nhật thông tin thành công!");
    }, 1000);
  };

  // SỬA LỖI ANY: Định nghĩa kiểu dữ liệu cho Badge
  const getStatusBadge = (status: OrderStatus) => {
    const styles: Record<OrderStatus, string> = {
      ChoXacNhan: "bg-amber-50 text-amber-700 border-amber-200",
      DangXuLy: "bg-blue-50 text-blue-700 border-blue-200",
      DangGiao: "bg-emerald-50 text-emerald-700 border-emerald-200",
      DaGiao: "bg-teal-50 text-teal-700 border-teal-200",
      DaHuy: "bg-red-50 text-red-700 border-red-200",
    };
    const labels: Record<OrderStatus, string> = {
      ChoXacNhan: "Chờ xác nhận",
      DangXuLy: "Đang xử lý",
      DangGiao: "Đang giao",
      DaGiao: "Hoàn thành",
      DaHuy: "Đã hủy",
    };
    return (
      <span className={`inline-block w-28 py-1.5 rounded-full text-[11px] font-bold text-center border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] font-inter">
      {/* HEADER */}
      <div className="relative bg-linear-to-br from-[#d1fae5] to-[#e0f2fe] pt-12 pb-24 text-center overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2 uppercase tracking-tight">Hồ Sơ Của Bạn</h1>
          <nav className="flex justify-center items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-emerald-600 font-bold">Tài khoản</span>
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 w-full leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[130%] h-16 fill-[#f0fdf4]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: INFO */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 sticky top-6 animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-emerald-600 text-sm font-black uppercase tracking-widest border-b border-slate-50 pb-4 mb-6 flex items-center gap-2">
                <IdCard size={20} /> Thông tin cá nhân
              </h2>
              <div className="space-y-4">
                <InputGroup label="Họ tên" value={user.hoTen} onChange={(v) => setUser({...user, hoTen: v})} />
                <InputGroup label="Email" value={user.email} onChange={(v) => setUser({...user, email: v})} />
                <InputGroup label="Số điện thoại" value={user.soDienThoai} onChange={(v) => setUser({...user, soDienThoai: v})} />
                <InputGroup label="Địa chỉ" value={user.diaChi} onChange={(v) => setUser({...user, diaChi: v})} />
                <button 
                  onClick={handleUpdateInfo}
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: HISTORY */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 min-h-125 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-emerald-600 text-sm font-black uppercase tracking-widest border-b border-slate-50 pb-4 mb-6 flex items-center gap-2">
                <PackageOpen size={20} /> Lịch sử đơn hàng
              </h2>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-sm text-center">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr className="uppercase text-[10px] font-black tracking-wider">
                      <th className="px-4 py-4 text-start pl-6">Mã Đơn</th>
                      <th className="px-4 py-4">Ngày Đặt</th>
                      <th className="px-4 py-4">Tổng Tiền</th>
                      <th className="px-4 py-4">Trạng Thái</th>
                      <th className="px-4 py-4">Chi Tiết</th>
                      <th className="px-4 py-4 text-end pr-6">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {orders.length > 0 ? orders.map((order) => (
                      <tr key={order.maDonHang} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-4 text-start pl-6 font-bold text-emerald-600">{order.maDonHang}</td>
                        <td className="px-4 py-4 text-slate-500">{order.ngayTao}</td>
                        <td className="px-4 py-4 font-bold">{order.tongTien.toLocaleString()} đ</td>
                        <td className="px-4 py-4">{getStatusBadge(order.trangThaiDonHang)}</td>
                        <td className="px-4 py-4">
                          <button 
                            onClick={() => { setSelectedOrder(order); setActiveModal("detail"); }}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                        <td className="px-4 py-4 text-end pr-6">
                          {["ChoXacNhan", "DangXuLy"].includes(order.trangThaiDonHang) && (
                            <div className="flex justify-end gap-2">
                              <button className="w-9 h-9 rounded-full flex items-center justify-center text-amber-600 border border-amber-100 hover:bg-amber-600 hover:text-white transition-all">
                                <Pen size={14} />
                              </button>
                              <button 
                                onClick={() => { setSelectedOrder(order); setActiveModal("cancel"); }}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition-all"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="py-20 text-slate-400">
                          <ShoppingBasket className="mx-auto mb-2 opacity-20" size={48} />
                          Chưa có đơn hàng nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DETAIL */}
      {activeModal === "detail" && selectedOrder && (
        <Modal title={`Đơn hàng: ${selectedOrder.maDonHang}`} onClose={() => setActiveModal(null)}>
          <div className="space-y-4 max-h-100 overflow-y-auto px-2">
            {selectedOrder.chiTiets.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                {/* SỬA LỖI ESLINT: Dùng Next Image */}
                <div className="relative w-12 h-16 shrink-0">
                  <Image 
                    src={item.urlAnhBia} 
                    alt={item.tenSach}
                    fill
                    className="object-cover rounded-md shadow-sm border border-slate-100"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-700 truncate text-sm">{item.tenSach}</p>
                  <p className="text-xs text-slate-400">Số lượng: {item.soLuong}</p>
                </div>
                <div className="text-emerald-600 font-bold text-sm">{(item.soLuong * item.giaBan).toLocaleString()}đ</div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {activeModal === "cancel" && selectedOrder && (
        <Modal onClose={() => setActiveModal(null)}>
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">Hủy đơn hàng?</h3>
            <p className="text-sm text-slate-500 mb-6">Bạn chắc chắn muốn hủy đơn <span className="font-bold text-slate-700">{selectedOrder.maDonHang}</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setActiveModal(null)} className="flex-1 py-3 rounded-xl bg-slate-100 font-bold text-slate-600">Quay lại</button>
              <button className="flex-1 py-3 rounded-xl bg-red-500 font-bold text-white shadow-lg">Hủy đơn</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- Helper Components ---
const InputGroup = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider ml-1">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white focus:border-emerald-500 transition-all"
    />
  </div>
);

const Modal = ({ title, children, onClose }: { title?: string; children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center p-6 border-b border-slate-50 bg-emerald-50/30">
        <h3 className="font-black text-slate-800 flex items-center gap-2">
          <Receipt size={20} className="text-emerald-600" /> {title || "Thông báo"}
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-white rounded-full"><X size={20} /></button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);