import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { MainTabScreenProps } from '../types/navigation';
import { Receipt } from '../types/models';
import { db } from '../services/database';

export default function ReceiptsScreen({ navigation }: MainTabScreenProps<'Receipts'>) {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadReceipts();
    }, [])
  );

  const loadReceipts = async () => {
    try {
      const data = await db.getReceipts();
      setReceipts(data);
    } catch (error) {
      console.error('Error loading receipts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadReceipts();
  };

  const handleReceiptPress = (receiptId: string) => {
    navigation.navigate('ReceiptDetail', { receiptId });
  };

  const renderReceipt = ({ item }: { item: Receipt }) => (
    <TouchableOpacity
      style={styles.receiptCard}
      onPress={() => handleReceiptPress(item.id)}
    >
      <View style={styles.receiptHeader}>
        <View style={styles.receiptIcon}>
          <Ionicons name="receipt-outline" size={24} color="#4F46E5" />
        </View>
        <View style={styles.receiptInfo}>
          <Text style={styles.storeName}>{item.store}</Text>
          <Text style={styles.receiptDate}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.receiptAmount}>€{item.total.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (receipts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="receipt-outline" size={80} color="#D1D5DB" />
        <Text style={styles.emptyText}>No receipts yet</Text>
        <Text style={styles.emptySubtext}>
          Scan your first receipt to get started
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={receipts}
        renderItem={renderReceipt}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    padding: 16,
  },
  receiptCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  receiptInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  receiptDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  receiptAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#D1D5DB',
    marginTop: 8,
    textAlign: 'center',
  },
});
