import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../../types';
import { router, useFocusEffect } from 'expo-router';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useColorScheme } from '../../hooks/useColorScheme';
import { TaskCard } from '../../components/TaskCard';
import { EmptyState } from '../../components/EmptyState';
import { 
  getFrequencyLabel, 
  getTaskDates, 
  getTaskStatusForDate, 
  formatDate 
} from '../../utils/taskUtils';
import { cancelTaskNotifications } from '../../utils/notificationUtils';

const STORAGE_KEY = '@routine_tasks';

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

  const toggleTaskForDate = async (taskId: string, date: Date) => {
    if (date > new Date()) {
      return;
    }

    try {
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          const dateStr = date.toISOString();
          const taskCompletedDates = task.completedDates || [];
          const isCompleted = taskCompletedDates.some(d => 
            new Date(d).toDateString() === date.toDateString()
          );
          
          return {
            ...task,
            completedDates: isCompleted
              ? taskCompletedDates.filter(d => new Date(d).toDateString() !== date.toDateString())
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

  const formatDateElement = (date: Date) => {
    const { day, month } = formatDate(date);
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
              
              // Bildirimleri iptal et
              await cancelTaskNotifications(taskId);
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
                formatDate={formatDateElement}
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
});
