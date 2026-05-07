/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { api } from '../../shared/api/axios';
import { useSearchParams } from 'next/navigation';
import { TelegramConnect } from '@/src/features/telegram/TelegramConnect';

export default function NotificationsPage() {
  const params = useSearchParams();
  const presetGoalId = params.get('goalId');

  const [list, setList] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);

  const [times, setTimes] = useState<string[]>([]);
  const [customTime, setCustomTime] = useState('');
  const [goalId, setGoalId] = useState(presetGoalId || '');

  const load = async () => {
    const [nRes, gRes] = await Promise.all([
      api.get('/notifications'),
      api.get('/goals'),
    ]);

    setList(nRes.data);
    setGoals(gRes.data.filter((g: any) => g.status === 'APPROVED'));
  };

  useEffect(() => {
    load();
  }, []);

  const togglePreset = (t: string) => {
    setTimes((prev) =>
      prev.includes(t)
        ? prev.filter((x) => x !== t)
        : [...prev, t]
    );
  };

  const addCustomTime = () => {
    if (!customTime) return;

    if (!/^\d{2}:\d{2}$/.test(customTime)) {
      alert('Неверный формат времени');
      return;
    }

    if (!times.includes(customTime)) {
      setTimes((prev) => [...prev, customTime]);
    }

    setCustomTime('');
  };

  const create = async () => {
    if (!times.length) {
      alert('Выбери хотя бы одно время');
      return;
    }

    try {
      await api.post('/notifications', {
        goalId: goalId || null,
        times: [...new Set(times)],
      });

      setTimes([]);
      setCustomTime('');
      setGoalId('');

      load();
    } catch (e) {
      alert('Ошибка создания');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Удалить уведомление?')) return;

    await api.delete(`/notifications/${id}`);
    load();
  };

  const update = async (id: string) => {
    const input = prompt('Новое время (09:00,14:00)');
    if (!input) return;

    const arr = input.split(',').map((t) => t.trim());

    if (arr.some((t) => !/^\d{2}:\d{2}$/.test(t))) {
      alert('Ошибка формата времени');
      return;
    }

    await api.patch(`/notifications/${id}`, {
      times: [...new Set(arr)],
    });

    load();
  };

  return (
    <div className="space-y-6 text-white max-w-xl mx-auto">

      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold">Уведомления 🔔</h1>
        <TelegramConnect/>
      </div>

      <select
        value={goalId}
        onChange={(e) => setGoalId(e.target.value)}
        className="border p-2 w-full bg-[#0a1121]"
      >
        <option value="">Все цели</option>

        {goals.map((g) => (
          <option key={g.id} value={g.id}>
            {g.title}
          </option>
        ))}
      </select>

      <div className="flex gap-2 flex-wrap">
        {[
          { label: 'Утро', time: '09:00' },
          { label: 'День', time: '14:00' },
          { label: 'Вечер', time: '20:00' },
        ].map((p) => (
          <button
            key={p.time}
            onClick={() => togglePreset(p.time)}
            className={`px-3 py-1 border rounded ${
              times.includes(p.time) ? 'bg-green-600' : ''
            }`}
          >
            {p.label} ({p.time})
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="time"
          value={customTime}
          onChange={(e) => setCustomTime(e.target.value)}
          className="border p-2 bg-[#0a1121]"
        />

        <button
          onClick={addCustomTime}
          className="px-3 border rounded"
        >
          +
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {times.map((t) => (
          <div
            key={t}
            className="px-2 py-1 bg-green-600 rounded text-sm"
          >
            {t}
          </div>
        ))}
      </div>

      <button
        onClick={create}
        className="bg-green-600 px-4 py-2 rounded"
      >
        Создать уведомление
      </button>

      <div className="space-y-2">

        {list.length === 0 && (
          <div className="text-gray-400">
            Уведомлений нет
          </div>
        )}

        {list.map((n) => (
          <div
            key={n.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              🎯 {n.goal?.title || 'Все цели'}
              <br />
              ⏰ {n.times.join(', ')}
            </div>

            <div className="flex gap-2">
              <button onClick={() => update(n.id)}>✏️</button>
              <button onClick={() => remove(n.id)}>❌</button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}