/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../../shared/api/axios';

export default function AppealsPage() {
  const params = useSearchParams();

  const goalId = params.get('goalId');
  const date = params.get('date');

  const [data, setData] = useState<any>(null);
  const [appeals, setAppeals] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [message, setMessage] = useState('');

  const loadAppeals = async () => {
    const res = await api.get('/appeals/my');
    setAppeals(res.data);
  };

  useEffect(() => {
    if (goalId && date) {
      api
        .get(`/goals/${goalId}/day?date=${date}`)
        .then((res) => setData(res.data));
    }

    loadAppeals();
  }, [goalId, date]);

  const send = async () => {
    if (!selectedSlot) {
      alert('Выбери слот');
      return;
    }

    await api.post('/appeals', {
      goalId,
      date,
      timeSlot: selectedSlot,
      message,
    });

    setMessage('');
    setSelectedSlot('');

    await loadAppeals();

    alert('Отправлено на модерацию');
  };

  if (!data && goalId) return <div>Загрузка...</div>;

  return (
    <div className="space-y-6 text-white">

      {goalId && date && (
        <>
          <div className="space-y-2">
            <div className="text-sm text-gray-400">
              Выбери невыполненный слот:
            </div>

            <div className="flex gap-2 flex-wrap">
              {data?.missed?.map((slot: string) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-1 border rounded
                    ${selectedSlot === slot ? 'bg-green-600' : ''}
                  `}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <textarea
            placeholder="Опишите причину"
            className="w-full p-3 border rounded bg-[#0a1121]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            onClick={send}
            className="bg-green-600 px-4 py-2 rounded"
          >
            Отправить
          </button>
        </>
      )}

      <div className="space-y-2">
        <div className="font-semibold">
          Заявки на обжалование: {appeals.length}
        </div>

        {appeals.length === 0 ? (
          <></>
        ) : (
          appeals.map((a) => (
            <div key={a.id} className="border p-3 rounded">
              <div className="text-sm">
                <b>Цель:</b> {a.goal?.title}
              </div>

              <div className="text-sm">
                <b>Слот:</b> {a.timeSlot}
              </div>

              <div className="text-sm">
                <b>Дата:</b>{' '}
                {new Date(a.date).toLocaleDateString()}
              </div>

              <div className="text-sm mt-1">
                {a.message}
              </div>

              <div className="text-xs mt-2">
                Статус:{' '}
                <span
                  className={
                    a.status === 'PENDING'
                      ? 'text-yellow-400'
                      : a.status === 'APPROVED'
                      ? 'text-green-400'
                      : 'text-red-400'
                  }
                >
                  {a.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}