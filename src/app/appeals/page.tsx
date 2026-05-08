/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import { api } from '../../shared/api/axios';
import { useAuthStore } from '../../shared/store/useAuthStore';
import type {Appeal} from '../../types/appeal.types';

interface GoalDayResponse {
  slots: string[];
  completed: string[];
  missed: string[];
}

export default function AppealsPage() {
  const user = useAuthStore(
    (s) => s.user,
  );

  const params = useSearchParams();

  const goalId = params.get('goalId');
  const date = params.get('date');

  const [data, setData] = useState<GoalDayResponse | null>(null);
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [message, setMessage] = useState('');

  const loadAppeals =
    async () => {
      const res = await api.get<Appeal[]>(
          user?.role ===
            'ADMIN'
            ? '/appeals'
            : '/appeals/my',
        );
      setAppeals(res.data);
    };

  const approve =
    async (id: string) => {
      await api.patch(`/appeals/${id}/approve`);
      loadAppeals();
    };

  const reject =
    async (id: string) => {
      await api.patch(`/appeals/${id}/reject`);
      loadAppeals();
    };

  useEffect(() => {
    if (goalId && date) {
      api
        .get<GoalDayResponse>(`/goals/${goalId}/day?date=${date}`)
        .then((res) => setData(res.data));
    }
    loadAppeals();
  }, [goalId, date]);

  const send = async () => {
    if (!selectedSlot) {
      alert('Выбери слот');
      return;
    }

    await api.post('/appeals',
      {
        goalId,
        date,
        timeSlot:
          selectedSlot,
        message,
      },
    );

    setMessage('');
    setSelectedSlot('');
    await loadAppeals();
    alert('Отправлено на модерацию');
  };

  if (!data && goalId) {
    return (
      <div>Загрузка...</div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      {goalId && date && (
        <>
          <div className="space-y-2">
            <div className="text-sm text-gray-400">
              Выбери невыполненный слот:
            </div>
            <div className="flex flex-wrap gap-2">
              {data?.missed?.map(
                (slot) => (
                  <button
                    key={slot}
                    onClick={() =>
                      setSelectedSlot(
                        slot,
                      )
                    }
                    className={`rounded border px-3 py-1
                      ${
                        selectedSlot ===
                        slot
                          ? 'bg-green-600'
                          : ''
                      }
                    `}
                  >
                    {slot}
                  </button>
                ),
              )}
            </div>
          </div>
          <textarea
            placeholder="Опишите причину"
            className="w-full rounded border bg-[#0a1121] p-3"
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value,
              )
            }
          />
          <button
            onClick={send}
            className="rounded bg-green-600 px-4 py-2"
          >
            Отправить
          </button>
        </>
      )}
      <div className="space-y-2">
        <div className="font-semibold">
          Заявки на обжалование:{' '}
          {appeals.length}
        </div>
        {appeals.length === 0 ? null : (appeals.map((a) => (
            <div
              key={a.id}
              className="rounded border p-3"
            >
              <div className="text-sm">
                <b>Цель:</b>{' '}
                {
                  a.goal
                    ?.title
                }
              </div>
              <div className="text-sm">
                <b>Слот:</b>{' '}
                {a.timeSlot}
              </div>
              <div className="text-sm">
                <b>Дата:</b>{' '}
                {new Date(
                  a.date,
                ).toLocaleDateString()}
              </div>
              <div className="mt-1 text-sm">
                {a.message}
              </div>
              <div className="mt-2 text-xs">
                Статус:{' '}
                <span
                  className={
                    a.status ===
                    'PENDING'
                      ? 'text-yellow-400'
                      : a.status ===
                        'APPROVED'
                      ? 'text-green-400'
                      : 'text-red-400'
                  }
                >
                  {a.status}
                </span>
              </div>
              {user?.role ===
                'ADMIN' &&
                a.status ===
                  'PENDING' && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() =>
                        approve(
                          a.id,
                        )
                      }
                      className="
                        rounded-lg
                        bg-green-600
                        px-3
                        py-1
                        text-sm
                        transition
                        hover:bg-green-700
                      "
                    >
                      Принять
                    </button>
                    <button
                      onClick={() =>
                        reject(
                          a.id,
                        )
                      }
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
                      Отклонить
                    </button>
                  </div>
                )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}