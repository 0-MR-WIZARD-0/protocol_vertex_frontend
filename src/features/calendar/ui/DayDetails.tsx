/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { GoalItem } from '../ui/GoalItem';
import { TaskItem } from '../ui/TaskItem';

export function DayDetails({ data, date }: any) {
  if (!data) {
    return (
      <div className="text-gray-400 text-sm">
        Загрузка...
      </div>
    );
  }

  const goals = data.goals || [];
  const tasks = data.tasks || [];

  if (!goals.length && !tasks.length) {
    return (
      <div className="text-gray-500 text-sm">
        Нет задач и целей
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {tasks.map((task: any) => (
        <TaskItem key={task.id} task={task} date={date} />
      ))}

      {goals.map((goal: any) => (
        <GoalItem key={goal.id} goal={goal} date={date} />
      ))}

    </div>
  );
}