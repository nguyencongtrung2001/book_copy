// src/api/user.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Interface for registration data (matches backend schema)
export interface RegisterUserData {
  username: string;  // Backend expects 'username' in schema
  email: string;
  password: string;
  phone: string;
  address: string;
}

// Interface for API response
export interface UserResponse {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  created_at?: string;
}

// Register user function with proper typing
export async function registerUser(userData: RegisterUserData): Promise<UserResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Đăng ký thất bại');
    }

    return await response.json();
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    throw error;
  }
}