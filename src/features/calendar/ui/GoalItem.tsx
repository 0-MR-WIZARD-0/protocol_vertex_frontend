/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/axios';
import dayjs from 'dayjs';

export function GoalItem({ goal, date }: any) {
  const qc = useQueryClient();

  const today = dayjs().format('YYYY-MM-DD');
  const isFuture = date > today;
  const isFailed = goal?.isFailed;

  const slots = goal?.slots || [];
  const completedSlots = goal?.completedSlots || [];

  const day = goal?.day ?? { total: 0, done: 0, percent: 0 };
  const total = goal?.total ?? { total: 0, done: 0, percent: 0 };

  const sortedSlots = [...slots].sort((a, b) => {
    const get = (s: string) => {
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

    return get(a) - get(b);
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['day'] });
    qc.invalidateQueries({ queryKey: ['month'] });
  };

  const mark = useMutation({
    mutationFn: (slot: string) =>
      api.post(`/goals/${goal.id}/mark`, { date, timeSlot: slot }),
      onSuccess: refresh,
  });

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

  const deleteGoal = useMutation({
    mutationFn: (password: string) =>
      api.post(`/goals/${goal.id}/delete-request`, { password }),
    onSuccess: refresh,
  });

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3>Цель: {goal.title}</h3> 
          {goal.description && (
            <p>Описание: {goal.description}</p>
          )}
          {goal.dream && (
            <div className="mt-2 p-2 bg-purple-50 rounded">
              <div className="text-sm font-medium">
                Мечта 🌟: <a href={goal.dream.description}>{goal.dream.title}</a>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {isFailed && (
            <button
              className="text-yellow-600 text-xs"
              onClick={() => alert('Обжалование отправлено')}
            >
              обжаловать
            </button>
          )}

          <button
            onClick={() => {
              const password = prompt('Введите пароль');
              if (!password) return;
              deleteGoal.mutate(password);
            }}
            className="text-red-500 text-xs"
          >
            ❌
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {sortedSlots.map((slot) => {
          const done = completedSlots.includes(slot);

          return (
            <button
              key={slot}
              disabled={isFuture || isFailed}
              onClick={() =>
                done ? unmark.mutate(slot) : mark.mutate(slot)
              }
              className={`px-3 py-1 border rounded text-sm
                ${done ? 'bg-green-500 text-white' : ''}
                ${
                  isFuture || isFailed
                    ? 'opacity-40 cursor-not-allowed'
                    : ''
                }
              `}
            >
              {slot}
            </button>
          );
        })}
      </div>

      {isFailed && (
        <div className="text-red-500 text-sm">Цель провалена ❌</div>
      )}

      <div>
        <div className="text-xs text-gray-400 mb-1">
          Прогресс за день
        </div>
        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${day.percent}%` }}
          />
        </div>
        <div className="text-xs">
          {day.done}/{day.total} ({day.percent}%)
        </div>
      </div>

      <div>
        <div className="text-xs text-gray-400 mb-1">
          Общий прогресс цели
        </div>
        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-full bg-green-500"
            style={{ width: `${total.percent}%` }}
          />
        </div>
        <div className="text-xs">
          {total.done}/{total.total} ({total.percent}%)
        </div>
      </div>
    </div>
  );
}