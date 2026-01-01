"use client"
import Hero from '@/components/home/Hero';
import BookCard from '@/components/home/BookCard';
import { Users, Smile, BadgeCheck, BookOpenText } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import {TestimonialCard} from '@/components/home/Testimonials'
import {StatItem} from '@/components/home/Stats'
import {data} from '@/data/data'
import { useEffect, useState } from "react";
import { fetchBookList, BookList } from "@/api/book";




export default function HomePage() {
 const [books, setBooks] = useState<BookList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookList()
      .then(setBooks)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <Header/>
      <Hero tuKhoa="" />

      <section className="bg-[#f2fbf7] pt-5 pb-24 relative">
        <div className="container mx-auto px-4">       
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <h2 className="text-3xl font-bold text-slate-800 font-quicksand">Kệ sách Online</h2>
            
            {/* Tabs Filter */}
            <div className="flex bg-white p-1 rounded-full shadow-sm">
              {['Tất cả', 'Sách Hot', 'Xu hướng'].map((tab, idx) => (
                <button 
                  key={tab} 
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${idx === 0 ? 'bg-[#0F9D58] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
  <p className="text-center col-span-full text-slate-500">
    Đang tải sách...
  </p>
) : (
  books.map((book) => (
    <BookCard
      key={book.book_id}
      id={book.book_id}
      title={book.title}
      price={book.price}
      image={book.cover_image_url}
      stock_quantity={book.stock_quantity}
    />
  ))
)}

          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full leading-0 rotate-180">
          <svg className="relative block w-[calc(130%+1.3px)] h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#FFFFFF"></path>
          </svg>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem icon={<Users size={32} />} number="1,963" label="Khách hàng" />
            <StatItem icon={<Smile size={32} />} number="99%" label="Hài lòng" />
            <StatItem icon={<BadgeCheck size={32} />} number="33" label="Chứng nhận" />
            <StatItem icon={<BookOpenText size={32} />} number="789" label="Sách bán chạy" />
          </div>
        </div>
      </section>

      <section className="bg-[#f2fbf7] py-20 relative overflow-hidden">
         <div className="container mx-auto px-4 text-center">
            <h4 className="text-[#0F9D58] font-bold uppercase mb-2">Đánh giá</h4>
            <h2 className="text-3xl font-bold text-slate-800 mb-12 font-quicksand">Khách hàng nói gì về chúng tôi!</h2>
            <div className="grid md:grid-cols-3 gap-8">
               {
  data.map((item) => (
    <TestimonialCard
      key={item.id}
      name={item.name}
      role={item.work}
      content={item.content}
      image={item.image}
    />
  ))
}

               
            </div>
         </div>
      </section>
      <Footer/>
    </main>
  );
}

