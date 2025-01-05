export type FrequencyType = 'day' | 'week' | 'month';

export interface Task {
  id: string;
  title: string;
  frequency: {
    type: FrequencyType;
    value: number;
  };
  completedDates: string[];
  isCompleted: boolean;
} 