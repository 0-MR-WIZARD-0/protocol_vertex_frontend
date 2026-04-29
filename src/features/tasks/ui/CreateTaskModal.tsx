/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { api } from '../../../shared/api/axios';
import { useQueryClient } from '@tanstack/react-query';

export function CreateTaskModal({ onClose }: any) {
  const qc = useQueryClient();

  const today = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);

  const create = async () => {
    if (!title) {
      alert('Введите название');
      return;
    }

    try {
      setLoading(true);

      await api.post('/tasks', {
        title,
        description,
        date,
      });

      qc.invalidateQueries({ queryKey: ['day'] });
      qc.invalidateQueries({ queryKey: ['month'] });

      onClose();
    } catch {
      alert('Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
        <h2>Создать задачу</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="date"
          min={today}
          className="w-full border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Отмена</button>
          <button onClick={create} disabled={loading}>
            Создать
          </button>
        </div>
      </div>
    </div>
  );
}