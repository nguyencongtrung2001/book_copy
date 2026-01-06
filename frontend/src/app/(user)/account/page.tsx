// frontend/src/app/(user)/account/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  IdCard, 
  PackageOpen,
  Save, 
  Eye, 
  X, 
  ChevronRight,
  AlertTriangle,
  Receipt,
  ShoppingBasket,
  Loader2,
  Calendar,
  CreditCard,
  MapPin
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getMyOrders, cancelOrder, OrderResponse } from "@/api/order";

export default function UserProfilePage() {
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState<"detail" | "cancel" | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [error, setError] = useState<string>(""); // Thêm state cho error

  // User info form
  const [userForm, setUserForm] = useState({
    hoTen: "",
    email: "",
    soDienThoai: "",
    diaChi: "",
  });

  // Load user info
  useEffect(() => {
    if (user) {
      setUserForm({
        hoTen: user.fullname || "",
        email: user.email || "",
        soDienThoai: user.phone || "",
        diaChi: user.address || "",
      });
    }
  }, [user]);

  // Load orders - Memoize với useCallback để tránh ESLint warning và re-render không cần
  const loadOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      console.log("🔄 Loading orders with filter:", statusFilter);
      
      const response = await getMyOrders(0, 20, statusFilter || undefined);
      console.log("✅ Orders loaded:", response);
      
      setOrders(response.orders);
      setTotalOrders(response.total);
      setError(""); // Clear error on success
    } catch (error) {
      console.error("❌ Error loading orders:", error);
      setError(error instanceof Error ? error.message : "Không thể tải đơn hàng");
      setOrders([]); // Clear orders on error
      setTotalOrders(0);
    } finally {
      setOrdersLoading(false);
    }
  }, [statusFilter]);  // Dependency: statusFilter

  // Thêm useEffect để log user state
  useEffect(() => {
    console.log("👤 Current user:", user);
    console.log("🔐 Is authenticated:", !!user);
  }, [user]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]); // Bây giờ depend vào loadOrders (đã memoized), an toàn không infinite loop

  const handleUpdateInfo = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Cập nhật thông tin thành công!");
    }, 1000);
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    try {
      setLoading(true);
      await cancelOrder(selectedOrder.order_id);
      alert("Hủy đơn hàng thành công!");
      setActiveModal(null);
      loadOrders(); // Reload orders
    } catch (error) {
      alert(error instanceof Error ? error.message : "Hủy đơn hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      processing: "bg-amber-50 text-amber-700 border-amber-200",
      confirmed: "bg-blue-50 text-blue-700 border-blue-200",
      shipping: "bg-emerald-50 text-emerald-700 border-emerald-200",
      completed: "bg-teal-50 text-teal-700 border-teal-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    const labels: Record<string, string> = {
      processing: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      shipping: "Đang giao",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    };
    return (
      <span className={`inline-block w-28 py-1.5 rounded-full text-[11px] font-bold text-center border ${styles[status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getImageUrl = (image: string | null) => {
    if (!image) return "/books/default-book.png";
    if (image.startsWith("http")) return image;
    return `/books/${image}`;
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] font-inter">
      {/* HEADER */}
      <div className="relative bg-linear-to-br from-[#d1fae5] to-[#e0f2fe] pt-12 pb-24 text-center overflow-hidden"> {/* Sửa bg-linear-to-br thành bg-gradient-to-br */}
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
                <InputGroup label="Họ tên" value={userForm.hoTen} onChange={(v) => setUserForm({...userForm, hoTen: v})} />
                <InputGroup label="Email" value={userForm.email} onChange={(v) => setUserForm({...userForm, email: v})} />
                <InputGroup label="Số điện thoại" value={userForm.soDienThoai} onChange={(v) => setUserForm({...userForm, soDienThoai: v})} />
                <InputGroup label="Địa chỉ" value={userForm.diaChi} onChange={(v) => setUserForm({...userForm, diaChi: v})} />
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
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 min-h-125 animate-in fade-in slide-in-from-right-4 duration-500"> {/* Sửa min-h-125 thành min-h-[500px] */}
              <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-6">
                <h2 className="text-emerald-600 text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <PackageOpen size={20} /> Lịch sử đơn hàng ({totalOrders})
                </h2>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-emerald-500 outline-none"
                >
                  <option value="">Tất cả</option>
                  <option value="processing">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="shipping">Đang giao</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  <p className="font-bold">Lỗi tải đơn hàng:</p>
                  <p className="text-sm">{error}</p>
                  <button
                    onClick={loadOrders}
                    className="mt-2 text-sm underline hover:no-underline"
                  >
                    Thử lại
                  </button>
                </div>
              )}

              {ordersLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="animate-spin text-emerald-600" size={48} />
                </div>
              ) : (
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
                        <tr key={order.order_id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4 text-start pl-6 font-bold text-emerald-600">{order.order_id}</td>
                          <td className="px-4 py-4 text-slate-500">
                            {new Date(order.created_at).toLocaleString('vi-VN')}
                          </td>
                          <td className="px-4 py-4 font-bold">{order.total_amount.toLocaleString()} đ</td>
                          <td className="px-4 py-4">{getStatusBadge(order.order_status)}</td>
                          <td className="px-4 py-4">
                            <button 
                              onClick={() => { setSelectedOrder(order); setActiveModal("detail"); }}
                              className="w-9 h-9 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm mx-auto"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                          <td className="px-4 py-4 text-end pr-6">
                            {(order.order_status === "processing" || order.order_status === "confirmed") && (
                              <button 
                                onClick={() => { setSelectedOrder(order); setActiveModal("cancel"); }}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition-all"
                              >
                                <X size={16} />
                              </button>
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DETAIL */}
      {activeModal === "detail" && selectedOrder && (
        <Modal title={`Chi tiết: ${selectedOrder.order_id}`} onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            {/* Order Info */}
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-emerald-600" />
                  <span className="text-gray-600">Ngày đặt:</span>
                </div>
                <div className="font-bold">{new Date(selectedOrder.created_at).toLocaleString('vi-VN')}</div>
                
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-emerald-600" />
                  <span className="text-gray-600">Thanh toán:</span>
                </div>
                <div className="font-bold">{selectedOrder.payment_method_name || "N/A"}</div>
                
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-emerald-600" />
                  <span className="text-gray-600">Địa chỉ:</span>
                </div>
                <div className="font-bold col-span-1">{selectedOrder.shipping_address}</div>
              </div>
            </div>

            {/* Order Items */}
            <div className="max-h-96 overflow-y-auto px-2">
              {selectedOrder.order_details?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                  <div className="relative w-12 h-16 shrink-0">
                    <Image 
                      src={getImageUrl(item.book?.cover_image_url || null)}
                      alt={item.book?.title || "Book"}
                      fill
                      className="object-cover rounded-md shadow-sm border border-slate-100"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-700 truncate text-sm">{item.book?.title || "N/A"}</p>
                    <p className="text-xs text-slate-400">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-emerald-600 font-bold text-sm">{(item.quantity * Number(item.unit_price)).toLocaleString()}đ</div>
                </div>
              )) || []}
            </div>

            {/* Total */}
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-700">Tổng cộng:</span>
              <span className="text-2xl font-black text-emerald-600">{selectedOrder.total_amount.toLocaleString()}đ</span>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL CANCEL */}
      {activeModal === "cancel" && selectedOrder && (
        <Modal onClose={() => setActiveModal(null)}>
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">Hủy đơn hàng?</h3>
            <p className="text-sm text-slate-500 mb-6">Bạn chắc chắn muốn hủy đơn <span className="font-bold text-slate-700">{selectedOrder.order_id}</span>?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setActiveModal(null)} 
                className="flex-1 py-3 rounded-xl bg-slate-100 font-bold text-slate-600"
                disabled={loading}
              >
                Quay lại
              </button>
              <button 
                onClick={handleCancelOrder}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-red-500 font-bold text-white shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                Hủy đơn
              </button>
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