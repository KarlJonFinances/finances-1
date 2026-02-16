# 🚀 QUICK START GUIDE

## Installation & Setup (5 minutes)

### Step 1: Install Dependencies
```bash
cd ReceiptTracker
npm install
```

### Step 2: Start Development Server
```bash
npx expo start
```

### Step 3: Open on Your Phone
1. Install **Expo Go** app from App Store (iOS) or Play Store (Android)
2. Scan the QR code from your terminal
3. App will load on your phone

## ✅ What's Already Working

1. **Full Navigation**
   - 5 bottom tabs
   - Stack navigation for details
   - Type-safe routing

2. **SQLite Database**
   - Auto-initialized on app start
   - 5 tables with relationships
   - Full CRUD operations

3. **All Screens**
   - Dashboard (shows monthly total)
   - Scan (placeholder buttons)
   - Receipts (list with pull-to-refresh)
   - Statistics (category breakdown)
   - Settings (with reset database)

4. **Data Models**
   - Receipt
   - Item
   - Income
   - MonthlyBudget
   - CategoryBudget

## 🧪 Test the Database

Add this to `App.tsx` after `db.init()` to insert test data:

```typescript
// Insert test receipt (one-time)
const testReceipt = await db.insertReceiptWithItems(
  {
    date: new Date().toISOString().split('T')[0],
    store: 'Maxima',
    total: 45.80
  },
  [
    { name: 'Pienas', price: 1.50, category: 'food', necessary: true },
    { name: 'Duona', price: 1.20, category: 'food', necessary: true },
    { name: 'Šokoladas', price: 2.50, category: 'sweets', necessary: false },
    { name: 'Mineralinis vanduo', price: 0.80, category: 'beverages', necessary: false },
    { name: 'Morkos', price: 1.80, category: 'vegetables', necessary: true }
  ]
);
console.log('Test receipt added:', testReceipt);
```

## 📂 Project Structure

```
src/
├── types/           # TypeScript types
├── services/        # Database service
├── navigation/      # Navigation setup
└── screens/         # UI screens
```

## 🔌 Database API Examples

```typescript
// Get all receipts
const receipts = await db.getReceipts();

// Get receipt by ID
const receipt = await db.getReceiptById('some-id');

// Get items for a receipt
const items = await db.getItemsByReceiptId('receipt-id');

// Get spending statistics
const total = await db.getTotalSpent('2024-01-01', '2024-12-31');
const byCategory = await db.getTotalSpentByCategory('2024-01-01', '2024-12-31');

// Insert income
await db.insertIncome({
  amount: 1500,
  date: '2024-02-01',
  source: 'Salary'
});

// Monthly budget
await db.insertMonthlyBudget({
  month: '2024-02',
  income: 1500,
  fixedExpenses: 600,
  savingsGoal: 200
});
```

## 🎯 Next Features to Implement

### Priority 1: Camera
```bash
npx expo install expo-camera expo-image-picker
```

### Priority 2: AI Receipt Processing
```bash
npm install @anthropic-ai/sdk
```

### Priority 3: Charts
```bash
npm install react-native-chart-kit react-native-svg
```

## 🔧 Common Commands

```bash
# Start fresh
npx expo start -c

# Install new package
npx expo install package-name

# Update all packages
npx expo install --fix

# Build for production
eas build --platform android
eas build --platform ios
```

## 💡 Tips

- Use **Settings → Reset Database** to clear data during development
- All screens auto-refresh when you navigate to them
- Database operations are async - always use await
- Check console logs for database initialization status

## 🐛 Troubleshooting

**Database not initializing?**
- Check console for errors
- Try `npx expo start -c` to clear cache

**Navigation types not working?**
- Restart TypeScript server in VSCode
- Run `npx tsc --noEmit` to check types

**App crashing on start?**
- Clear cache: `npx expo start -c`
- Reinstall: `rm -rf node_modules && npm install`

---

**You're ready to start building! 🎉**

The foundation is complete. Now add camera, AI, and UI polish.
