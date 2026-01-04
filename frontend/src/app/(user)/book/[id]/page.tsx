"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  UserPen,
  Book,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  LibraryBig,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Calendar,
  Package,
} from "lucide-react";

import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import {
  fetchBookDetail,
  fetchBookList,
  BookDetail,
  BookList,
} from "@/api/book";

/* ================== HELPER ================== */
const getImageUrl = (image: string | null) => {
  if (!image) return "/books/default-book.png";
  
  // Nếu đã là URL đầy đủ (http/https)
  if (image.startsWith("http")) return image;
  
  // Nếu là tên file, thêm /books/
  return `/books/${image}`;
};

/* ================== RELATED BOOK CARD COMPONENT ================== */
const RelatedBookCard = ({ book }: { book: BookList }) => {
  const [relatedImgError, setRelatedImgError] = useState(false);
  const relatedImgSrc = relatedImgError ? "/books/default-book.png" : getImageUrl(book.cover_image_url);
  
  return (
    <Link href={`/book/${book.book_id}`}>
      <div className="bg-white rounded-2xl p-4 shadow hover:shadow-xl transition-all transform hover:-translate-y-1">
        <div className="relative aspect-3/4 mb-4">
          <Image
            src={relatedImgSrc}
            alt={book.title}
            fill
            className="object-contain"
            onError={() => setRelatedImgError(true)}
            unoptimized={relatedImgSrc.startsWith("http")}
          />
        </div>
        <h4 className="font-bold text-sm line-clamp-2 mb-2 text-gray-800">
          {book.title}
        </h4>
        <p className="text-[#0F9D58] font-bold text-lg">
          {Number(book.price).toLocaleString("vi-VN")} đ
        </p>
        {book.stock_quantity === 0 && (
          <span className="inline-block mt-2 text-xs text-red-500 font-semibold">
            Hết hàng
          </span>
        )}
      </div>
    </Link>
  );
};

/* ================== META COMPONENT ================== */
const Meta = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full text-sm">
    <span className="text-[#0F9D58] mr-2">{icon}</span>
    <b className="mr-1">{label}:</b> {value}
  </div>
);

