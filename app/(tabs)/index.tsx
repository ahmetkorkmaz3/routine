import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView, Animated } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isAfter, addDays, parseISO, subDays, isSameDay, startOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Task } from '../../types';
import { router, useFocusEffect } from 'expo-router';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useColorScheme } from '../../hooks/useColorScheme';

const STORAGE_KEY = '@routine_tasks';

const TaskCard = ({ 
  task, 
  onDelete,
  getFrequencyLabel,
  getTaskDates,
  formatDate,
  getTaskStatusForDate,
  toggleTaskForDate,
}: { 
  task: Task; 
  onDelete: () => void;
  getFrequencyLabel: (frequency: Task['frequency']) => string;
  getTaskDates: (task: Task) => Date[];
  formatDate: (date: Date) => JSX.Element;
  getTaskStatusForDate: (task: Task, date: Date) => string;
  toggleTaskForDate: (taskId: string, date: Date) => void;
}) => {
  const { colors } = useThemeColor();

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const opacity = dragX.interpolate({
      inputRange: [-50, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.deleteContainer,
          { opacity }
        ]}
      >
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
        >
          <Animated.Text
            style={[
              styles.deleteButtonText,
              { transform: [{ scale }] }
            ]}
          >
            Sil
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}
    >
      <View style={[styles.taskCard, { 
        backgroundColor: colors.card,
        shadowColor: colors.text,
      }]}>
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, { color: colors.text }]}>{task.title}</Text>
          <View style={styles.taskActions}>
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: colors.disabled }]}
              onPress={() => router.push({
                pathname: '/edit-task',
                params: { taskId: task.id }
              })}
            >
              <Text style={[styles.editButtonText, { color: colors.textSecondary }]}>Düzenle</Text>
            </TouchableOpacity>
            <View style={[styles.taskFrequencyChip, { backgroundColor: colors.disabled }]}>
              <Text style={[styles.taskFrequency, { color: colors.textSecondary }]}>
                {getFrequencyLabel(task.frequency)}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          {getTaskDates(task).map((date) => (
            <View key={date.toISOString()} style={styles.statusColumn}>
              {formatDate(date)}
              <TouchableOpacity
                style={[
                  styles.statusCell,
                  { backgroundColor: colors.disabled },
                  getTaskStatusForDate(task, date) === 'completed' && [styles.completedCell, { backgroundColor: colors.successBackground }],
                  getTaskStatusForDate(task, date) === 'missed' && [styles.missedCell, { backgroundColor: colors.errorBackground }],
                  getTaskStatusForDate(task, date) === 'pending' && [styles.pendingCell, { 
                    backgroundColor: colors.warningBackground,
                    borderColor: colors.warningBorder,
                  }],
                  getTaskStatusForDate(task, date) === 'future' && [styles.futureCell, { backgroundColor: colors.disabled }],
                ]}
                onPress={() => toggleTaskForDate(task.id, date)}
                disabled={getTaskStatusForDate(task, date) === 'future'}
              >
                {getTaskStatusForDate(task, date) === 'completed' && (
                  <Text style={[styles.checkmark, { color: colors.success }]}>✓</Text>
                )}
                {getTaskStatusForDate(task, date) === 'missed' && (
                  <Text style={[styles.missedMark, { color: colors.error }]}>×</Text>
                )}
                {getTaskStatusForDate(task, date) === 'pending' && (
                  <Text style={[styles.pendingMark, { color: colors.warning }]}>!</Text>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </Swipeable>
  );
};

const EmptyState = () => {
  const { colors } = useThemeColor();
  
  return (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconContainer, { backgroundColor: colors.disabled }]}>
        <Text style={styles.emptyIcon}>📝</Text>
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>Henüz görev yok</Text>
      <Text style={[styles.emptyDescription, { color: colors.textTertiary }]}>
        Takip etmek istediğiniz rutinleri eklemek için sağ alttaki + butonuna tıklayın
      </Text>
    </View>
  );
};

export default function TabOneScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { colors } = useThemeColor();
  const { colorScheme } = useColorScheme();

  const loadTasks = useCallback(async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        const validatedTasks = parsedTasks.map((task: Task) => ({
          ...task,
          completedDates: task.completedDates || [],
        }));
        setTasks(validatedTasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      Alert.alert('Hata', 'Görevler yüklenirken bir hata oluştu.');
    }
  }, []);

  // Tema değişikliğini dinle
  useEffect(() => {
    loadTasks();
  }, [colorScheme, loadTasks]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const getFrequencyLabel = (frequency: Task['frequency']) => {
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

  const getFrequencyDays = (frequency: Task['frequency']) => {
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

  const getTaskDates = (task: Task) => {
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

  const isDateCompleted = (completedDates: string[] = [], date: Date) => {
    return completedDates?.some(completedDate => 
      isSameDay(parseISO(completedDate), date)
    ) || false;
  };

  const getTaskStatusForDate = (task: Task, date: Date) => {
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

  const toggleTaskForDate = async (taskId: string, date: Date) => {
    if (isAfter(startOfDay(date), startOfDay(new Date()))) {
      return;
    }

    try {
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          const dateStr = date.toISOString();
          const taskCompletedDates = task.completedDates || [];
          const isCompleted = isDateCompleted(taskCompletedDates, date);
          
          return {
            ...task,
            completedDates: isCompleted
              ? taskCompletedDates.filter(d => !isSameDay(parseISO(d), date))
              : [...taskCompletedDates, dateStr],
          };
        }
        return task;
      });

      setTasks(updatedTasks);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      Alert.alert('Hata', 'Görev güncellenirken bir hata oluştu.');
    }
  };

  const formatDate = (date: Date) => {
    const day = format(date, 'd', { locale: tr });
    const month = format(date, 'LLL', { locale: tr });
    return (
      <View style={styles.dateContainer}>
        <Text style={[styles.dateText, { color: colors.textSecondary }]}>{day}</Text>
        <Text style={[styles.monthText, { color: colors.textTertiary }]}>{month}</Text>
      </View>
    );
  };

  const deleteTask = async (taskId: string) => {
    Alert.alert(
      'Görevi Sil',
      'Bu görevi silmek istediğinize emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedTasks = tasks.filter(task => task.id !== taskId);
              setTasks(updatedTasks);
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
            } catch (error) {
              Alert.alert('Hata', 'Görev silinirken bir hata oluştu.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <GestureHandlerRootView style={[styles.container, { backgroundColor: colors.background }]}>
        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollView style={styles.taskList} showsVerticalScrollIndicator={false}>
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={() => deleteTask(task.id)}
                getFrequencyLabel={getFrequencyLabel}
                getTaskDates={getTaskDates}
                formatDate={formatDate}
                getTaskStatusForDate={getTaskStatusForDate}
                toggleTaskForDate={toggleTaskForDate}
              />
            ))}
          </ScrollView>
        )}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/add-task')}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  taskList: {
    flex: 1,
  },
  taskCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  taskFrequencyChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  taskFrequency: {
    fontSize: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  statusColumn: {
    alignItems: 'center',
    width: 36,
    gap: 4,
  },
  dateContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16,
  },
  monthText: {
    fontSize: 12,
    textTransform: 'capitalize',
    lineHeight: 14,
  },
  statusCell: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCell: {},
  missedCell: {},
  pendingCell: {
    borderWidth: 2,
  },
  futureCell: {
    opacity: 0.5,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '600',
  },
  missedMark: {
    fontSize: 18,
    fontWeight: '600',
  },
  pendingMark: {
    fontSize: 18,
    fontWeight: '800',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 12,
  },
  deleteContainer: {
    width: 80,
    marginBottom: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
  },
  deleteButton: {
    backgroundColor: '#fa5252',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});
