import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '@/api/authApi';
import type { LoginRequest } from '@/api/authApi';
import { useAuthStore } from '@/stores/auth.store';

export const useLogin = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      login(data.name); // Only pass name
      toast.success('Login berhasil! Selamat datang kembali.');
      // Small delay to ensure state is updated before navigation
      setTimeout(() => navigate('/dashboard'), 100);
    },
    onError: (error: AxiosError) => {
      // Only show error toast if it's not a 401 (which will be handled by axios interceptor)
      if (error?.response?.status !== 401) {
        const errorMessage = (error?.response?.data as { message?: string })?.message || error?.message || 'Login gagal. Silakan coba lagi.';
        toast.error(errorMessage);
      }
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      toast.success('Logout berhasil!');
      navigate('/auth/login');
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      logout();
      toast.success('Logout berhasil!');
      navigate('/auth/login');
    },
  });
};