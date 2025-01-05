import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, FrequencyType } from '../types';
import { useThemeColor } from '../hooks/useThemeColor';

const FREQUENCY_TYPES: FrequencyType[] = [
  { label: 'Gün', value: 'day' },
  { label: 'Hafta', value: 'week' },
  { label: 'Ay', value: 'month' },
];

const STORAGE_KEY = '@routine_tasks';

export default function EditTaskScreen() {
  const params = useLocalSearchParams();
  const taskId = typeof params.taskId === 'string' ? params.taskId : '';
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState<FrequencyType['value']>('day');
  const [frequencyValue, setFrequencyValue] = useState('1');
  const { colors } = useThemeColor();

  useEffect(() => {
    if (taskId) {
      loadTask();
    }
  }, [taskId]);

  const loadTask = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        const tasks: Task[] = JSON.parse(storedTasks);
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          setTitle(task.title);
          setSelectedType(task.frequency.type);
          setFrequencyValue(task.frequency.value.toString());
        }
      }
    } catch (error) {
      Alert.alert('Hata', 'Görev yüklenirken bir hata oluştu.');
    }
  };

  const getFrequencyLabel = () => {
    const value = frequencyValue.trim() === '' ? 1 : parseInt(frequencyValue, 10);
    switch (selectedType) {
      case 'day':
        return value === 1 ? 'Günlük' : `${value} Günde Bir`;
      case 'week':
        return value === 1 ? 'Haftalık' : `${value} Haftada Bir`;
      case 'month':
        return value === 1 ? 'Aylık' : `${value} Ayda Bir`;
      default:
        return '';
    }
  };

  const saveTask = async () => {
    if (!title.trim()) {
      Alert.alert('Hata', 'Lütfen görev adını giriniz.');
      return;
    }

    const value = parseInt(frequencyValue, 10);
    if (isNaN(value) || value < 1) {
      Alert.alert('Hata', 'Lütfen geçerli bir sıklık değeri giriniz.');
      return;
    }

    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      const currentTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
      
      const updatedTasks = currentTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            title: title.trim(),
            frequency: {
              type: selectedType,
              value: value,
            },
          };
        }
        return task;
      });

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
      router.back();
    } catch (error) {
      Alert.alert('Hata', 'Görev güncellenirken bir hata oluştu.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={[styles.header, { 
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
      }]}>
        <View style={[styles.headerHandle, { backgroundColor: colors.border }]} />
        <Text style={[styles.headerTitle, { color: colors.textSecondary }]}>Görevi Düzenle</Text>
        <TouchableOpacity 
          style={[styles.closeButton, { backgroundColor: colors.disabled }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.closeButtonText, { color: colors.textSecondary }]}>×</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Görev Adı</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
            }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Görev adını giriniz"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Sıklık Türü</Text>
          <View style={styles.frequencyContainer}>
            {FREQUENCY_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.frequencyButton,
                  { backgroundColor: colors.disabled },
                  selectedType === type.value && { backgroundColor: colors.primary },
                ]}
                onPress={() => setSelectedType(type.value)}
              >
                <Text
                  style={[
                    styles.frequencyText,
                    { color: colors.textSecondary },
                    selectedType === type.value && { color: 'white' },
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Sıklık Değeri</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
            }]}
            value={frequencyValue}
            onChangeText={setFrequencyValue}
            placeholder="Sayı giriniz"
            placeholderTextColor={colors.textTertiary}
            keyboardType="number-pad"
          />
          <Text style={[styles.frequencyPreview, { color: colors.textTertiary }]}>
            {getFrequencyLabel()}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={saveTask}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#dee2e6',
    borderRadius: 2,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  frequencyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    backgroundColor: '#f1f3f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedFrequency: {
    backgroundColor: '#228be6',
  },
  frequencyText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  selectedFrequencyText: {
    color: 'white',
  },
  frequencyPreview: {
    marginTop: 8,
    fontSize: 14,
    color: '#868e96',
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#228be6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#495057',
    lineHeight: 28,
  },
}); 