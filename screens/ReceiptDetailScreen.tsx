import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../types/navigation';
import { Receipt, Item, ItemCategory } from '../types/models';
import { db } from '../services/database';

const CATEGORY_LABELS: Record<ItemCategory, string> = {
  [ItemCategory.SWEETS]: 'Sweets',
  [ItemCategory.BEVERAGES]: 'Beverages',
  [ItemCategory.FOOD]: 'Food',
  [ItemCategory.VEGETABLES]: 'Vegetables',
  [ItemCategory.FUEL]: 'Fuel',
  [ItemCategory.HOUSEHOLD]: 'Household',
  [ItemCategory.OTHER]: 'Other',
};

export default function ReceiptDetailScreen({ route, navigation }: RootStackScreenProps<'ReceiptDetail'>) {
  const { receiptId } = route.params;
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReceiptData();
  }, [receiptId]);

  const loadReceiptData = async () => {
    try {
      const [receiptData, itemsData] = await Promise.all([
        db.getReceiptById(receiptId),
        db.getItemsByReceiptId(receiptId),
      ]);

      setReceipt(receiptData);
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading receipt:', error);
      Alert.alert('Error', 'Failed to load receipt details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.deleteReceipt(receiptId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete receipt');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!receipt) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Receipt not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.storeName}>{receipt.store}</Text>
            <Text style={styles.date}>
              {new Date(receipt.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Items ({items.length})</Text>
        {items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={styles.itemMeta}>
                <Text style={styles.itemCategory}>
                  {CATEGORY_LABELS[item.category]}
                </Text>
                {!item.necessary && (
                  <>
                    <Text style={styles.separator}>•</Text>
                    <Text style={styles.nonEssential}>Non-essential</Text>
                  </>
                )}
              </View>
            </View>
            <Text style={styles.itemPrice}>€{item.price.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>€{receipt.total.toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
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
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  deleteButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCategory: {
    fontSize: 12,
    color: '#6B7280',
  },
  separator: {
    marginHorizontal: 6,
    color: '#9CA3AF',
  },
  nonEssential: {
    fontSize: 12,
    color: '#F59E0B',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  errorText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});
