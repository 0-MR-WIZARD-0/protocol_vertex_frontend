/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { api } from '../../shared/api/axios';

export default function AdminPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

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

  return (
    <div>
      <h1 className="text-xl mb-4">Админка</h1>

      <h2 className="mt-6 mb-2 font-bold">Цели</h2>
      {goals.map((g) => (
        <div key={g.id} className="border p-3 mb-2 rounded">
          <div>{g.title}</div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => action(`/moderation/goals/${g.id}/approve`)}
              className="text-green-600"
            >
              approve
            </button>

            <button
              onClick={() => action(`/moderation/goals/${g.id}/reject`)}
              className="text-red-600"
            >
              reject
            </button>
          </div>
        </div>
      ))}

      <h2 className="mt-6 mb-2 font-bold">Логи</h2>
      {logs.map((l) => (
        <div key={l.id} className="border p-3 mb-2 rounded">
          <div>{l.goal.title}</div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => action(`/moderation/logs/${l.id}/approve`)}
              className="text-green-600"
            >
              approve
            </button>

            <button
              onClick={() => action(`/moderation/logs/${l.id}/reject`)}
              className="text-red-600"
            >
              reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}