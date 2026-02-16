import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { MainTabScreenProps } from '../types/navigation';
import { ItemCategory } from '../types/models';
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

const CATEGORY_COLORS: Record<ItemCategory, string> = {
  [ItemCategory.SWEETS]: '#FF6B9D',
  [ItemCategory.BEVERAGES]: '#4ECDC4',
  [ItemCategory.FOOD]: '#95E1D3',
  [ItemCategory.VEGETABLES]: '#38A169',
  [ItemCategory.FUEL]: '#ED8936',
  [ItemCategory.HOUSEHOLD]: '#9F7AEA',
  [ItemCategory.OTHER]: '#718096',
};

export default function StatisticsScreen({ navigation }: MainTabScreenProps<'Statistics'>) {
  const [loading, setLoading] = useState(true);
  const [categoryTotals, setCategoryTotals] = useState<Record<ItemCategory, number>>({
    [ItemCategory.SWEETS]: 0,
    [ItemCategory.BEVERAGES]: 0,
    [ItemCategory.FOOD]: 0,
    [ItemCategory.VEGETABLES]: 0,
    [ItemCategory.FUEL]: 0,
    [ItemCategory.HOUSEHOLD]: 0,
    [ItemCategory.OTHER]: 0,
  });
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      const [totals, total] = await Promise.all([
        db.getTotalSpentByCategory(firstDay, lastDay),
        db.getTotalSpent(firstDay, lastDay),
      ]);

      setCategoryTotals(totals);
      setTotalSpent(total);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This Month</Text>
        <Text style={styles.totalAmount}>€{totalSpent.toFixed(2)}</Text>
        <Text style={styles.subtitle}>Total Spent</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Spending by Category</Text>
        {Object.entries(categoryTotals).map(([category, amount]) => {
          const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
          
          if (amount === 0) return null;

          return (
            <View key={category} style={styles.categoryRow}>
              <View style={styles.categoryHeader}>
                <View
                  style={[
                    styles.categoryDot,
                    { backgroundColor: CATEGORY_COLORS[category as ItemCategory] },
                  ]}
                />
                <Text style={styles.categoryName}>
                  {CATEGORY_LABELS[category as ItemCategory]}
                </Text>
                <Text style={styles.categoryAmount}>€{amount.toFixed(2)}</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${percentage}%`,
                      backgroundColor: CATEGORY_COLORS[category as ItemCategory],
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}

        {totalSpent === 0 && (
          <Text style={styles.emptyText}>No spending data for this month</Text>
        )}
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
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoryRow: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
