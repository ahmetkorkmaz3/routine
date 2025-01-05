import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { Task } from '../types';
import { useThemeColor } from '../hooks/useThemeColor';

type TaskCardProps = {
  task: Task;
  onDelete: () => void;
  getFrequencyLabel: (frequency: Task['frequency']) => string;
  getTaskDates: (task: Task) => Date[];
  formatDate: (date: Date) => JSX.Element;
  getTaskStatusForDate: (task: Task, date: Date) => string;
  toggleTaskForDate: (taskId: string, date: Date) => void;
};

export const TaskCard = ({ 
  task, 
  onDelete,
  getFrequencyLabel,
  getTaskDates,
  formatDate,
  getTaskStatusForDate,
  toggleTaskForDate,
}: TaskCardProps) => {
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

const styles = StyleSheet.create({
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
}); 