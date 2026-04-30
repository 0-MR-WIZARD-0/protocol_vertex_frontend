'use client';

import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

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
  currentMonth,
  onMonthChange,
}: {
  data: Record<string, DayData>;
  selected: string;
  onSelect: (d: string) => void;
  currentMonth: Dayjs;
  onMonthChange: (d: Dayjs) => void;
}) {
  const start = currentMonth.startOf('month');
  const end = currentMonth.endOf('month');

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
          ${isSelected ? 'bg-white border-green-600' : 'bg-[#0a1121]'}
          ${isToday ? 'ring-2 ring-blue-400' : ''}
          hover:shadow-sm transition
        `}
      >
        <div className="flex justify-between items-center">
          <span
            className={`font-bold ${
              isSelected ? 'text-black' : 'text-white'
            }`}
          >
            {current.date()}
          </span>
          <span>{icon}</span>
        </div>

        {day?.total > 0 && (
          <div className="mt-2">
            <div
              className={`h-1 rounded ${
                isSelected ? 'bg-black' : 'bg-white'
              }`}
            >
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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onMonthChange(currentMonth.subtract(1, 'month'))}
          className="px-3 py-1 rounded border"
        >
          ←
        </button>

        <div className="font-bold text-lg">
          {currentMonth.format('MMMM YYYY')}
        </div>

        <button
          onClick={() => onMonthChange(currentMonth.add(1, 'month'))}
          className="px-3 py-1 rounded border"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-3">{days}</div>
    </div>
  );
}