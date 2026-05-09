'use client';

import dayjs, {type Dayjs} from 'dayjs';
import { useState } from 'react';
import {useQuery} from '@tanstack/react-query';
import { api } from '../../shared/api/axios';
import { Calendar } from '../../features/calendar/ui/Calendar';
import { DayDetails } from '../../features/calendar/ui/DayDetails';
import { ActionTabs } from '../../features/actions/ui/ActionTabs';
import type {CalendarMonthResponse, CalendarDayResponse} from '../../types/calendar.types';

export default function Dashboard() {

  const today = dayjs().format('YYYY-MM-DD');

  const [selected, setSelected] = useState<string>(today);
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());

  const {data: monthData, isLoading: monthLoading} = useQuery({
    queryKey: [
      'month',
      currentMonth.year(),
      currentMonth.month(),
    ],

    queryFn: async () => {
      const res = await api.get<CalendarMonthResponse>('/calendar/month', 
        {
            params: {
              year:
                currentMonth.year(),
              month:
                currentMonth.month() +
                1,
            },
          },
        );
      return res.data;
    },
  });

  const {data: dayData, isLoading: dayLoading} = useQuery({
    queryKey: [
      'day',
      selected,
    ],

    queryFn: async () => {
      const res =
        await api.get<CalendarDayResponse>('/calendar/day',
          {
            params: {
              date: selected,
            },
          },
        );
      return res.data;
    },
  });

  if (monthLoading) {
    return (
      <div className="text-white">Loading...</div>
    );
  }

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
      {dayLoading || !dayData ? (
        <div className="text-sm text-white">Loading day...</div>
      ) : (
        <DayDetails
          data={dayData}
          date={selected}
        />
      )}
    </div>
  );
}