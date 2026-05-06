/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { GoalItem } from '../ui/GoalItem';
import { TaskItem } from '../ui/TaskItem';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/shared/api/axios';

export function DayDetails({ data, date }: any) {
  const [tab, setTab] = useState<'goals' | 'tasks'>('goals');

  const { data: pendingCount } = useQuery({
    queryKey: ['pending-goals'],
    queryFn: () =>
      api.get('/goals/pending-count').then((r) => r.data),
  });

  if (!data) {
    return <div className="text-white text-sm">Загрузка...</div>;
  }

  const goals = data.goals || [];
  const tasks = data.tasks || [];

  const renderTab = (type: 'goals' | 'tasks', label: string) => {
    const isActive = tab === type;

    return (
      <button
        onClick={() => setTab(type)}
        className={`
          px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base
          ${isActive
            ? 'bg-green-600 text-white border-green-600'
            : 'text-white border-gray-600'}
        `}
      >
        {label}
      </button>
    );
  };

  const emptyState =
    tab === 'goals'
      ? 'Нет целей'
      : 'Задачи на день отсутствуют';

  return (
    <div className="space-y-4 px-2 sm:px-0">

      <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
        {renderTab('goals', 'Цели')}
        {renderTab('tasks', 'Задачи')}
      </div>

      {pendingCount > 0 && (
        <div className="text-white text-xs sm:text-sm text-center">
          Целей на модерации: {pendingCount}
        </div>
      )}

      {tab === 'goals' && (
        goals.length ? (
          goals.map((goal: any) => (
            <GoalItem key={goal.id} goal={goal} date={date} />
          ))
        ) : (
          <div className="text-white text-sm text-center">
            {emptyState}
          </div>
        )
      )}

      {tab === 'tasks' && (
        tasks.length ? (
          tasks.map((task: any) => (
            <TaskItem key={task.id} task={task} date={date} />
          ))
        ) : (
          <div className="text-white text-sm text-center">
            {emptyState}
          </div>
        )
      )}
    </div>
  );
}