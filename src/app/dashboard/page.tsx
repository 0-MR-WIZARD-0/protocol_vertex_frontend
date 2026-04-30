'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { api } from '../../shared/api/axios';
import { Calendar } from '../../features/calendar/ui/Calendar';
import { DayDetails } from '../../features/calendar/ui/DayDetails';
import { ActionTabs } from '../../features/actions/ui/ActionTabs';

export default function Dashboard() {
  const today = dayjs().format('YYYY-MM-DD');
  const [selected, setSelected] = useState<string>(today);
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const { data: monthData, isLoading: monthLoading } = useQuery({
    queryKey: ['month', currentMonth.year(), currentMonth.month()],
    queryFn: () =>
      api
        .get('/calendar/month', {
          params: {
            year: currentMonth.year(),
            month: currentMonth.month() + 1,
          },
        })
        .then((r) => r.data),
  });

  const { data: dayData, isLoading: dayLoading } = useQuery({
    queryKey: ['day', selected],
    queryFn: () =>
      api
        .get('/calendar/day', {
          params: { date: selected },
        })
        .then((r) => r.data),
  });

  if (monthLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <ActionTabs />

      <Calendar
        data={monthData?.days || {}}
        selected={selected}
        onSelect={setSelected}
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
      />

      {dayLoading ? (
        <div>Loading day...</div>
      ) : (
        <DayDetails data={dayData} date={selected} />
      )}
    </div>
  );
}