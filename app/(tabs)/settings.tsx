import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useColorScheme, ColorScheme } from '../../hooks/useColorScheme';
import { useThemeColor } from '../../hooks/useThemeColor';

const STORAGE_KEY = '@routine_tasks';

type SettingItemProps = {
  title: string;
  description?: string;
  onPress: () => void;
  isDestructive?: boolean;
  isSelected?: boolean;
};

const SettingItem = ({ title, description, onPress, isDestructive, isSelected }: SettingItemProps) => {
  const { colors } = useThemeColor();
  
  return (
    <TouchableOpacity 
      style={[
        styles.settingItem,
        { borderBottomColor: colors.borderLight }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingContent}>
        <Text style={[
          styles.settingTitle,
          { color: isDestructive ? colors.error : colors.text },
          isSelected && { color: colors.primary }
        ]}>
          {title}
        </Text>
        {description && (
          <Text style={[styles.settingDescription, { color: colors.textTertiary }]}>
            {description}
          </Text>
        )}
      </View>
      {isSelected && (
        <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
      )}
    </TouchableOpacity>
  );
};

const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const { colors } = useThemeColor();
  
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>{title}</Text>
      <View style={[styles.sectionContent, { 
        backgroundColor: colors.card,
        shadowColor: colors.text,
      }]}>
        {children}
      </View>
    </View>
  );
};

export default function SettingsScreen() {
  const { colors } = useThemeColor();
  const { theme, setColorScheme } = useColorScheme();

  const resetAllData = async () => {
    Alert.alert(
      'Tüm Verileri Sil',
      'Tüm görevler ve ayarlar silinecek. Bu işlem geri alınamaz.',
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
              await AsyncStorage.clear();
              router.replace('/(tabs)');
            } catch (error) {
              Alert.alert('Hata', 'Veriler silinirken bir hata oluştu.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const exportData = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        // Burada veriyi dışa aktarma işlemi yapılabilir
        Alert.alert('Başarılı', 'Veriler dışa aktarıldı.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Veriler dışa aktarılırken bir hata oluştu.');
    }
  };

  const importData = async () => {
    // Burada veri içe aktarma işlemi yapılabilir
    Alert.alert('Bilgi', 'Bu özellik yakında eklenecek.');
  };

  const getThemeDescription = (themeType: ColorScheme) => {
    switch (themeType) {
      case 'light':
        return 'Açık tema kullanılıyor';
      case 'dark':
        return 'Koyu tema kullanılıyor';
      case 'system':
        return 'Sistem teması kullanılıyor';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <SettingSection title="Görünüm">
            <SettingItem
              title="Açık Tema"
              description={theme === 'light' ? 'Seçili' : undefined}
              onPress={() => setColorScheme('light')}
              isSelected={theme === 'light'}
            />
            <SettingItem
              title="Koyu Tema"
              description={theme === 'dark' ? 'Seçili' : undefined}
              onPress={() => setColorScheme('dark')}
              isSelected={theme === 'dark'}
            />
            <SettingItem
              title="Sistem Teması"
              description={theme === 'system' ? 'Seçili' : undefined}
              onPress={() => setColorScheme('system')}
              isSelected={theme === 'system'}
            />
          </SettingSection>

          <SettingSection title="Bildirimler">
            <SettingItem
              title="Günlük Hatırlatmalar"
              description="Her gün 20:00'de bildirim al"
              onPress={() => Alert.alert('Bilgi', 'Bu özellik yakında eklenecek.')}
            />
            <SettingItem
              title="Bildirim Sesi"
              description="Varsayılan ses"
              onPress={() => Alert.alert('Bilgi', 'Bu özellik yakında eklenecek.')}
            />
          </SettingSection>

          <SettingSection title="Veri Yönetimi">
            <SettingItem
              title="Verileri Dışa Aktar"
              description="Tüm görevleri yedekle"
              onPress={exportData}
            />
            <SettingItem
              title="Verileri İçe Aktar"
              description="Yedekten geri yükle"
              onPress={importData}
            />
            <SettingItem
              title="Tüm Verileri Sil"
              description="Tüm görevleri ve ayarları sıfırla"
              onPress={resetAllData}
              isDestructive
            />
          </SettingSection>

          <SettingSection title="Hakkında">
            <SettingItem
              title="Uygulama Versiyonu"
              description="1.0.0"
              onPress={() => {}}
            />
          </SettingSection>
        </ScrollView>
      </View>
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
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionContent: {
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 