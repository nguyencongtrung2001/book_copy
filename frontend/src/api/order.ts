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

export interface OrderDetailResponse {
  detail_id: number;
  book_id: string;
  quantity: number;
  unit_price: number;
}

export interface OrderResponse {
  order_id: string;
  user_id: string;
  total_amount: number;
  order_status: string;
  shipping_address: string;
  payment_method_id: string;
  created_at: string;
  order_details: OrderDetailResponse[];
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
  const response = await fetch(`${API_BASE_URL}/api/orders/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Tạo đơn hàng thất bại');
  }

  return response.json();
}

/**
 * Lấy danh sách đơn hàng của user hiện tại
 */
export async function getMyOrders(): Promise<OrderResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Lấy danh sách đơn hàng thất bại');
  }

  return response.json();
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
export async function cancelOrder(orderId: string): Promise<OrderResponse> {
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