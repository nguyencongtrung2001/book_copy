"use client";

import React, { useState, useEffect } from "react";
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
  if (!image) return "/books/book_default.jpg";
  if (image.startsWith("http")) return image;
  return `/books/${image}`;
};

/* ================== PAGE ================== */
const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [book, setBook] = useState<BookDetail | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<BookList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  /* ================== LOAD DATA ================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const bookData = await fetchBookDetail(id);
        setBook(bookData);
        setQuantity(bookData.stock_quantity > 0 ? 1 : 0);

        const allBooks = await fetchBookList();
        setRelatedBooks(
          allBooks.filter((b) => b.book_id !== id).slice(0, 4)
        );
      } catch {
        setError("Không thể tải thông tin sách");
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
    setShowModal(true);
  };

  /* ================== LOADING ================== */
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0F9D58]" size={48} />
        </div>
        <Footer />
      </>
    );
  }

  /* ================== ERROR ================== */
  if (error || !book) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <p className="text-xl font-bold mb-4">{error}</p>
          <Link href="/" className="text-[#0F9D58] font-bold flex items-center">
            <ArrowLeft className="mr-2" /> Về trang chủ
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  /* ================== RENDER ================== */
  return (
    <>
      <Header />
      <div className="bg-[#f2fbf7] min-h-screen pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 shadow-xl grid lg:grid-cols-12 gap-10">

            {/* IMAGE */}
            <div className="lg:col-span-5 relative h-105">
              {book.stock_quantity === 0 && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 rounded-2xl">
                  <span className="bg-black text-white px-6 py-2 rounded-lg font-bold">
                    HẾT HÀNG
                  </span>
                </div>
              )}
              <Image
                src={getImageUrl(book.cover_image_url)}
                alt={book.title}
                fill
                priority
                className={`object-contain ${
                  book.stock_quantity === 0 ? "grayscale opacity-40" : ""
                }`}
              />
            </div>

            {/* INFO */}
            <div className="lg:col-span-7">
              <h1 className="text-4xl font-extrabold mb-4">{book.title}</h1>

              <div className="flex flex-wrap gap-3 mb-6">
                <Meta icon={<UserPen size={16} />} label="Tác giả" value={book.author} />
                {book.publisher && (
                  <Meta icon={<Book size={16} />} label="NXB" value={book.publisher} />
                )}
                {book.category_name && (
                  <Meta icon={<Book size={16} />} label="Thể loại" value={book.category_name} />
                )}
              </div>

              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>

              <p className="text-4xl font-bold text-[#0F9D58] mb-6">
                {Number(book.price).toLocaleString("vi-VN")} đ
              </p>

              <p className="text-gray-600 mb-8">{book.description}</p>

              <form onSubmit={addToCart} className="flex items-end gap-6">
                <div>
                  <label className="text-sm font-bold mb-2 block">Số lượng</label>
                  <div className="flex items-center border rounded-full px-3 py-1">
                    <button type="button" onClick={() => changeQty(-1)}>
                      <Minus />
                    </button>
                    <input
                      readOnly
                      value={quantity}
                      className="w-12 text-center font-bold"
                    />
                    <button type="button" onClick={() => changeQty(1)}>
                      <Plus />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={book.stock_quantity === 0}
                  className="bg-[#0F9D58] text-white px-10 py-3 rounded-full font-bold hover:bg-[#0B8043] disabled:bg-gray-400"
                >
                  <ShoppingCart className="inline mr-2" />
                  Thêm vào giỏ
                </button>
              </form>
            </div>
          </div>

          {/* RELATED */}
          {relatedBooks.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <LibraryBig className="text-[#0F9D58] mr-3" />
                Sách liên quan
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedBooks.map((b) => (
                  <Link key={b.book_id} href={`/book/${b.book_id}`}>
                    <div className="bg-white rounded-2xl p-4 shadow hover:shadow-xl transition">
                      <div className="relative h-56 mb-4">
                        <Image
                          src={getImageUrl(b.cover_image_url)}
                          alt={b.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h4 className="font-bold truncate">{b.title}</h4>
                      <p className="text-[#0F9D58] font-bold">
                        {Number(b.price).toLocaleString("vi-VN")} đ
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 text-center">
              <CheckCircle size={48} className="text-[#0F9D58] mx-auto mb-4" />
              <p className="text-lg font-bold mb-6">
                Đã thêm sản phẩm vào giỏ hàng
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="bg-[#0F9D58] text-white px-6 py-2 rounded-full"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

/* ================== META ================== */
const Meta = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full text-sm">
    <span className="text-[#0F9D58] mr-2">{icon}</span>
    <b className="mr-1">{label}:</b> {value}
  </div>
);

export default BookDetailPage;
