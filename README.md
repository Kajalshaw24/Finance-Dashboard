# FinanceFlow - Personal Finance Dashboard

A personal finance management dashboard built with React. Track your income and expenses with beautiful charts, advanced filtering, and data persistence.

**Live Demo:** [https://kajalshaw24.github.io/Finance-Dashboard/](https://kajalshaw24.github.io/Finance-Dashboard/)

## Features

- 📊 **Summary Cards** - Total income, expenses, and balance at a glance
- 📈 **Charts** - Pie chart for spending by category, bar chart for monthly trends
- 💰 **Transactions** - Add, edit, and delete transactions
- 🔍 **Filtering** - Search, filter by category/type, and sort options
- 📥 **Import/Export** - CSV and JSON support
- 🌙 **Dark Mode** - Light and dark theme toggle
- 👤 **Roles** - Admin (edit) and Viewer (read-only) modes
- 💾 **Data Persistence** - All data saved in browser localStorage

## Tech Stack

- React 19
- Tailwind CSS 4
- Recharts
- Vite
- Context API
- localStorage

## Installation

```bash
# Clone repository
git clone https://github.com/Kajalshaw24/Finance-Dashboard.git
cd Finance-Dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

## Usage

### Adding Transactions
1. Switch to **Admin** role
2. Click **"Add Transaction"**
3. Fill in details and save

### Filtering
- Search by description
- Filter by category or type
- Sort by date, amount, or name
- Reset filters anytime

### Import/Export
- Click **"Download CSV"** or **"Download JSON"** to export
- Click **"Upload File"** to import transactions

### Dark Mode
- Click sun/moon icon in header to toggle theme

## Project Structure

```
src/
├── components/Dashboard/    # UI Components
├── context/AppContext.jsx   # State management
├── data/mockData.js        # Sample data
├── utils/helpers.js        # Utility functions
├── App.jsx                 # Main component
└── main.jsx               # Entry point
```

## Data Storage

All data is stored in browser's **localStorage**:
- ✅ Persists between sessions
- ✅ No server required
- 💡 Export regularly for backup

## Build for Production

```bash
npm run build
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License

---

**Live:** [https://kajalshaw24.github.io/Finance-Dashboard/](https://kajalshaw24.github.io/Finance-Dashboard/)
# FinanceFlow - Personal Finance Dashboard

A modern, feature-rich personal finance management dashboard built with React and Tailwind CSS. Track your income and expenses with an intuitive interface, visualize spending patterns, and gain actionable financial insights.

## Features

### 💰 Core Features
- **Transaction Management** - Add, edit, and delete income and expense transactions
- **Expense Tracking** - Categorize transactions across 12+ pre-defined categories
- **Dark Mode Support** - Seamless light/dark theme switching with persistent preference
- **Role-Based Access** - Admin mode for full editing capabilities, Viewer mode for read-only access

### 📊 Analytics & Visualization
- **Summary Cards** - Quick overview of total income, expenses, and net balance
- **Monthly Comparison Chart** - Bar chart showing income vs expense trends
- **Expense Breakdown** - Pie chart displaying spending distribution by category
- **Smart Insights** - Auto-generated financial insights including:
  - Top spending categories
  - Monthly spending trends
  - Average expense per transaction
  - Savings rate calculation
  - Largest transactions

### 🔍 Data Management
- **Advanced Filtering** - Filter by search term, category, and transaction type
- **Flexible Sorting** - Sort by date, amount, or description
- **Data Persistence** - All data automatically saved to browser localStorage
- **Import/Export** - Import transactions from JSON/CSV files or export current data
- **Sample Data** - Pre-loaded with 3 months of example transactions

## Technology Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework with dark mode support
- **React Router 7** - Client-side routing for multi-page applications

### Data Visualization
- **Recharts** - Flexible charting library for financial data
- **React Icons** - Icon library for UI components

### Development
- **ESLint** - Code quality and style enforcement
- **LocalStorage API** - Client-side data persistence

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kajalshaw24/Finance-Dashboard.git
   cd Finance-Dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Usage Guide

### Adding Transactions
1. Click **"Add Transaction"** button (Admin mode only)
2. Fill in transaction details and click **Save**

### Filtering & Searching
- Use search, category filters, and sort options to view specific transactions

### Exporting Data
- Click **"Download CSV"** or **"Download JSON"** to export your data

### Importing Data
- Click **"Upload File"** to import transactions from JSON or CSV

## Theme & Display

Click the sun/moon icon in the header to toggle between light and dark modes.

## Data Storage

All data is stored in browser localStorage. Data persists between sessions but will be lost if you clear your cache.

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## License

MIT License - Feel free to use this project for learning purposes.

---

**Happy tracking! 💰**
