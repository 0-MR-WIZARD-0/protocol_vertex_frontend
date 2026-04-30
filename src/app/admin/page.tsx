/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { api } from '../../shared/api/axios';

export default function AdminPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  console.log(goals);

  const load = async () => {
    const g = await api.get('/moderation/goals');
    const l = await api.get('/moderation/logs');

    setGoals(g.data);
    setLogs(l.data);
  };

  const action = async (url: string) => {
    await api.patch(url);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  const getSlotLabel = (slot: string) => {
    if (slot === 'morning') return 'Утро ☀️';
    if (slot === 'day') return 'День 🌤️';
    if (slot === 'evening') return 'Вечер 🌙';
    return slot;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold mb-3">Заявки на модерацию:</h2>
        {goals.map((g) => (
          <div key={g.id} className="border p-3 mb-2 rounded">

            <div className="font-medium">
                Email: {g.user?.email}
            </div>

            <div className="font-medium mt-1">
              Цель: {g.title}
            </div>

            {g.dream && (
              <div className="mt-1">
                {g.dream.description && (
                  <a
                    href={g.dream.description}
                    target="_blank"
                    className="underline"
                  >
                    Мечта: {g.dream.title}
                  </a>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-3">
              <button
                onClick={() =>
                  action(`/moderation/goals/${g.id}/approve`)
                }
                className="text-green-600"
              >
                Принять
              </button>

              <button
                onClick={() =>
                  action(`/moderation/goals/${g.id}/reject`)
                }
                className="text-red-600"
              >
                Отклонить
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-bold mb-3">Логи:</h2>

        {logs.map((l) => (
          <div key={l.id} className="border p-3 mb-2 rounded">

            <div className="font-medium">
                Email: {l.user?.email}
            </div>

            <div className="font-medium">
              Цель: {l.goal.title}
            </div>

            <div className="mt-1">
              Действие: {getSlotLabel(l.timeSlot)}
            </div>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() =>
                  action(`/moderation/logs/${l.id}/approve`)
                }
                className="text-green-600"
              >
                Выполнено
              </button>

              <button
                onClick={() =>
                  action(`/moderation/logs/${l.id}/reject`)
                }
                className="text-red-600"
              >
                Не выполнено
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}