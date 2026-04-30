'use client';

import { useState } from 'react';
import { CreateGoalModal } from '../../../features/goals/ui/CreateGoalModal';
import { CreateTaskModal } from '../../tasks/ui/CreateTaskModal';

export function ActionTabs() {
  const [open, setOpen] = useState<null | 'goal' | 'task' | 'reminder'>(null);

  const tab = (type: typeof open, label: string) => {
    const isActive = open === type;

    return (
      <button
        onClick={() => setOpen(type)}
        className={`
          px-4 py-2 rounded-lg border transition

          ${isActive
            ? 'bg-green-600 text-white border-green-600'
            : 'text-white border hover:bg-green-500 hover:text-black'
          }
        `}
      >
        {label}
      </button>
    );
  };

  return (
    <>
      <div className="flex gap-3 mb-6">
        {tab('goal', 'Создать цель')}
        {tab('task', 'Создать задачу')}
        {tab('reminder', 'Создать напоминание')}
      </div>

      {open === 'goal' && (
        <CreateGoalModal onClose={() => setOpen(null)} />
      )}

      {open === 'task' && (
        <CreateTaskModal onClose={() => setOpen(null)} />
      )}
    </>
  );
}