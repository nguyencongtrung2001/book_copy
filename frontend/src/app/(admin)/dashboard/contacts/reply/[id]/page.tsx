"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { 
  ReplyAll, 
  ChevronLeft, 
  User, 
  Calendar, 
  PencilLine, 
  Send
} from "lucide-react";

/**
 * 1. Định nghĩa Interfaces rõ ràng để tránh lỗi 'any'
 */
interface ReplyFormData {
  maLienHe: string;
  phanHoiAdmin: string;
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue: string;
}

interface ContactDetail {
  maLienHe: string;
  hoTen: string;
  email: string;
  ngayGui: string;
  gioGui: string;
  tieuDe: string;
  noiDung: string;
}

export default function AdminReplyContactPage() {
  const router = useRouter();
  const params = useParams();

  // Giả lập dữ liệu nhận được (Thực tế sẽ fetch từ API)
  const contact: ContactDetail = {
    maLienHe: params.id as string,
    hoTen: "Nguyễn Công Trung",
    email: "trung.nc@gmail.com",
    ngayGui: "03/01/2026",
    gioGui: "14:30",
    tieuDe: "Hỏi về thời gian giao hàng",
    noiDung: "Chào nhà sách, mình muốn hỏi đơn hàng của mình khi nào thì được giao ạ?",
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ReplyFormData>({
    defaultValues: {
      maLienHe: contact.maLienHe,
      phanHoiAdmin: "",
    },
  });

  const onSubmit = async (data: ReplyFormData) => {
    try {
      console.log("Dữ liệu phản hồi gửi đi:", data);
      // Logic gọi API thực tế sẽ nằm ở đây
      alert("Phản hồi đã được gửi thành công!");
      router.push("/dashboard/contacts");
    } catch (error) {
      // SỬA LỖI: Sử dụng console.error để tránh lỗi 'unused error variable'
      console.error("Lỗi khi gửi phản hồi:", error);
      alert("Gửi phản hồi thất bại, vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-[#1A202C] py-8 px-4 font-inter text-sm text-[#E2E8F0]">
      {/* max-w-200 tương ứng với 800px theo chuẩn Tailwind v4 */}
      <div className="max-w-200 mx-auto bg-[#2D3748] rounded-xl shadow-2xl p-6 md:p-8 border border-white/10 animate-in fade-in duration-500">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#4FD1C5]/10 rounded-lg text-[#4FD1C5]">
              <ReplyAll size={24} />
            </div>
            <h3 className="m-0 font-bold text-[#4FD1C5] text-lg tracking-tight">
              Phản hồi khách hàng
            </h3>
          </div>
          <Link
            href="/dashboard/contacts"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#4A5568] text-xs font-medium hover:bg-white/5 transition-all text-gray-300"
          >
            <ChevronLeft size={14} /> Quay lại
          </Link>
        </div>

        {/* Customer Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InfoCard 
            icon={<User size={18} />} 
            label="Khách hàng" 
            value={contact.hoTen} 
            subValue={contact.email} 
          />
          <InfoCard 
            icon={<Calendar size={18} />} 
            label="Thời gian gửi" 
            value={contact.ngayGui} 
            subValue={contact.gioGui} 
          />
        </div>

        {/* Message Quote */}
        <div className="bg-[#111827] p-5 rounded-xl border-l-4 border-[#4FD1C5] mb-8 shadow-inner">
          <span className="block text-[10px] uppercase font-bold text-gray-500 mb-2">
            Chủ đề: {contact.tieuDe}
          </span>
          <p className="text-gray-200 italic leading-relaxed text-[0.9rem]">
            &quot;{contact.noiDung}&quot;
          </p>
        </div>

        {/* Reply Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <input type="hidden" {...register("maLienHe")} />

          <div className="space-y-3">
            <label className="flex items-center gap-2 font-bold text-[#4FD1C5] ml-1">
              <PencilLine size={18} /> Soạn nội dung phản hồi
            </label>
            <textarea
              {...register("phanHoiAdmin", { required: true })}
              placeholder="Nhập nội dung trả lời khách hàng..."
              className="w-full bg-[#0F172A] border border-[#4A5568] text-white rounded-xl p-4 min-h-45 focus:outline-none focus:border-[#4FD1C5] focus:ring-4 focus:ring-[#4FD1C5]/10 transition-all text-[0.95rem] leading-relaxed resize-y shadow-inner"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-linear-to-br from-[#4FD1C5] to-[#38B2AC] text-[#1A202C] font-black py-3.5 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:transform-none"
          >
            {isSubmitting ? "Đang gửi..." : (
              <>
                <span>Xác nhận gửi phản hồi</span>
                <Send size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/**
 * 2. Component con với Interface Props để thay thế 'any'
 */
const InfoCard = ({ icon, label, value, subValue }: InfoCardProps) => (
  <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-white/5 flex items-start gap-3 transition-colors hover:border-[#4FD1C5]/20">
    <div className="text-[#4FD1C5] mt-1">{icon}</div>
    <div>
      <span className="block text-[10px] uppercase font-black text-[#4FD1C5] tracking-widest mb-1">
        {label}
      </span>
      <div className="font-bold text-white text-base">{value}</div>
      <div className="text-blue-400 text-xs italic truncate">{subValue}</div>
    </div>
  </div>
);