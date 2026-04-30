/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { GoalItem } from '../ui/GoalItem';
import { TaskItem } from '../ui/TaskItem';

export function DayDetails({ data, date }: any) {
  const [tab, setTab] = useState<'goals' | 'tasks'>('goals');

  if (!data) {
    return <div className="text-gray-400 text-sm">Загрузка...</div>;
  }

  const goals = data.goals || [];
  const tasks = data.tasks || [];

  const renderTab = (type: 'goals' | 'tasks', label: string) => {
    const isActive = tab === type;

    return (
      <button
        onClick={() => setTab(type)}
        className={`
          px-4 py-2 rounded-lg border transition

          ${
            isActive
              ? 'bg-green-600 text-white border-green-600'
              : 'text-white border-gray-600 hover:bg-green-600'
          }
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
    <div className="space-y-4">

      <div className="flex justify-center gap-3">
        {renderTab('goals', 'Цели')}
        {renderTab('tasks', 'Задачи')}
      </div>

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