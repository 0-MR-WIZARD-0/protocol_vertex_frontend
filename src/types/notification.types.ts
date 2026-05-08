import { Goal } from './goal.types';

export interface NotificationSetting {
  id: string;
  userId: string;
  goalId: string | null;
  times: string[];
  isActive: boolean;
  goal?: Goal | null;
  createdAt: string;
}