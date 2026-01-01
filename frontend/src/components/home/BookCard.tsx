"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

interface BookProps {
  id: string;
  title: string;
  price: number;
  image: string | null;
  stock_quantity: number;
}

const BookCard = ({ id, title, price, image, stock_quantity }: BookProps) => {
  // Xử lý đường dẫn ảnh
  const getImagePath = (imageName: string | null) => {
    if (!imageName) return "/books/default-book.png";
    
    // Nếu đã là URL đầy đủ (http/https)
    if (imageName.startsWith("http")) return imageName;
    
    // Nếu là đường dẫn tương đối, thêm /books/
    return `/books/${imageName}`;
  };

  const imageSrc = getImagePath(image);

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-xl transition-all flex flex-col h-full">
      
      {/* IMAGE */}
      <div className="relative h-60 w-full p-4">
        {stock_quantity === 0 && (
          <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center rounded-xl">
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
            onError={(e) => {
              // Fallback nếu ảnh lỗi
              const target = e.target as HTMLImageElement;
              target.src = "/books/default-book.png";
            }}
          />
        </Link>
      </div>

      {/* INFO */}
      <div className="p-5 grow flex flex-col justify-between">
        <Link href={`/book/${id}`}>
          <h3 className="font-bold text-sm line-clamp-2 mb-2 hover:text-[#0F9D58] transition-colors">
            {title}
          </h3>
        </Link>

        <div>
          <p className="text-[#0F9D58] font-bold text-lg mb-3">
            {price.toLocaleString("vi-VN")} đ
          </p>

          <button
            disabled={stock_quantity === 0}
            className={`w-full py-2 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${
              stock_quantity > 0
                ? "bg-[#0F9D58] text-white hover:bg-[#0B8043] hover:shadow-lg"
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