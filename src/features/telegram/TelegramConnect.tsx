'use client';

import { useState } from 'react';
import { api } from '../../shared/api/axios';

export function TelegramConnect() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');

  const connect = async () => {
    try {
      const res = await api.post(
        '/users/telegram-code',
      );

      setCode(res.data.code);
      setOpen(true);
    } catch {
      alert('Ошибка подключения');
    }
  };

  return (
    <>
      <button
        onClick={connect}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:opacity-90 transition"
      >
        Подключить Telegram
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">

          <div className="relative w-full max-w-md rounded-2xl bg-[#0a1121] border border-gray-700 p-6 text-white shadow-2xl">

            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">
              Telegram подключение
            </h2>

            <div className="space-y-4 text-sm">

              <p className="text-gray-300">
                Открой Telegram бота и отправь:
              </p>

              <div className="bg-black/40 border border-gray-700 rounded-xl p-4 text-center font-mono text-green-400 break-all">
                /start {code}
              </div>

              <p className="text-gray-400 text-xs leading-relaxed">
                После отправки команды Telegram
                автоматически привяжется к твоему
                аккаунту.
              </p>

            </div>
          </div>
        </div>
      )}
    </>
  );
}