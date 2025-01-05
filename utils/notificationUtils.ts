import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from '../types';

// Bildirim izinlerini kontrol et
export async function checkNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // İzin daha önce sorulmadıysa sor
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

// Bildirimleri yapılandır
export function configureNotifications() {
  // Bildirim ayarlarını yapılandır
  Notifications.setNotificationHandler({
    handleNotification: async () => {
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      };
    },
  });

  // Bildirim kanalını yapılandır (Android için)
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // iOS için ek yapılandırma
  if (Platform.OS === 'ios') {
    Notifications.setNotificationCategoryAsync('task-reminder', [
      {
        identifier: 'complete',
        buttonTitle: 'Tamamlandı',
        options: {
          isAuthenticationRequired: false,
          opensAppToForeground: true,
        },
      },
    ]);
  }
}

// Test bildirimi gönder
export async function sendTestNotification(task: Task) {
  try {
    const hasPermission = await checkNotificationPermissions();
    if (!hasPermission) {
      return;
    }

    // Bildirimleri yapılandır
    configureNotifications();

    // Hemen bildirim gönder
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Bildirimi',
        body: `"${task.title}" görevi için test bildirimi`,
        data: { taskId: task.id },
        sound: true,
        badge: 1,
        // Android için ek ayarlar
        ...(Platform.OS === 'android' && {
          channelId: 'default',
          color: '#FF231F7C',
          vibrate: [0, 250, 250, 250],
        }),
      },
      // @ts-ignore
      trigger: {
        seconds: 1,
      },
    });

  } catch (error) {
    console.error('Bildirim gönderilirken hata:', error);
  }
}

// Görev için bildirim planla
export async function scheduleTaskNotification(task: Task) {
  const hasPermission = await checkNotificationPermissions();
  if (!hasPermission) return;

  // Mevcut bildirimleri temizle
  await cancelTaskNotifications(task.id);

  // Görev tarihleri için bildirimler planla
  const now = new Date();
  const notificationDate = new Date(now);
  notificationDate.setHours(9, 0, 0, 0); // Sabah 9'da bildirim gönder

  // Eğer saat 9'u geçtiyse, bir sonraki güne planla
  if (now.getHours() >= 9) {
    notificationDate.setDate(notificationDate.getDate() + 1);
  }

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Görev Hatırlatması',
      body: `"${task.title}" görevini bugün yapman gerekiyor.`,
      data: { taskId: task.id },
      sound: true,
      badge: 1,
    },
    // @ts-ignore - Expo Notifications type definitions issue
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });

  return identifier;
}

// Görevin bildirimlerini iptal et
export async function cancelTaskNotifications(taskId: string) {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  
  for (const notification of scheduledNotifications) {
    if (notification.content.data?.taskId === taskId) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}

// Tüm bildirimleri iptal et
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
} 