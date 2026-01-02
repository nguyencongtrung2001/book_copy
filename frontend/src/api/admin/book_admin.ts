const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface BookAdmin {
  book_id: string;
  title: string;
  author: string;
  publisher: string | null;
  publication_year: number | null;
  category_id: string;
  category_name: string | null;
  price: number;
  stock_quantity: number;
  sold_quantity: number;
  description: string | null;
  cover_image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface BookCreateData {
  title: string;
  author: string;
  publisher?: string;
  publication_year?: number;
  category_id: string;
  price: number;
  stock_quantity?: number;
  description?: string;
  cover_image_url?: string;
}

export interface BookUpdateData {
  title?: string;
  author?: string;
  publisher?: string;
  publication_year?: number;
  category_id?: string;
  price?: number;
  stock_quantity?: number;
  description?: string;
  cover_image_url?: string;
}

export interface BookListResponse {
  total: number;
  books: BookAdmin[];
}

// Helper để lấy token
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

// Helper để tạo headers với auth
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

/**
 * Lấy danh sách sách (Admin) - có phân trang và tìm kiếm
 */
export async function fetchBooksAdmin(
  skip: number = 0,
  limit: number = 100,
  search?: string,
  categoryId?: string
): Promise<BookListResponse> {
  const params = new URLSearchParams();
  params.append('skip', skip.toString());
  params.append('limit', limit.toString());
  if (search) params.append('search', search);
  if (categoryId) params.append('category_id', categoryId);

  const response = await fetch(
    `${API_BASE_URL}/api/admin/books?${params.toString()}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Lấy danh sách sách thất bại');
  }

  return response.json();
}

/**
 * Lấy chi tiết một cuốn sách (Admin)
 */
export async function fetchBookDetailAdmin(bookId: string): Promise<BookAdmin> {
  const response = await fetch(`${API_BASE_URL}/api/admin/books/${bookId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Lấy chi tiết sách thất bại');
  }

  return response.json();
}

/**
 * Tạo sách mới (Admin)
 */
export async function createBookAdmin(bookData: BookCreateData): Promise<BookAdmin> {
  const response = await fetch(`${API_BASE_URL}/api/admin/books/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Tạo sách thất bại');
  }

  return response.json();
}

/**
 * Cập nhật thông tin sách (Admin)
 */
export async function updateBookAdmin(
  bookId: string,
  bookData: BookUpdateData
): Promise<BookAdmin> {
  const response = await fetch(`${API_BASE_URL}/api/admin/books/${bookId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Cập nhật sách thất bại');
  }

  return response.json();
}

/**
 * Xóa sách (Admin)
 */
export async function deleteBookAdmin(bookId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/books/${bookId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Xóa sách thất bại');
  }
}

/**
 * Cập nhật nhanh số lượng tồn kho (Admin)
 */
export async function updateStockAdmin(
  bookId: string,
  stockQuantity: number
): Promise<BookAdmin> {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/books/${bookId}/stock?stock_quantity=${stockQuantity}`,
    {
      method: 'PATCH',
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Cập nhật tồn kho thất bại');
  }

  return response.json();
}