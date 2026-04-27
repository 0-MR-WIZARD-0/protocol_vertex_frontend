'use client';

import { useState } from 'react';
import { api } from '../../../shared/api/axios';

export function CreateGoalModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [repeatType, setRepeatType] = useState('DAILY');
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [isDream, setIsDream] = useState(false);
  const [loading, setLoading] = useState(false);

  const create = async () => {
    if (!title || !deadline) {
      alert('Заполни обязательные поля');
      return;
    }

    try {
      setLoading(true);

      await api.post('/goals', {
        title,
        startDate: startDate || new Date().toISOString(),
        deadline,
        repeatType,
        repeatDays: [],
        timesPerDay,
        isDream,
      });

      onClose();
      location.reload();
    } catch (e) {
      console.error(e);
      alert('Ошибка создания цели');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[420px] space-y-4 shadow-lg">
        <h2 className="text-lg font-semibold">Создать цель</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div>
          <label className="text-sm text-gray-500">Начало</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">До</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <select
          className="w-full border p-2 rounded"
          value={repeatType}
          onChange={(e) => setRepeatType(e.target.value)}
        >
          <option value="DAILY">Каждый день</option>
          <option value="WEEKDAYS">Будни</option>
          <option value="WEEKENDS">Выходные</option>
        </select>

        <input
          type="number"
          min={1}
          className="w-full border p-2 rounded"
          value={timesPerDay}
          onChange={(e) => setTimesPerDay(Number(e.target.value))}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isDream}
            onChange={(e) => setIsDream(e.target.checked)}
          />
          Осуществить мечту (заявка с модерацией)
        </label>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 border rounded"
          >
            Отмена
          </button>

          <button
            onClick={create}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Создание...' : 'Создать'}
          </button>
        </div>
      </div>
    </div>
  );
}