// src/api/auth.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Interface for login data
export interface LoginData {
  phone: string;
  password: string;
}

// Interface for user info in response
export interface UserInfo {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  role: 'admin' | 'customer';
  created_at?: string;
}

// Interface for login response
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserInfo;
}

// Login function
export async function loginUser(loginData: LoginData): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Đăng nhập thất bại');
    }

    const data: LoginResponse = await response.json();
    
    // Lưu token và thông tin user vào localStorage
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user_info', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    throw error;
  }
}

// Logout function
export function logoutUser(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_info');
}

// Get current user from localStorage
export function getCurrentUser(): UserInfo | null {
  const userStr = localStorage.getItem('user_info');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as UserInfo;
  } catch {
    return null;
  }
}

// Check if user is logged in
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('access_token');
}

// Get access token
export function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}