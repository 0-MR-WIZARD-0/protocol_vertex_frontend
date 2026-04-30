/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/axios';
import dayjs from 'dayjs';

export function TaskItem({ task, date }: any) {
  const qc = useQueryClient();

  const today = dayjs().format('YYYY-MM-DD');
  const isFuture = dayjs(task.date).format('YYYY-MM-DD') > today;

  const refresh = async () => {
    await qc.refetchQueries({ queryKey: ['day', date] });
    await qc.refetchQueries({ queryKey: ['month'] });
  };

  const toggle = useMutation({
    mutationFn: () =>
      api.post(`/tasks/${task.id}/toggle`),
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: () =>
      api.delete(`/tasks/${task.id}`),
    onSuccess: refresh,
  });

  const move = useMutation({
    mutationFn: (newDate: string) =>
      api.post(`/tasks/${task.id}/move`, {
        date: newDate,
      }),
    onSuccess: refresh,
  });

  return (
    <div className="border p-3 rounded-xl shadow flex justify-between items-center">

      <div className="flex items-center gap-3">
        <button
            disabled={isFuture}
            onClick={() => toggle.mutate()}
            className={`w-5 h-5 rounded border flex items-center justify-center
                ${task.isDone ? 'bg-green-500 text-white' : ''}
                ${isFuture ? 'opacity-40 cursor-not-allowed' : ''}
            `}
            >
            {task.isDone && '✓'}
        </button>

        <div>
          <div className={`font-medium ${task.isDone ? 'line-through' : ''}`}>
            Задача: {task.title}
          </div>

          {task.description && (
            <div className={`text-xs ${task.isDone ? 'line-through' : ''}`}>
              Описание: {task.description}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">

        <input
            type="date"
            min={dayjs().format('YYYY-MM-DD')}
            value={dayjs(task.date).format('YYYY-MM-DD')}
            disabled={task.isDone}
            onChange={(e) => move.mutate(e.target.value)}
            className={`text-xs border rounded px-1
                ${task.isDone ? 'opacity-40 cursor-not-allowed' : ''}
            `}
        />

        <button
          onClick={() => remove.mutate()}
          className="text-red-500 text-xs"
        >
          ❌
        </button>

      </div>
    </div>
  );
}