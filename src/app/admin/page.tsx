/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import {useEffect, useState} from 'react';
import { api } from '../../shared/api/axios';
import type {Goal, GoalLog} from '../../types/goal.types';
import type { User } from '../../types/user.types';

interface ModerationGoal
  extends Goal {
  user?: User;
}

interface ModerationLog
  extends GoalLog {
  goal: Goal & {
    user?: User;
  };
}

export default function AdminPage() {
  const [goals, setGoals] = useState<ModerationGoal[]>([]);
  const [logs, setLogs] = useState<ModerationLog[]>([]);

  const load = async () => {
    const [g, l] =
      await Promise.all([
        api.get<ModerationGoal[]>('/moderation/goals'),
        api.get<ModerationLog[]>('/moderation/logs'),
      ]);
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
    if (slot === 'morning') {
      return 'Утро ☀️';
    }
    if (slot === 'day') {
      return 'День 🌤️';
    }
    if (slot === 'evening') {
      return 'Вечер 🌙';
    }
    return slot;
  };

  return (
    <div className="space-y-6 text-white">
      <div>
        <h2 className="mb-3 font-bold">Заявки на модерацию:</h2>
        {goals.map((g) => (
          <div
            key={g.id}
            className="mb-3 rounded border p-3"
          >
            <p className="mt-1 font-medium">
              Email:{' '}
              {g.user?.email}
            </p>
            <p className="mt-1 font-medium">
              Цель: {g.title}
            </p>
            {g.dream && (
              <div className="mt-1 font-medium">
                {g.dream.description && (
                  <a
                    href={g.dream.description}
                    target="_blank"
                    className="underline"
                  >
                    Мечта:{' '}
                    {g.dream.title}
                  </a>
                )}
              </div>
            )}
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => action(`/moderation/goals/${g.id}/approve`)}
                className="font-medium text-green-600"
              >
                Принять
              </button>
              <button
                onClick={() => action(`/moderation/goals/${g.id}/reject`)}
                className="font-medium text-red-600"
              >
                Отклонить
              </button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="mb-3 font-bold">Логи:</h2>
        {logs.map((l) => (
          <div
            key={l.id}
            className="mb-2 rounded border p-3"
          >
            <div className="mt-1 font-medium">
              Email:{' '}
              {l.goal.user?.email}
            </div>
            <div className="mt-1 font-medium">
              Цель:{' '}
              {l.goal.title}
            </div>
            <div className="mt-1 font-medium">
              Действие:{' '}
              {getSlotLabel(l.timeSlot)}
            </div>
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => action(`/moderation/logs/${l.id}/approve`)}
                className="font-medium text-green-600"
              >
                Выполнено
              </button>
              <button
                onClick={() => action(`/moderation/logs/${l.id}/reject`)}
                className="font-medium text-red-600"
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