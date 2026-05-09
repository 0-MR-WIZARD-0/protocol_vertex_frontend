'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { api } from '../../shared/api/axios';
import { useAuthStore } from '../../shared/store/useAuthStore';
import type {AuthResponse, LoginDto, RegisterDto} from '../../types/auth.types';
import type { ApiError } from '../../types/api.types';

export default function LoginPage() {

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const setUser = useAuthStore((s) => s.setUser);

  const handleLogin =
    async () => {
      try {
        setLoading(true);
        setError('');
        const dto: LoginDto = {email, password};
        const res = await api.post<AuthResponse>('/auth/login', dto);
        if (res.data?.user) {
          setUser(res.data.user);
        }
        router.push('/dashboard');
      } catch (e) {
        const err = e as AxiosError<ApiError>;
        setError(err.response?.data?.message || 'Ошибка входа');
      } finally {
        setLoading(false);
      }
    };

  const handleRegister =
    async () => {
      try {
        setLoading(true);
        setError('');
        const dto: RegisterDto = {email, password};
        await api.post('/auth/register', dto);
        await handleLogin();
      } catch (e) {
        const err = e as AxiosError<ApiError>;
        setError(err.response?.data?.message || 'Ошибка регистрации');
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-gray-700 bg-[#0a1121] p-6 shadow-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">Vertex</h1>
          <p className="mt-1 text-sm text-gray-400 text-center">Система контроля и аналитики поставленных задач</p>
        </div>
        <div className="mb-6 flex overflow-hidden rounded-2xl border border-gray-700 bg-black/30">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-sm font-medium transition
              ${
                tab === 'login'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:bg-white/5'
              }
            `}
          >
            Авторизация
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-sm font-medium transition
              ${
                tab ===
                'register'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:bg-white/5'
              }
            `}
          >
            Регистрация
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full
              rounded-2xl
              border
              border-gray-700
              bg-black/40
              p-3
              text-white
              outline-none
              transition
              placeholder:text-gray-500
              focus:border-green-500
            "
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              rounded-2xl
              border
              border-gray-700
              bg-black/40
              p-3
              text-white
              outline-none
              transition
              placeholder:text-gray-500
              focus:border-green-500
            "
          />
          {error && (<div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>)}
          <button
            disabled={
              loading ||
              !email ||
              !password
            }
            onClick={tab === 'login' ? handleLogin : handleRegister}
            className="
              w-full
              rounded-2xl
              bg-green-600
              p-3
              font-medium
              text-white
              transition
              hover:bg-green-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading
              ? 'Загрузка...'
              : tab === 'login'
              ? 'Войти'
              : 'Зарегистрироваться'}
          </button>
        </div>
      </div>
    </div>
  );
}