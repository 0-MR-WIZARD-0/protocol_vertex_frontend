import type {Goal} from './goal.types';
import type {Task} from './task.types';

export interface DayData {
  total: number;
  done: number;
  percent: number;
  goals?: Goal[];
  tasks?: Task[];
}

export interface CalendarMonthResponse {
  days: Record<string, DayData>;
}

export interface CalendarDayResponse {
  goals: Goal[];
  tasks: Task[];
  stats: {
    total: number;
    done: number;
    percent: number;
  };
}