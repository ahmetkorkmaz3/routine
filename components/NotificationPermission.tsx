import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { checkNotificationPermissions, cancelAllNotifications, sendTestNotification } from '../utils/notificationUtils';
import { Task } from '../types';
import Constants from 'expo-constants';

export const NotificationPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { colors } = useThemeColor();
  const isDevelopment = Constants.appOwnership === 'expo';

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    const status = await checkNotificationPermissions();
    setHasPermission(status);
  };

  const handleRequestPermission = async () => {
    const granted = await checkNotificationPermissions();
    setHasPermission(granted);

    if (!granted) {
      Alert.alert(
        'Bildirim İzni Gerekli',
        'Görevlerinizi zamanında yapabilmeniz için bildirim izni vermeniz önemlidir. Lütfen ayarlardan bildirimlere izin verin.',
        [
          {
            text: 'İptal',
            style: 'cancel',
          },
          {
            text: 'Ayarlara Git',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
        ]
      );
    }
  };

  const handleDisableNotifications = async () => {
    Alert.alert(
      'Bildirimleri Kapat',
      'Bildirimleri kapatırsanız görevleriniz hakkında hatırlatma almayacaksınız. Emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Kapat',
          style: 'destructive',
          onPress: async () => {
            await cancelAllNotifications();
            setHasPermission(false);
          },
        },
      ]
    );
  };

  const handleTestNotification = async () => {
    // Test için örnek bir görev oluştur
    const testTask: Task = {
      id: 'test',
      title: 'Test Görevi',
      frequency: { type: 'day' as const, value: 1 },
      completedDates: [],
      isCompleted: false,
    };

    await sendTestNotification(testTask);
    Alert.alert('Bilgi', '5 saniye içinde test bildirimi alacaksınız.');
  };

  if (hasPermission === null) {
    return null;
  }

  if (hasPermission) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.success }]}>
            Bildirimler Aktif ✓
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Görevleriniz hakkında hatırlatmalar alacaksınız
          </Text>
          <View style={styles.buttonContainer}>
            {isDevelopment && (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={handleTestNotification}
              >
                <Text style={styles.buttonText}>Test Bildirimi Gönder</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.error }]}
              onPress={handleDisableNotifications}
            >
              <Text style={styles.buttonText}>Bildirimleri Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Bildirimlere İzin Ver
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Görevlerinizi zamanında yapabilmeniz için bildirimler önemlidir
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleRequestPermission}
        >
          <Text style={styles.buttonText}>İzin Ver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
}); 