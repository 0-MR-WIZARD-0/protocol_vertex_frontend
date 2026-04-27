/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import dayjs from 'dayjs';

export function Calendar({
  data,
  selected,
  onSelect,
}: {
  data: Record<string, any>;
  selected: string;
  onSelect: (d: string) => void;
}) {
  const now = dayjs();
  const start = now.startOf('month');
  const end = now.endOf('month');

  const days = [];
  let current = start;

  while (current.isBefore(end) || current.isSame(end)) {
    const key = current.format('YYYY-MM-DD');
    const day = data?.[key];

    const percent = day?.percent || 0;
    const hasData = day && (day.total > 0 || day.done > 0);

    const isSelected = key === selected;
    const isToday = key === dayjs().format('YYYY-MM-DD');

    days.push(
      <div
        key={key}
        onClick={() => onSelect(key)}
        className={`h-24 p-2 rounded-xl cursor-pointer border flex flex-col justify-between
          ${isSelected ? 'bg-green-100 border-green-600' : 'bg-white'}
          ${isToday ? 'ring-2 ring-blue-400' : ''}
          hover:shadow-sm transition
        `}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            {current.date()}
          </span>

          {hasData && (
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          )}
        </div>

        <div className="mt-2">
          <div className="h-1 bg-gray-200 rounded">
            <div
              className="h-full bg-green-500 rounded"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="text-xs text-gray-500 mt-1">
            {Math.round(percent)}%
          </div>
        </div>
      </div>
    );

    current = current.add(1, 'day');
  }

  return <div className="grid grid-cols-7 gap-3">{days}</div>;
}