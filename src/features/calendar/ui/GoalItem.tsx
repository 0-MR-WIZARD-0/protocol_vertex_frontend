/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/axios';
import dayjs from 'dayjs';

export function GoalItem({ goal, date }: any) {

  console.log('FRONT TOTAL', goal.total);
  const qc = useQueryClient();

  const today = dayjs().format('YYYY-MM-DD');
  const isFuture = date > today;

  // ✅ SAFE
  const slots = goal?.slots || [];
  const completedSlots = goal?.completedSlots || [];

  const day = goal?.day ?? { total: 0, done: 0, percent: 0 };
  const total = goal?.total ?? { total: 0, done: 0, percent: 0 };

  // ✅ сортировка
  const getTimeValue = (s: string) => {
    if (s === 'morning') return 6;
    if (s === 'day') return 12;
    if (s === 'evening') return 18;

    if (/^\d{2}:\d{2}$/.test(s)) {
      const [h, m] = s.split(':').map(Number);
      return h + m / 60;
    }

    if (/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(s)) {
      const [start] = s.split('-');
      const [h, m] = start.split(':').map(Number);
      return h + m / 60;
    }

    return 999;
  };

  const sortedSlots = [...slots].sort(
    (a, b) => getTimeValue(a) - getTimeValue(b),
  );

  const isDayDone = day.total > 0 && day.done === day.total;

  // 🔥 ОБНОВЛЕНИЕ ДАННЫХ (ключевой фикс)
  const refresh = async () => {
    await qc.refetchQueries({ queryKey: ['day', date] });
    await qc.refetchQueries({ queryKey: ['month'] });
  };

  // 🔥 MARK
  const mark = useMutation({
    mutationFn: (slot: string) =>
      api.post(`/goals/${goal.id}/mark`, { date, timeSlot: slot }),

    onSuccess: refresh,
  });

  // 🔐 UNMARK
  const unmark = useMutation({
    mutationFn: async (slot: string) => {
      const password = prompt('Введите пароль');
      if (!password) throw new Error('Password required');

      return api.post(`/goals/${goal.id}/unmark`, {
        date,
        timeSlot: slot,
        password,
      });
    },

    onSuccess: refresh,
  });

  // ❌ DELETE
  const deleteGoal = useMutation({
    mutationFn: (password: string) =>
      api.post(`/goals/${goal.id}/delete-request`, { password }),

    onSuccess: refresh,
  });

  const daysLeft = Math.max(
    0,
    dayjs(goal.deadline).endOf('day').diff(dayjs(date), 'day'),
  );

  const getLabel = (slot: string) => {
    if (slot === 'morning') return 'Утро ☀️';
    if (slot === 'day') return 'День 🌤️';
    if (slot === 'evening') return 'Вечер 🌙';
    return slot;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-4">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="font-medium">{goal.title}</div>

        <button
          onClick={() => {
            const password = prompt('Введите пароль для удаления');
            if (!password) return;
            deleteGoal.mutate(password);
          }}
          className="text-red-500 text-xs hover:underline"
        >
          удалить
        </button>
      </div>

      {/* СЛОТЫ */}
      <div className="flex flex-wrap gap-2">
        {sortedSlots.map((slot) => {
          const done = completedSlots.includes(slot);

          return (
            <button
              key={slot}
              disabled={isFuture}
              onClick={() =>
                done ? unmark.mutate(slot) : mark.mutate(slot)
              }
              className={`px-3 py-1 rounded border text-sm
                ${done ? 'bg-green-500 text-white border-green-500' : ''}
                ${
                  isFuture
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-gray-100'
                }
              `}
            >
              {getLabel(slot)}
            </button>
          );
        })}
      </div>

      {/* 🔵 ПРОГРЕСС ЗА ДЕНЬ */}
      <div>
        <div className="text-xs text-gray-400 mb-1">
          Прогресс за день
        </div>

        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-full bg-blue-500 rounded transition-all"
            style={{ width: `${day.percent}%` }}
          />
        </div>

        <div className="text-xs text-gray-500 mt-1">
          {day.done}/{day.total} ({day.percent}%)
        </div>
      </div>

      {/* 🟢 ОБЩИЙ ПРОГРЕСС */}
      <div>
        <div className="text-xs text-gray-400 mb-1">
          Общий прогресс цели
        </div>

        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-full bg-green-500 rounded transition-all"
            style={{ width: `${total.percent}%` }}
          />
        </div>

        <div className="text-xs text-gray-500 mt-1">
          {total.done}/{total.total} ({total.percent}%)
        </div>
      </div>

      {/* STATUS */}
      {isDayDone ? (
        <div className="text-green-600 text-sm">
          Выполнено за день ✅
        </div>
      ) : (
        <div className="text-gray-500 text-sm">
          До завершения: {daysLeft} дней
        </div>
      )}
    </div>
  );
}