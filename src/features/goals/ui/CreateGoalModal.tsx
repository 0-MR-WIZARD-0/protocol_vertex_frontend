'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/axios';

export function CreateGoalModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [deadline, setDeadline] = useState('');

  const [repeatType, setRepeatType] = useState('DAILY');
  const [isDream, setIsDream] = useState(false);

  const [slots, setSlots] = useState<string[]>([]);
  const [customTime, setCustomTime] = useState('');
  const [interval, setIntervalValue] = useState('');

  const [loading, setLoading] = useState(false);

  const addSlot = (slot: string) => {
    if (!slots.includes(slot)) setSlots((prev) => [...prev, slot]);
  };

  const addCustomTime = () => {
    if (!/^\d{2}:\d{2}$/.test(customTime)) {
      alert('Формат времени: 13:00');
      return;
    }

    if (!slots.includes(customTime)) {
      setSlots((prev) => [...prev, customTime]);
    }

    setCustomTime('');
  };

  const addInterval = () => {
    if (!/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(interval)) {
      alert('Формат интервала: 14:00-16:00');
      return;
    }

    const [start, end] = interval.split('-');

    if (start >= end) {
      alert('Интервал не может идти назад');
      return;
    }

    if (!slots.includes(interval)) {
      setSlots((prev) => [...prev, interval]);
    }

    setIntervalValue('');
  };

  const removeSlot = (slot: string) => {
    setSlots((prev) => prev.filter((s) => s !== slot));
  };

  const create = async () => {
    if (!title || !deadline) {
      alert('Заполни обязательные поля');
      return;
    }

    if (startDate < today) {
      alert('Нельзя создать цель в прошлом');
      return;
    }

    if (deadline < today) {
      alert('Дедлайн не может быть в прошлом');
      return;
    }

    // 🔥 если нет слотов → обычная цель
    const finalSlots = slots.length > 0 ? slots : ['day'];

    try {
      setLoading(true);

      await api.post('/goals', {
        title,
        description: description || null,
        startDate,
        deadline,
        repeatType,
        repeatDays: [],
        slots: finalSlots,
        isDream,
      });

      qc.invalidateQueries({ queryKey: ['day'] });
      qc.invalidateQueries({ queryKey: ['month'] });

      onClose();
    } catch (e) {
      console.error(e);
      alert('Ошибка создания цели');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[440px] space-y-4 shadow-lg">
        <h2 className="text-lg font-semibold">Создать цель</h2>

        <input
          required
          className="w-full border p-2 rounded"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Описание (необязательно)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="date"
          min={today}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          required
          type="date"
          min={today}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <select
          value={repeatType}
          onChange={(e) => setRepeatType(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="DAILY">Каждый день</option>
          <option value="WEEKDAYS">Будни</option>
          <option value="WEEKENDS">Выходные</option>
        </select>

        {/* SLOT UI */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Когда выполнять</div>

          <div className="flex gap-2">
            <button onClick={() => addSlot('morning')} className="btn">Утро</button>
            <button onClick={() => addSlot('day')} className="btn">День</button>
            <button onClick={() => addSlot('evening')} className="btn">Вечер</button>
          </div>

          <div className="flex gap-2">
            <input
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              placeholder="13:00"
              className="border p-2 rounded w-full"
            />
            <button onClick={addCustomTime}>+</button>
          </div>

          <div className="flex gap-2">
            <input
              value={interval}
              onChange={(e) => setIntervalValue(e.target.value)}
              placeholder="14:00-16:00"
              className="border p-2 rounded w-full"
            />
            <button onClick={addInterval}>+</button>
          </div>

          <div className="flex flex-wrap gap-2">
            {slots.map((s) => (
              <div key={s} onClick={() => removeSlot(s)} className="chip">
                {s} ✕
              </div>
            ))}
          </div>
        </div>

        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={isDream}
            onChange={(e) => setIsDream(e.target.checked)}
          />
          Требует подтверждения
        </label>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Отмена</button>
          <button onClick={create} disabled={loading}>
            {loading ? 'Создание...' : 'Создать'}
          </button>
        </div>
      </div>
    </div>
  );
}