export interface User {
  id: string;
  email: string;
  role: UserRole;
  telegramId: string | null;
  telegramCode: string | null;
  createdAt: string;
}

export type UserRole =
  | 'USER'
  | 'ADMIN';