/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import { api } from '../../shared/api/axios';
import { TelegramConnect } from '@/src/features/telegram/TelegramConnect';
import type {Goal} from '../../types/goal.types';
import type {NotificationSetting} from '../../types/notification.types';

export default function NotificationsPage() {

  const params = useSearchParams();

  const presetGoalId = params.get('goalId');

  const [list, setList] = useState<NotificationSetting[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [times, setTimes] = useState<string[]>([]);
  const [customTime, setCustomTime] = useState('');
  const [goalId, setGoalId] = useState(presetGoalId || '');

  const load = async () => {
    const [nRes, gRes] =
      await Promise.all([
        api.get<NotificationSetting[]>('/notifications'),
        api.get<Goal[]>('/goals'),
      ]);
    setList(nRes.data);
    setGoals(
      gRes.data.filter(
        (g) =>
          g.status ===
          'APPROVED',
      ),
    );
  };

  useEffect(() => {
    load();
  }, []);

  const togglePreset = (t: string) => {
    setTimes((prev) =>
      prev.includes(t)
        ? prev.filter(
            (x) => x !== t,
          )
        : [...prev, t],
    );
  };

  const addCustomTime = () => {
      if (!customTime) {
        return;
      }
      
      if (
        !/^\d{2}:\d{2}$/.test(
          customTime,
        )
      ) {
        alert('Неверный формат времени');
        return;
      }

      if (!times.includes(customTime)
      ) {
        setTimes((prev) => [...prev, customTime]);
      }

      setCustomTime('');
    };

  const create =
    async () => {
      if (!times.length) {
        alert('Выбери хотя бы одно время');
        return;
      }

      try {
        await api.post('/notifications', {
            goalId:
              goalId || null,
            times: [
              ...new Set(times),
            ],
          },
        );
        setTimes([]);
        setCustomTime('');
        setGoalId('');
        load();
      } catch {
        alert('Ошибка создания');
      }
    };

  const remove = async (id: string) => {
      const confirmed = confirm('Удалить уведомление?');
      if (!confirmed) {
        return;
      }
      await api.delete(`/notifications/${id}`);
      load();
    };

  const update = async (id: string) => {
      const input = prompt('Новое время (09:00,14:00)');
      if (!input) {
        return;
      }
      const arr = input
        .split(',')
        .map((t) =>
          t.trim(),
        );
      if (
        arr.some(
          (t) =>
            !/^\d{2}:\d{2}$/.test(
              t,
            ),
        )
      ) {
        alert('Ошибка формата времени');
        return;
      }

      await api.patch(`/notifications/${id}`,
        {
          times: [
            ...new Set(arr),
          ],
        },
      );

      load();
    };

  return (
    <div className="mx-auto max-w-xl space-y-6 text-white">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold">Уведомления 🔔</h1>
        <TelegramConnect />
      </div>
      <select
        value={goalId}
        onChange={(e) => setGoalId(e.target.value)}
        className="
          w-full
          rounded-2xl
          border
          border-gray-700
          bg-[#0a1121]
          p-3
          text-white
          outline-none
        "
      >
        <option value="">
          Все цели
        </option>
        {goals.map((g) => (
          <option
            key={g.id}
            value={g.id}
          >
            {g.title}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2">
        {[
          {
            label: 'Утро',
            time: '09:00',
          },

          {
            label: 'День',
            time: '14:00',
          },

          {
            label: 'Вечер',
            time: '20:00',
          },
        ].map((p) => (
          <button
            key={p.time}
            onClick={() => togglePreset(p.time)}
            className={`rounded-xl border px-3 py-2 text-sm transition
              ${
                times.includes(
                  p.time,
                )
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-gray-700 bg-black/30 hover:bg-white/5'
              }
            `}
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
          className="
            w-full
            rounded-2xl
            border
            border-gray-700
            bg-[#0a1121]
            p-3
            text-white
            outline-none
          "
        />
        <button
          onClick={addCustomTime}
          className="
            rounded-2xl
            border
            border-gray-700
            bg-black/30
            px-4
            transition
            hover:bg-white/5
          "
        >
          +
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {times.map((t) => (
          <div
            key={t}
            className="
              rounded-xl
              bg-green-600
              px-3
              py-2
              text-sm
            "
          >
            {t}
          </div>
        ))}
      </div>
      <button
        onClick={create}
        className="
          w-full
          rounded-2xl
          bg-green-600
          p-3
          font-medium
          transition
          hover:bg-green-700
        "
      >
        Создать уведомление
      </button>
      <div className="space-y-3">
        {list.length === 0 && (<div className="text-gray-400">Уведомлений нет</div>)}
        {list.map((n) => (
          <div
            key={n.id}
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-gray-700
              bg-black/20
              p-4
            "
          >
            <div>
              <div className="font-medium">
                🎯{' '}
                {n.goal
                  ?.title ||
                  'Все цели'}
              </div>
              <div className="mt-1 text-sm text-gray-400">
                ⏰{' '}
                {n.times.join(
                  ', ',
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => update(n.id)}
                className="
                  rounded-lg
                  bg-blue-600
                  px-3
                  py-1
                  text-sm
                  transition
                  hover:bg-blue-700
                "
              >
                ✏️
              </button>
              <button
                onClick={() => remove(n.id)}
                className="
                  rounded-lg
                  bg-red-600
                  px-3
                  py-1
                  text-sm
                  transition
                  hover:bg-red-700
                "
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}