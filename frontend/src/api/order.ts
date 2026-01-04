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

// Interface cho FastAPI validation error
interface ValidationError {
  type: string;
  loc: (string | number)[];
  msg: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

interface ErrorResponse {
  detail: string | ValidationError[];
}

/**
 * Tạo đơn hàng mới
 */
export async function createOrder(orderData: OrderCreate): Promise<OrderResponse> {
  // 🔍 DEBUG: Log dữ liệu trước khi gửi
  console.log("=".repeat(60));
  console.log("📤 FRONTEND SENDING ORDER:");
  console.log("   Data:", JSON.stringify(orderData, null, 2));
  console.log("   Token:", getAuthToken() ? "✅ Present" : "❌ Missing");
  console.log("   Headers:", getAuthHeaders());
  console.log("=".repeat(60));
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });

    // 🔍 DEBUG: Log response
    console.log("📥 BACKEND RESPONSE:");
    console.log("   Status:", response.status);
    console.log("   Status Text:", response.statusText);
    
    const responseData = await response.json() as ErrorResponse | OrderResponse;
    console.log("   Data:", JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      console.error("❌ ERROR RESPONSE:", responseData);
      
      const errorData = responseData as ErrorResponse;
      
      // Format error message từ FastAPI validation errors
      if (errorData.detail && Array.isArray(errorData.detail)) {
        const errors = errorData.detail.map((err: ValidationError) => {
          const field = err.loc ? err.loc.join('.') : 'unknown';
          return `${field}: ${err.msg}`;
        }).join(', ');
        throw new Error(`Validation Error: ${errors}`);
      }
      
      throw new Error(
        typeof errorData.detail === 'string' 
          ? errorData.detail 
          : 'Tạo đơn hàng thất bại'
      );
    }

    console.log("✅ ORDER CREATED SUCCESSFULLY");
    return responseData as OrderResponse;
    
  } catch (error) {
    console.error("❌ FETCH ERROR:", error);
    throw error;
  }
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