'use client';

import dayjs from 'dayjs';

type DayData = {
  total: number;
  done: number;
  percent: number;
  hasTasks?: boolean;
};

export function Calendar({
  data,
  selected,
  onSelect,
}: {
  data: Record<string, DayData>;
  selected: string;
  onSelect: (d: string) => void;
}) {
  const now = dayjs();
  const start = now.startOf('month');
  const end = now.endOf('month');

  const today = dayjs().format('YYYY-MM-DD');

  const days = [];
  let current = start;

  while (current.isBefore(end) || current.isSame(end)) {
    const key = current.format('YYYY-MM-DD');
    const day = data?.[key];

    const isSelected = key === selected;
    const isToday = key === today;

    let icon = null;

    if (day?.total > 0) {
      if (day.done === day.total) icon = '✅';
      else if (key < today) icon = '❌';
      else icon = '🎯';
    }

    if (day?.hasTasks) {
      icon = icon ? `${icon} 📑` : '📑';
    }

    days.push(
      <div
        key={key}
        onClick={() => onSelect(key)}
        className={`h-24 p-2 rounded-xl border cursor-pointer flex flex-col justify-between
          ${isSelected ? 'bg-green-100 border-green-600' : 'bg-white'}
          ${isToday ? 'ring-2 ring-blue-400' : ''}
          hover:shadow-sm transition
        `}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            {current.date()}
          </span>
          <span>{icon}</span>
        </div>

        {day?.total > 0 && (
          <div className="mt-2">
            <div className="h-1 bg-gray-200 rounded">
              <div
                className="h-full bg-green-500 rounded"
                style={{ width: `${day.percent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );

    current = current.add(1, 'day');
  }

  return <div className="grid grid-cols-7 gap-3">{days}</div>;
}