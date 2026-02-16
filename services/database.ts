import * as SQLite from 'expo-sqlite';
import { Receipt, Item, Income, MonthlyBudget, CategoryBudget, ItemCategory } from '../types/models';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('receiptTracker.db');
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS receipts (
        id TEXT PRIMARY KEY NOT NULL,
        date TEXT NOT NULL,
        store TEXT NOT NULL,
        total REAL NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY NOT NULL,
        receiptId TEXT NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        necessary INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (receiptId) REFERENCES receipts (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS incomes (
        id TEXT PRIMARY KEY NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        source TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS monthly_budgets (
        id TEXT PRIMARY KEY NOT NULL,
        month TEXT NOT NULL UNIQUE,
        income REAL NOT NULL,
        fixedExpenses REAL NOT NULL,
        savingsGoal REAL NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS category_budgets (
        id TEXT PRIMARY KEY NOT NULL,
        monthlyBudgetId TEXT NOT NULL,
        category TEXT NOT NULL,
        allocatedAmount REAL NOT NULL,
        FOREIGN KEY (monthlyBudgetId) REFERENCES monthly_budgets (id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_items_receiptId ON items(receiptId);
      CREATE INDEX IF NOT EXISTS idx_receipts_date ON receipts(date);
      CREATE INDEX IF NOT EXISTS idx_incomes_date ON incomes(date);
      CREATE INDEX IF NOT EXISTS idx_category_budgets_monthlyBudgetId ON category_budgets(monthlyBudgetId);
    `);
  }

  // Receipt operations
  async insertReceipt(receipt: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();
    const now = new Date().toISOString();

    await this.db.runAsync(
      'INSERT INTO receipts (id, date, store, total, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
      [id, receipt.date, receipt.store, receipt.total, now, now]
    );

    return id;
  }

  async getReceipts(limit: number = 50, offset: number = 0): Promise<Receipt[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<Receipt>(
      'SELECT * FROM receipts ORDER BY date DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    return result;
  }

  async getReceiptById(id: string): Promise<Receipt | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<Receipt>(
      'SELECT * FROM receipts WHERE id = ?',
      [id]
    );

    return result || null;
  }

  async deleteReceipt(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync('DELETE FROM receipts WHERE id = ?', [id]);
  }

  // Item operations
  async insertItem(item: Omit<Item, 'id' | 'createdAt'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();
    const now = new Date().toISOString();

    await this.db.runAsync(
      'INSERT INTO items (id, receiptId, name, price, category, necessary, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, item.receiptId, item.name, item.price, item.category, item.necessary ? 1 : 0, now]
    );

    return id;
  }

  async getItemsByReceiptId(receiptId: string): Promise<Item[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<any>(
      'SELECT * FROM items WHERE receiptId = ? ORDER BY createdAt',
      [receiptId]
    );

    return result.map(item => ({
      ...item,
      necessary: item.necessary === 1
    }));
  }

  async insertReceiptWithItems(
    receipt: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>,
    items: Omit<Item, 'id' | 'receiptId' | 'createdAt'>[]
  ): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const receiptId = await this.insertReceipt(receipt);

    for (const item of items) {
      await this.insertItem({
        ...item,
        receiptId
      });
    }

    return receiptId;
  }

  // Income operations
  async insertIncome(income: Omit<Income, 'id' | 'createdAt'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();
    const now = new Date().toISOString();

    await this.db.runAsync(
      'INSERT INTO incomes (id, amount, date, source, createdAt) VALUES (?, ?, ?, ?, ?)',
      [id, income.amount, income.date, income.source, now]
    );

    return id;
  }

  async getIncomes(limit: number = 50, offset: number = 0): Promise<Income[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<Income>(
      'SELECT * FROM incomes ORDER BY date DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    return result;
  }

  async deleteIncome(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync('DELETE FROM incomes WHERE id = ?', [id]);
  }

  // Monthly budget operations
  async insertMonthlyBudget(budget: Omit<MonthlyBudget, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();
    const now = new Date().toISOString();

    await this.db.runAsync(
      'INSERT INTO monthly_budgets (id, month, income, fixedExpenses, savingsGoal, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, budget.month, budget.income, budget.fixedExpenses, budget.savingsGoal, now, now]
    );

    return id;
  }

  async getMonthlyBudget(month: string): Promise<MonthlyBudget | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<MonthlyBudget>(
      'SELECT * FROM monthly_budgets WHERE month = ?',
      [month]
    );

    return result || null;
  }

  async updateMonthlyBudget(id: string, updates: Partial<MonthlyBudget>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const fields = Object.keys(updates).filter(k => k !== 'id' && k !== 'createdAt');
    
    if (fields.length === 0) return;

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => updates[f as keyof MonthlyBudget]);

    await this.db.runAsync(
      `UPDATE monthly_budgets SET ${setClause}, updatedAt = ? WHERE id = ?`,
      [...values, now, id]
    );
  }

  // Category budget operations
  async insertCategoryBudget(budget: Omit<CategoryBudget, 'id'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();

    await this.db.runAsync(
      'INSERT INTO category_budgets (id, monthlyBudgetId, category, allocatedAmount) VALUES (?, ?, ?, ?)',
      [id, budget.monthlyBudgetId, budget.category, budget.allocatedAmount]
    );

    return id;
  }

  async getCategoryBudgets(monthlyBudgetId: string): Promise<CategoryBudget[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<CategoryBudget>(
      'SELECT * FROM category_budgets WHERE monthlyBudgetId = ?',
      [monthlyBudgetId]
    );

    return result;
  }

  // Statistics
  async getTotalSpentByCategory(startDate: string, endDate: string): Promise<Record<ItemCategory, number>> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<{ category: ItemCategory; total: number }>(
      `SELECT i.category, SUM(i.price) as total
       FROM items i
       JOIN receipts r ON i.receiptId = r.id
       WHERE r.date >= ? AND r.date <= ?
       GROUP BY i.category`,
      [startDate, endDate]
    );

    const categoryTotals: Record<ItemCategory, number> = {
      [ItemCategory.SWEETS]: 0,
      [ItemCategory.BEVERAGES]: 0,
      [ItemCategory.FOOD]: 0,
      [ItemCategory.VEGETABLES]: 0,
      [ItemCategory.FUEL]: 0,
      [ItemCategory.HOUSEHOLD]: 0,
      [ItemCategory.OTHER]: 0
    };

    result.forEach(row => {
      categoryTotals[row.category] = row.total;
    });

    return categoryTotals;
  }

  async getTotalSpent(startDate: string, endDate: string): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<{ total: number }>(
      'SELECT SUM(total) as total FROM receipts WHERE date >= ? AND date <= ?',
      [startDate, endDate]
    );

    return result?.total || 0;
  }

  // Utility
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }

  async resetDatabase(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(`
      DROP TABLE IF EXISTS receipts;
      DROP TABLE IF EXISTS items;
      DROP TABLE IF EXISTS incomes;
      DROP TABLE IF EXISTS monthly_budgets;
      DROP TABLE IF EXISTS category_budgets;
    `);

    await this.createTables();
  }
}

export const db = new DatabaseService();
