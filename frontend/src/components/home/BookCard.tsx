"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

interface BookProps {
  id: string;
  title: string;
  price: number;
  image: string | null; // "autumn.png"
  stock_quantity: number;
}

const BookCard = ({ id, title, price, image, stock_quantity }: BookProps) => {
  // 👉 CHUẨN NEXT.JS
  const imageSrc = image
    ? `/books/${image}`
    : `/books/default-book.png`;

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-xl transition-all flex flex-col h-full">
      
      {/* IMAGE */}
      <div className="relative h-60 w-full p-4">
        {stock_quantity === 0 && (
          <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
              HẾT HÀNG  
            </span>
          </div>
        )}

        <Link href={`/book/${id}`} className="relative block w-full h-full">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`object-contain transition-transform ${
              stock_quantity === 0
                ? "grayscale opacity-40"
                : "hover:scale-110"
            }`}
          />
        </Link>
      </div>

      {/* INFO */}
      <div className="p-5 grow flex flex-col justify-between">
        <Link href={`/book/${id}`}>
          <h3 className="font-bold text-sm line-clamp-2 mb-2">
            {title}
          </h3>
        </Link>

        <div>
          <p className="text-[#0F9D58] font-bold text-lg mb-3">
            {price.toLocaleString("vi-VN")} đ
          </p>

          <button
            disabled={stock_quantity === 0}
            className={`w-full py-2 rounded-full font-bold flex items-center justify-center gap-2 ${
              stock_quantity > 0
                ? "bg-[#0F9D58] text-white hover:bg-[#0B8043]"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            <ShoppingBag size={16} />
            {stock_quantity > 0 ? "Thêm vào giỏ" : "Hết hàng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
