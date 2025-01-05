import { format, isAfter, addDays, parseISO, subDays, isSameDay, startOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Task } from '../types';

export const getFrequencyLabel = (frequency: Task['frequency']) => {
  switch (frequency.type) {
    case 'day':
      return frequency.value === 1 ? 'Günlük' : `${frequency.value} Günde Bir`;
    case 'week':
      return frequency.value === 1 ? 'Haftalık' : `${frequency.value} Haftada Bir`;
    case 'month':
      return frequency.value === 1 ? 'Aylık' : `${frequency.value} Ayda Bir`;
    default:
      return '';
  }
};

export const getFrequencyDays = (frequency: Task['frequency']) => {
  switch (frequency.type) {
    case 'day':
      return frequency.value;
    case 'week':
      return frequency.value * 7;
    case 'month':
      return frequency.value * 30; // Yaklaşık bir ay
    default:
      return 1;
  }
};

export const getTaskDates = (task: Task) => {
  const dates: Date[] = [];
  const days = getFrequencyDays(task.frequency);
  let currentDate = new Date();

  // Geriye doğru 5 tarihi ekle
  for (let i = 4; i >= 0; i--) {
    dates.push(subDays(currentDate, days * i));
  }

  // İleriye doğru 2 tarihi ekle
  for (let i = 1; i <= 2; i++) {
    dates.push(addDays(currentDate, days * i));
  }

  return dates;
};

export const isDateCompleted = (completedDates: string[] = [], date: Date) => {
  return completedDates?.some(completedDate => 
    isSameDay(parseISO(completedDate), date)
  ) || false;
};

export const getTaskStatusForDate = (task: Task, date: Date) => {
  const isCompleted = isDateCompleted(task.completedDates || [], date);
  const isToday = isSameDay(date, new Date());
  
  if (isCompleted) {
    return 'completed';
  }
  
  if (isToday) {
    return 'pending';
  }
  
  if (isAfter(startOfDay(new Date()), startOfDay(date))) {
    return 'missed';
  }

  return 'future';
};

export const formatDate = (date: Date) => {
  const day = format(date, 'd', { locale: tr });
  const month = format(date, 'LLL', { locale: tr });
  return { day, month };
}; 