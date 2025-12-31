"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { loginUser, LoginData } from '@/api/auth';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<LoginData>({
    phone: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate
      if (!formData.phone || !formData.password) {
        setError('Vui lòng nhập đầy đủ thông tin');
        setIsLoading(false);
        return;
      }

      // Call login API
      const response = await loginUser(formData);
      
      // Update auth context
      login(response.user);
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Đã xảy ra lỗi không xác định');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper min-h-[85vh] flex flex-col justify-center items-center p-5 relative bg-[#f0fdf4] overflow-hidden">
      
      {/* Background SVG Waves */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full">
          <path fill="#0F9D58" fillOpacity="0.1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path fill="#0F9D58" fillOpacity="0.2" d="M0,96L48,128C96,160,192,224,288,240C384,256,480,224,576,192C672,160,768,128,864,128C960,128,1056,160,1152,186.7C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path fill="#0F9D58" fillOpacity="0.3" d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,213.3C672,224,768,192,864,170.7C960,149,1056,139,1152,133.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Header Section */}
      <div className="login-header-compact text-center mb-6 z-10 animate-fade-down">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F9D58] mb-1 drop-shadow-sm font-quicksand px-4">
          Chào mừng bạn đến với nhà sách UTE!
        </h1>
        <p className="text-gray-600 font-semibold text-sm">
          Vui lòng đăng nhập để tiếp tục mua sách
        </p>
      </div>

      {/* Login Card */}
      <div className="form-card-compact z-10 w-full max-w-100 bg-white/95 backdrop-blur-sm p-8 rounded-[20px] shadow-[0_15px_35px_rgba(15,157,88,0.2)] border border-white/50 animate-fade-up">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-6 font-quicksand flex items-center justify-center gap-2">
          <LogIn className="text-[#0F9D58]" />
          Đăng Nhập
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Số điện thoại */}
          <div className="form-group relative">
            <label className="block font-bold text-xs text-slate-600 mb-1.5 ml-1">
              Số điện thoại
            </label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập SĐT của bạn"
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0F9D58] focus:ring-4 focus:ring-[#0F9D58]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Mật khẩu */}
          <div className="form-group relative">
            <label className="block font-bold text-xs text-slate-600 mb-1.5 ml-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0F9D58] focus:ring-4 focus:ring-[#0F9D58]/10 transition-all pr-11 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0F9D58] transition-colors p-1 disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Nút đăng nhập */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-2 bg-[#0F9D58] hover:bg-[#0B8043] text-white font-bold rounded-full shadow-lg shadow-[#0F9D58]/20 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              'Đăng Nhập Ngay'
            )}
          </button>

          {/* Link sang Đăng ký */}
          <div className="text-center mt-4 text-xs font-medium text-gray-500">
            Chưa có tài khoản? 
            <Link href="/register" className="text-[#0F9D58] font-bold ml-1 hover:underline tracking-tight">
              Đăng ký tại đây
            </Link>
          </div>
        </form>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        .animate-fade-down {
          animation: fadeDown 0.6s ease-out forwards;
        }
        .animate-fade-up {
          animation: fadeUp 0.8s ease-out forwards;
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;