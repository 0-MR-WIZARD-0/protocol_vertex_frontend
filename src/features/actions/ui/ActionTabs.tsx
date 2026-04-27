'use client';

import { useState } from 'react';
import { CreateGoalModal } from '../../../features/goals/ui/CreateGoalModal';

export function ActionTabs() {
  const [open, setOpen] = useState<null | 'goal' | 'task' | 'reminder'>(null);

  const tab = (type: typeof open, label: string) => (
    <button
      onClick={() => setOpen(type)}
      className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-100"
    >
      {label}
    </button>
  );

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
    </>
  );
}