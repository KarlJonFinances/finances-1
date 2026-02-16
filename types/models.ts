export interface Item {
  id: string;
  receiptId: string;
  name: string;
  price: number;
  category: ItemCategory;
  necessary: boolean;
  createdAt: string;
}

export enum ItemCategory {
  SWEETS = 'sweets',
  BEVERAGES = 'beverages',
  FOOD = 'food',
  VEGETABLES = 'vegetables',
  FUEL = 'fuel',
  HOUSEHOLD = 'household',
  OTHER = 'other'
}

export interface Receipt {
  id: string;
  date: string;
  store: string;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptWithItems extends Receipt {
  items: Item[];
}

export interface Income {
  id: string;
  amount: number;
  date: string;
  source: string;
  createdAt: string;
}

export interface MonthlyBudget {
  id: string;
  month: string; // YYYY-MM format
  income: number;
  fixedExpenses: number;
  savingsGoal: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryBudget {
  id: string;
  monthlyBudgetId: string;
  category: ItemCategory;
  allocatedAmount: number;
}
