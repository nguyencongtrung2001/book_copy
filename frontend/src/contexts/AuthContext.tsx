"use client";

import React, { createContext, useContext, useState } from 'react'; // Bỏ useEffect, useCallback
import { getCurrentUser, isAuthenticated, logoutUser, UserInfo } from '@/api/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Init state sync thay vì dùng effect/loadUser
  const [user] = useState<UserInfo | null>(() => {
    if (isAuthenticated()) {
      return getCurrentUser();
    }
    return null;
  });
  const [isLoading] = useState(false); // Không loading vì sync

  const logout = () => {
    logoutUser();
    // Có thể force reload hoặc update state nếu cần, nhưng router.push sẽ trigger re-mount
    router.push('/login');
  };

  const refreshUser = () => {
    // Nếu cần refresh (ví dụ sau API call), implement async ở đây
    window.location.reload(); // Simple way, hoặc dùng event bus nếu phức tạp
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        logout,
        refreshUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}