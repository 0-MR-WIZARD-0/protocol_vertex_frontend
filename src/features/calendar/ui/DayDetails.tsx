/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import dayjs from 'dayjs';
import { GoalItem } from './GoalItem';

export function DayDetails({ data, date }: any) {
  if (!data) return null;

  return (
    <div className="mt-6">
      <h2 className="text-lg mb-3">На {dayjs(date).format('DD.MM.YYYY')} 📅</h2>
      {data.goals.map((g: any) => (
        <GoalItem key={g.id} goal={g} date={date} />
      ))}
    </div>
  );
}