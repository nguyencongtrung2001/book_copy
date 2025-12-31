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
  if (typeof window === 'undefined') return null;
  
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
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
}

// Get access token
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

// Verify token and get user info from API
export async function verifyToken(): Promise<UserInfo | null> {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Token invalid or expired
      logoutUser();
      return null;
    }

    const user: UserInfo = await response.json();
    // Update localStorage with fresh data
    localStorage.setItem('user_info', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Lỗi khi verify token:', error);
    logoutUser();
    return null;
  }
}

// Fetch with auth helper
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAccessToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // Auto logout on 401
  if (response.status === 401) {
    logoutUser();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response;
}