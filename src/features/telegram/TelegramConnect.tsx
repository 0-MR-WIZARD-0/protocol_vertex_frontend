"use client";

import { useEffect, useState } from "react";
import { api } from "../../shared/api/axios";
import { useAuthStore } from "../../shared/store/useAuthStore";

export function TelegramConnect() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const isConnected = !!user?.telegramId;

  const connect = async () => {
    try {
      setLoading(true);

      const res = await api.post("/users/telegram-code");

      setCode(res.data.code);
      setOpen(true);
    } catch {
      alert("Ошибка подключения");
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    const confirmDisconnect = confirm("Отвязать Telegram?");

    if (!confirmDisconnect) return;

    try {
      setLoading(true);

      await api.delete("/users/telegram");

      setUser({
        ...user!,
        telegramId: null
      });

      alert("Telegram отвязан");
    } catch {
      alert("Ошибка отвязки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.get("/auth/me");

        if (res.data?.telegramId) {
          setUser(res.data);

          setOpen(false);

          clearInterval(interval);
        }
      } catch {
        //
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [open, setUser]);

  return (
    <>
      <button
        disabled={loading}
        onClick={isConnected ? disconnect : connect}
        className={`
          w-full rounded-2xl py-2 text-white transition 
          ${isConnected ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}

          ${loading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {isConnected ? "Отвязать Telegram" : "Подключить Telegram"}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0a1121] border border-gray-700 p-6 text-white shadow-2xl">
            <button onClick={() => setOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl">
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Telegram подключение</h2>
            <div className="space-y-4 text-sm">
              <p className="text-gray-300">Открой Telegram бота и отправь:</p>
              <div className="bg-black/40 border border-gray-700 rounded-xl p-4 text-center font-mono text-green-400 break-all">/start {code}</div>
              <div className="text-center text-xs text-gray-400">Ожидаем подтверждение...</div>
              <p className="text-gray-400 text-xs leading-relaxed">После отправки команды Telegram автоматически привяжется к твоему аккаунту.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
