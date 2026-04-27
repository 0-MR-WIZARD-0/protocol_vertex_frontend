/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/axios';
import dayjs from 'dayjs';

const labels = {
  morning: 'Утро',
  day: 'День',
  evening: 'Вечер',
};

export function GoalItem({ goal, date }: any) {
  const qc = useQueryClient();

  const isDone =
    goal.completedTimes.length === goal.times.length;

  // ✅ выполнение
  const mark = useMutation({
    mutationFn: (slot: string) =>
      api.post(`/goals/${goal.id}/mark`, {
        date,
        timeSlot: slot,
      }),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['day'] });
      qc.invalidateQueries({ queryKey: ['month'] });
    },
  });

  // 🔐 отмена выполнения
  const unmark = useMutation({
  mutationFn: async (slot: string) => {
    const password = prompt('Введите пароль');

    if (!password) {
      throw new Error('Password required'); // ✅
    }

    return api.post(`/goals/${goal.id}/unmark`, {
      date,
      timeSlot: slot,
      password,
    });
  },

  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['day'] });
    qc.invalidateQueries({ queryKey: ['month'] });
  },
});

const deleteGoal = useMutation({
  mutationFn: (password: string) =>
    api.post(`/goals/${goal.id}/delete-request`, {
      password,
    }),

  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['day'] });
    qc.invalidateQueries({ queryKey: ['month'] });
  },
});

  const daysLeft = Math.max(
    0,
    dayjs(goal.deadline).endOf('day').diff(dayjs(date), 'day'),
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">
      <div className="flex justify-between items-center">
        <div className="font-medium">{goal.title}</div>

            <button
                onClick={() => {
                    const password = prompt('Введите пароль для удаления');
                    if (!password) return;

                    deleteGoal.mutate(password);
                }}
                className="text-red-500 text-xs"
                >
                удалить
            </button>
      </div>

      <div className="flex gap-2">
        {goal.times.map((t: string) => {
          const done = goal.completedTimes.includes(t);

          return (
            <button
              key={t}
              onClick={() =>
                done ? unmark.mutate(t) : mark.mutate(t)
              }
              className={`px-3 py-1 rounded border text-sm transition
                ${
                  done
                    ? 'bg-green-500 text-white border-green-500'
                    : 'hover:bg-gray-100'
                }
              `}
            >
              {labels[t]}
            </button>
          );
        })}
      </div>

      {isDone && (
            <div className="text-green-600 text-sm">
            Завершена: {dayjs().format('DD.MM.YYYY')} ✅ 
            </div>
        )}

        <div>
            До завершения цели: {daysLeft} дней
        </div>
    </div>
  );
}