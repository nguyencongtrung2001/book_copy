"use client";
import React from 'react';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface BookProps {
  id: string;
  title: string;
  price: number;
  image: string;
  stock_quantity: number;
}

const BookCard = ({ id, title, price, image, stock_quantity }: BookProps) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group">
      {/* Image Wrap */}
      <div className="relative h-60 w-full flex items-center justify-center p-4 bg-white">
        <div className="absolute top-2.5 left-2.5 bg-slate-800/80 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded-lg z-10 font-bold">
          Kho: {stock_quantity}
        </div>
        
        {stock_quantity === 0 && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm">HẾT HÀNG</span>
          </div>
        )}
        
        {stock_quantity > 0 && stock_quantity < 10 && (
          <div className="absolute top-9 left-2.5 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-lg z-10 font-bold">
            Sắp hết
          </div>
        )}

        <Link href={`/book/${id}`} className="relative w-full h-full">
          <Image 
            src={image ? `/images/${image}` : '/images/default-book.jpg'} 
            alt={title} 
            fill 
            className={`object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md ${stock_quantity === 0 ? 'grayscale opacity-40' : ''}`}
          />
        </Link>
      </div>

      {/* Info */}
      <div className="p-5 pt-0 grow flex flex-col justify-between">
        <Link href={`/book/${id}`}>
          <h4 className="text-slate-800 font-bold text-sm line-clamp-2 h-10 mb-2 hover:text-[#0F9D58] transition-colors" title={title}>
            {title}
          </h4>
        </Link>
        
        <div>
          <p className="text-[#0F9D58] font-bold text-lg mb-3">
            {Number(price).toLocaleString('vi-VN')} đ
          </p>
          <button 
            disabled={stock_quantity === 0}
            className={`w-full py-2 rounded-full text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 ${
              stock_quantity > 0 
                ? 'bg-[#0F9D58] hover:bg-[#0B8043] text-white shadow-[#0f9d58]/20' 
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
          >
            <ShoppingBag size={16} /> 
            {stock_quantity > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;