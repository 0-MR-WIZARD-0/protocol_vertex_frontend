import { Goal } from './goal.types';

export interface Appeal {
  id: string;
  goalId: string;
  date: string;
  timeSlot: string;
  message: string;
  status: AppealStatus;
  goal?: Goal;
  createdAt: string;
}

export type AppealStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED';