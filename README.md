# Receipt Tracker - React Native App

A production-ready React Native (Expo) mobile app for scanning receipts and tracking finances with AI assistance.

## 🏗️ Project Structure

```
ReceiptTracker/
├── App.tsx                          # Main app entry point
├── app.json                         # Expo configuration
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── babel.config.js                  # Babel config
└── src/
    ├── types/
    │   ├── models.ts                # Data models (Receipt, Item, Income, etc.)
    │   └── navigation.ts            # Navigation type definitions
    ├── services/
    │   └── database.ts              # SQLite database service
    ├── navigation/
    │   ├── RootNavigator.tsx        # Root stack navigator
    │   └── MainTabNavigator.tsx     # Bottom tab navigator
    └── screens/
        ├── DashboardScreen.tsx      # Home dashboard
        ├── ScanScreen.tsx           # Receipt scanning
        ├── ReceiptsScreen.tsx       # List of receipts
        ├── StatisticsScreen.tsx     # Spending analytics
        ├── SettingsScreen.tsx       # App settings
        └── ReceiptDetailScreen.tsx  # Receipt details view
```

## 📦 Tech Stack

- **React Native** with Expo (managed workflow)
- **TypeScript** for type safety
- **React Navigation** (Stack + Bottom Tabs)
- **Expo SQLite** for local database
- **Expo Vector Icons** for UI icons

## 🗄️ Database Schema

### Tables

**receipts**
- id (TEXT PRIMARY KEY)
- date (TEXT)
- store (TEXT)
- total (REAL)
- createdAt (TEXT)
- updatedAt (TEXT)

**items**
- id (TEXT PRIMARY KEY)
- receiptId (TEXT, FOREIGN KEY)
- name (TEXT)
- price (REAL)
- category (TEXT)
- necessary (INTEGER)
- createdAt (TEXT)

**incomes**
- id (TEXT PRIMARY KEY)
- amount (REAL)
- date (TEXT)
- source (TEXT)
- createdAt (TEXT)

**monthly_budgets**
- id (TEXT PRIMARY KEY)
- month (TEXT UNIQUE)
- income (REAL)
- fixedExpenses (REAL)
- savingsGoal (REAL)
- createdAt (TEXT)
- updatedAt (TEXT)

**category_budgets**
- id (TEXT PRIMARY KEY)
- monthlyBudgetId (TEXT, FOREIGN KEY)
- category (TEXT)
- allocatedAmount (REAL)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Expo Go app on your phone (for testing)

### Installation

1. **Install dependencies:**
```bash
npm install
# or
yarn install
```

2. **Start the development server:**
```bash
npx expo start
```

3. **Run on device:**
- Scan QR code with Expo Go (Android)
- Scan QR code with Camera app (iOS)

### Build for Production

**Android:**
```bash
eas build --platform android
```

**iOS:**
```bash
eas build --platform ios
```

## 📱 Features Implemented

✅ **Navigation**
- Bottom tab navigation (Dashboard, Scan, Receipts, Statistics, Settings)
- Stack navigation for detail screens
- Type-safe navigation with TypeScript

✅ **Database**
- SQLite with expo-sqlite
- Full CRUD operations for all models
- Proper foreign key relationships
- Database initialization on app start

✅ **Screens**
- Dashboard: Overview of monthly spending
- Scan: Placeholder for camera/gallery integration
- Receipts: List of all receipts with pull-to-refresh
- Statistics: Spending breakdown by category
- Settings: App configuration and data management
- Receipt Detail: Full receipt with items and metadata

✅ **Data Models**
- Receipt with items relationship
- Income tracking
- Monthly budgets
- Category budgets
- Item categories (7 types)

## 🔨 Next Steps for Implementation

### 1. Camera Integration
```bash
npx expo install expo-camera expo-image-picker
```
Implement in `ScanScreen.tsx`

### 2. AI Receipt Processing
```bash
npm install @anthropic-ai/sdk
```
Add OCR and text extraction logic

### 3. Charts & Visualizations
```bash
npm install react-native-chart-kit react-native-svg
```
Enhance statistics screen

### 4. Offline Support
```bash
npm install @react-native-async-storage/async-storage
```
Cache data for offline use

### 5. Export Functionality
Implement CSV/PDF export in Settings

## 🧪 Testing Database

The app includes a database reset function in Settings for development.

You can also test database operations directly:

```typescript
import { db } from './src/services/database';

// Insert test receipt
const receiptId = await db.insertReceiptWithItems(
  {
    date: '2024-02-16',
    store: 'Test Store',
    total: 25.50
  },
  [
    {
      name: 'Milk',
      price: 3.50,
      category: 'food',
      necessary: true
    },
    {
      name: 'Chocolate',
      price: 2.00,
      category: 'sweets',
      necessary: false
    }
  ]
);
```

## 🎨 Customization

### Colors
Primary color is defined as `#4F46E5` (Indigo). Update in:
- Navigation header backgrounds
- Active tab colors
- Button colors

### Categories
Add/modify categories in `src/types/models.ts`:
```typescript
export enum ItemCategory {
  SWEETS = 'sweets',
  // Add more categories here
}
```

## 📝 Code Quality

- **TypeScript** for type safety
- **ESLint** ready (add .eslintrc.js if needed)
- **Consistent styling** with StyleSheet API
- **Error handling** in all async operations
- **Loading states** for better UX

## 🐛 Debugging

```bash
# Clear cache
npx expo start -c

# View logs
npx expo start --dev-client

# iOS simulator logs
npx react-native log-ios

# Android logs
npx react-native log-android
```

## 📄 License

MIT

## 👨‍💻 Development Notes

- Database is stored locally on device
- Data persists between app restarts
- Use `db.resetDatabase()` to clear all data during development
- All navigation is type-safe with TypeScript
- Ready for camera and AI integration

---

**Status:** ✅ Starter code complete and ready for feature implementation
