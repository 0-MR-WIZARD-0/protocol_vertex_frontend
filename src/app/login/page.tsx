/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { api } from '../../shared/api/axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../shared/store/useAuthStore';

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const handleLogin = async () => {
    try {
      setError('');
      const res = await api.post('/auth/login', { email, password });

      if (res.data?.user) {
        setUser(res.data.user);
      }

      router.push('/dashboard');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Ошибка входа');
    }
  };

  const handleRegister = async () => {
    try {
      setError('');
      await api.post('/auth/register', {
        email,
        password,
      });

      await handleLogin();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded-2xl shadow w-80 space-y-4">

        <div className="flex border rounded-lg overflow-hidden text-black">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 text-sm ${
              tab === 'login'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100'
            }`}
          >
            Авторизация
          </button>

          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2 text-sm ${
              tab === 'register'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100'
            }`}
          >
            Регистрация
          </button>
        </div>

        <input
          className="w-full p-2 border rounded text-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 border rounded text-black"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className="text-red-500 text-xs text-center">
            {error}
          </div>
        )}

        <button
          onClick={tab === 'login' ? handleLogin : handleRegister}
          className="w-full bg-green-600 p-2 rounded hover:opacity-90"
        >
          {tab === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </div>
    </div>
  );
}