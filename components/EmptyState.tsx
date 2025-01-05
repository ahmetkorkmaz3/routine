import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

export const EmptyState = () => {
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

const styles = StyleSheet.create({
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