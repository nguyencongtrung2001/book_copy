// frontend/src/api/order.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface OrderItem {
  book_id: string;
  quantity: number;
}

export interface OrderCreate {
  shipping_address: string;
  payment_method_id: string;
  voucher_code?: string;
  items: OrderItem[];
}

export interface BookInOrder {
  book_id: string;
  title: string;
  cover_image_url: string | null;
}

export interface OrderDetailResponse {
  detail_id: number;
  book_id: string;
  quantity: number;
  unit_price: number;
  book: BookInOrder | null;
}

export interface OrderResponse {
  order_id: string;
  user_id: string;
  total_amount: number;
  order_status: string;
  status_id: string;
  shipping_address: string;
  payment_method_id: string;
  payment_method_name: string | null;
  created_at: string;
  order_details: OrderDetailResponse[];
}

export interface UserOrderHistoryResponse {
  total: number;
  orders: OrderResponse[];
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
 * Tạo đơn hàng mới
 */
export async function createOrder(orderData: OrderCreate): Promise<OrderResponse> {
  console.log("📤 FRONTEND SENDING ORDER:", JSON.stringify(orderData, null, 2));
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });

    const responseData = await response.json();
    console.log("📥 BACKEND RESPONSE:", JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      throw new Error(
        typeof responseData.detail === 'string' 
          ? responseData.detail 
          : 'Tạo đơn hàng thất bại'
      );
    }

    return responseData;
    
  } catch (error) {
    console.error("❌ FETCH ERROR:", error);
    throw error;
  }
}

/**
 * Lấy lịch sử đơn hàng của user hiện tại
 */
// frontend/src/api/order.ts - Sửa getMyOrders function

export async function getMyOrders(
  skip: number = 0,
  limit: number = 20,
  statusFilter?: string
): Promise<UserOrderHistoryResponse> {
  const params = new URLSearchParams();
  params.append('skip', skip.toString());
  params.append('limit', limit.toString());
  if (statusFilter) params.append('status_filter', statusFilter);

  const url = `${API_BASE_URL}/api/orders/my-orders?${params.toString()}`;

  console.log("🔍 Fetching orders from:", url);
  console.log("🔑 Token:", getAuthToken() ? "✅ Present" : "❌ Missing");

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Error response:", errorData);
      throw new Error(errorData.detail || 'Lấy danh sách đơn hàng thất bại');
    }

    const data = await response.json();
    console.log("✅ Orders data:", data);
    return data;
  } catch (error) {
    console.error("❌ Fetch error:", error);
    throw error;
  }
}

/**
 * Lấy chi tiết đơn hàng
 */
export async function getOrderDetail(orderId: string): Promise<OrderResponse> {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Lấy chi tiết đơn hàng thất bại');
  }

  return response.json();
}

/**
 * Hủy đơn hàng
 */
export async function cancelOrder(orderId: string): Promise<{ message: string; order_id: string; order_status: string }> {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Hủy đơn hàng thất bại');
  }

  return response.json();
}

/**
 * Admin: Cập nhật trạng thái đơn hàng
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: string
): Promise<{ message: string; order_id: string; new_status: string }> {
  const response = await fetch(
    `${API_BASE_URL}/api/orders/admin/${orderId}/status?new_status=${newStatus}`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Cập nhật trạng thái thất bại');
  }

  return response.json();
}