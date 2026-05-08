export interface Task {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  isDone?: boolean;
  createdAt?: string;
}