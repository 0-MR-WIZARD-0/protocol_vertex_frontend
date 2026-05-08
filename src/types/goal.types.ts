import { Dream } from "./dream.types";

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  deadline: string;
  repeatType: RepeatType;
  repeatDays: number[];
  slots: string[];
  status: GoalStatus;
  isDream: boolean;
  isFailed?: boolean;
  dream?: Dream | null;
  logs?: GoalLog[];
  completedSlots?: string[];
  createdAt: string;
}

export interface GoalProgress {
  total: number;
  done: number;
  percent: number;
}

export interface GoalLog {
  id: string;
  goalId: string;
  date: string;
  timeSlot: string;
  status: GoalLogStatus;
}

export type GoalStatus =
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED';

export type GoalLogStatus =
    | 'APPROVED'
    | 'REJECTED';


export type RepeatType =
    | 'DAILY'
    | 'WEEKDAYS'
    | 'WEEKENDS'
    | 'CUSTOM';