const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface UserProfile {
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: string;
}

export interface ProfileUpdateData {
  full_name?: string;
  phone?: string;
  address?: string;
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
 * Lấy thông tin profile của user hiện tại
 */
export async function getCurrentProfile(): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Lấy thông tin thất bại');
  }

  return response.json();
}

/**
 * Cập nhật thông tin profile
 * Backend expects form data or query params, not JSON body
 */
export async function updateProfile(data: ProfileUpdateData): Promise<UserProfile> {
  // Build query params
  const params = new URLSearchParams();
  if (data.full_name !== undefined) params.append('full_name', data.full_name);
  if (data.phone !== undefined) params.append('phone', data.phone || '');
  if (data.address !== undefined) params.append('address', data.address || '');

  console.log("📤 Sending update with params:", params.toString());

  const response = await fetch(`${API_BASE_URL}/api/users/me?${params.toString()}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Cập nhật thất bại');
  }

  return response.json();
}