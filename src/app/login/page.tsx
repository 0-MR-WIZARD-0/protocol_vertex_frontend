'use client';

import { useState } from 'react';
import { api } from '../../shared/api/axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const login = async () => {
    await api.post('/auth/login', { email, password });
    router.push('/dashboard');
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded-2xl shadow w-80">
        <h1 className="text-xl mb-4">Login</h1>

        <input
          className="w-full mb-2 p-2 border"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-2 border"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}