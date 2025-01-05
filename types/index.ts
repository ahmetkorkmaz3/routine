export interface Task {
  id: string;
  title: string;
  frequency: {
    type: 'day' | 'week' | 'month';
    value: number;
  };
  completedDates: string[];
}

export type FrequencyType = {
  label: string;
  value: 'day' | 'week' | 'month';
}; 