export interface Person {
  id: string;
  name: string;
  email: string;
  workSchedule: any;
  specialConditions: any;
  preferences: any;
  emailNotifications: {
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
    time: string;
  };
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  number: number;
  name: string;
  duration: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  category: string;
  area: string;
  requiresDaylight: boolean;
  requiresWeekend: boolean;
  priority: number;
  canRotate: boolean;
  preferredPersonId: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  taskId: string;
  personId: string;
  date: string;
  completed: boolean;
  completedAt: string | null;
  timeSpent: number | null;
  notes: string | null;
  person?: Person;
  task?: Task;
  createdAt: string;
  updatedAt: string;
}