/* ================== MAIN PAGE ================== */
const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [book, setBook] = useState<BookDetail | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<BookList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [imgError, setImgError] = useState(false);

  /* ================== LOAD DATA ================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch book detail
        const bookData = await fetchBookDetail(id);
        setBook(bookData);
        setQuantity(bookData.stock_quantity > 0 ? 1 : 0);
         
        const   sumMoney =useMemo(({bookData.price,quantity}) =>  {return quantity*bookData.price},[bookData.price,quantity])
        // Fetch related books (filter out current book)
        const allBooks = await fetchBookList();
        setRelatedBooks(
          allBooks.filter((b) => b.book_id !== id).slice(0, 4)
        );
      } catch (err) {
        console.error("Error loading book:", err);
        setError("Không thể tải thông tin sách. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  /* ================== HANDLERS ================== */
  const changeQty = (delta: number) => {
    if (!book) return;
    const next = quantity + delta;
    if (next >= 1 && next <= book.stock_quantity) {
      setQuantity(next);
    }
  };

  const addToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!book || book.stock_quantity === 0) return;
    
    console.log(`Adding ${quantity} of ${book.title} to cart`);
    console.log(`Payment method: ${paymentMethod}`);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  /* ================== LOADING STATE ================== */
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-[#f2fbf7]">
          <div className="text-center">
            <Loader2 className="animate-spin text-[#0F9D58] mx-auto mb-4" size={48} />
            <p className="text-gray-600 font-medium">Đang tải thông tin sách...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  /* ================== ERROR STATE ================== */
  if (error || !book) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f2fbf7] px-4">
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-red-500" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
            <p className="text-gray-600 mb-6">{error || "Không tìm thấy sách"}</p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-[#0F9D58] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0B8043] transition-all"
            >
              <ArrowLeft size={20} />
              Về trang chủ
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const imageSrc = imgError ? "/books/default-book.png" : getImageUrl(book.cover_image_url);
 


  /* ================== MAIN RENDER ================== */
  return (
    <>
      <Header />
      <div className="bg-[#f2fbf7] min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6 text-gray-600">
            <Link href="/" className="hover:text-[#0F9D58]">Trang chủ</Link>
            <span>/</span>
            <span className="text-[#0F9D58] font-semibold">Chi tiết sách</span>
          </nav>

          {/* Main Content */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">

              {/* IMAGE SECTION */}
              <div className="lg:col-span-5">
                <div className="relative aspect-3/4 max-w-md mx-auto">
                  {book.stock_quantity === 0 && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 rounded-2xl">
                      <span className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg">
                        HẾT HÀNG
                      </span>
                    </div>
                  )}
                  <Image
                    src={imageSrc}
                    alt={book.title}
                    fill
                    priority
                    className={`object-contain rounded-2xl ${
                      book.stock_quantity === 0 ? "grayscale opacity-40" : ""
                    }`}
                    onError={() => setImgError(true)}
                    unoptimized={imageSrc.startsWith("http")}
                  />
                </div>
              </div>

              {/* INFO SECTION */}
              <div className="lg:col-span-7 flex flex-col">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                  {book.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <Meta 
                    icon={<UserPen size={16} />} 
                    label="Tác giả" 
                    value={book.author} 
                  />
                  {book.publisher && (
                    <Meta 
                      icon={<Book size={16} />} 
                      label="NXB" 
                      value={book.publisher} 
                    />
                  )}
                  {book.publication_year && (
                    <Meta 
                      icon={<Calendar size={16} />} 
                      label="Năm XB" 
                      value={book.publication_year} 
                    />
                  )}
                  {book.category_name && (
                    <Meta 
                      icon={<Book size={16} />} 
                      label="Thể loại" 
                      value={book.category_name} 
                    />
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(Chưa có đánh giá)</span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-4xl font-bold text-[#0F9D58]">
                    {Number(book.price).toLocaleString("vi-VN")} đ
                  </p>
                  {book.stock_quantity > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Còn lại: <span className="font-bold text-[#0F9D58]">{book.stock_quantity}</span> cuốn
                    </p>
                  )}
                </div>

                {/* Description */}
                {book.description && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Mô tả sản phẩm</h3>
                    <p className="text-gray-600 leading-relaxed">{book.description}</p>
                  </div>
                )}

                {/* Payment Method Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Phương thức thanh toán</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Cash Payment */}
                    <label 
                      className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === 'cash' 
                          ? 'border-[#0F9D58] bg-[#0F9D58]/5' 
                          : 'border-gray-200 hover:border-[#0F9D58]/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'online')}
                        className="hidden"
                      />
                      <div className="flex items-center gap-3 w-full">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'cash' 
                            ? 'border-[#0F9D58]' 
                            : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'cash' && (
                            <div className="w-3 h-3 bg-[#0F9D58] rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-5 h-5 text-[#0F9D58]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="font-bold text-gray-800">Tiền mặt</span>
                          </div>
                          <p className="text-xs text-gray-500">Thanh toán khi nhận hàng</p>
                        </div>
                        {paymentMethod === 'cash' && (
                          <CheckCircle size={20} className="text-[#0F9D58]" />
                        )}
                      </div>
                    </label>

                    {/* Online Payment */}
                    <label 
                      className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === 'online' 
                          ? 'border-[#0F9D58] bg-[#0F9D58]/5' 
                          : 'border-gray-200 hover:border-[#0F9D58]/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'online')}
                        className="hidden"
                      />
                      <div className="flex items-center gap-3 w-full">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'online' 
                            ? 'border-[#0F9D58]' 
                            : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'online' && (
                            <div className="w-3 h-3 bg-[#0F9D58] rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-5 h-5 text-[#0F9D58]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <span className="font-bold text-gray-800">Chuyển khoản</span>
                          </div>
                          <p className="text-xs text-gray-500">Thanh toán qua ngân hàng</p>
                        </div>
                        {paymentMethod === 'online' && (
                          <CheckCircle size={20} className="text-[#0F9D58]" />
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Add to Cart Form */}
                <form onSubmit={addToCart} className="mt-auto">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
                    <div className="shrink-0">
                      <label className="text-sm font-bold mb-2 block text-gray-700">
                        Số lượng
                      </label>
                      <div className="flex items-center border-2 border-gray-200 rounded-full px-3 py-2 bg-white">
                        <button 
                          type="button" 
                          onClick={() => changeQty(-1)}
                          disabled={quantity <= 1 || book.stock_quantity === 0}
                          className="text-gray-600 hover:text-[#0F9D58] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus size={20} />
                        </button>
                        <input
                          readOnly
                          value={quantity}
                          className="w-16 text-center font-bold text-lg text-gray-800 bg-transparent"
                        />
                        <button 
                          type="button" 
                          onClick={() => changeQty(1)}
                          disabled={quantity >= book.stock_quantity || book.stock_quantity === 0}
                          className="text-gray-600 hover:text-[#0F9D58] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={book.stock_quantity === 0}
                      className="flex-1 bg-[#0F9D58] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#0B8043] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg disabled:transform-none flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={22} />
                      {book.stock_quantity === 0 ? "Hết hàng" : "Thêm vào giỏ"}
                    </button>

                   
                  </div>
                </form>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl flex flex-row ">
                   <input 
                    type="text" 
                    placeholder="Mã giảm giá"
                    className="grow bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 focus:outline-none focus:border-[#0F9D58] transition-all"
                  />
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Tổng số tiền : </span> {sumMoney}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RELATED BOOKS */}
          {relatedBooks.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center">
                <LibraryBig className="text-[#0F9D58] mr-3" size={32} />
                Sách liên quan
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {relatedBooks.map((b) => (
                  <RelatedBookCard key={b.book_id} book={b} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SUCCESS MODAL */}
        {showModal && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={closeModal}
          >
            <div 
              className="bg-white rounded-3xl p-8 text-center max-w-md w-full animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 bg-[#0F9D58]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={48} className="text-[#0F9D58]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Thành công!</h3>
              <p className="text-gray-600 mb-2">
                Đã thêm <span className="font-bold">{quantity}</span> sản phẩm vào giỏ hàng
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Phương thức thanh toán:</span>
                  <br />
                  <span className="text-[#0F9D58] font-bold">
                    {paymentMethod === 'cash' ? '💵 Tiền mặt (COD)' : '💳 Chuyển khoản'}
                  </span>
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-100 text-gray-800 px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-all"
                >
                  Đặt hàng
                </button>
                <Link
                  href="/cart"
                  className="flex-1 bg-[#0F9D58] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0B8043] transition-all"
                >
                  Xem giỏ hàng
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default BookDetailPage;