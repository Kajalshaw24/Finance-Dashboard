import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Route, Routes, Outlet, Link } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
} from 'recharts'
import {
  FiSun, FiMoon, FiShield, FiEye, FiDollarSign, FiPlus, FiX, FiMenu,
  FiSearch, FiDownload, FiFilter, FiEdit2, FiTrash2, FiUpload, FiRefreshCcw,
  FiInbox, FiCheck, FiArrowRight,
  FiHome, FiBarChart2, FiList,
  FiTrendingUp, FiTrendingDown,
} from 'react-icons/fi'
import { v4 as uuidv4 } from 'uuid'

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Health & Fitness',
  'Education',
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other',
]

const CATEGORY_ICONS = {
  'Food & Dining': '🍔',
  'Transportation': '🚗',
  'Shopping': '🛍️',
  'Entertainment': '🎬',
  'Bills & Utilities': '💡',
  'Health & Fitness': '🏋️',
  'Education': '📚',
  'Salary': '💼',
  'Freelance': '💻',
  'Investment': '📈',
  'Gift': '🎁',
  'Other': '📦',
}

const CATEGORY_COLORS = {
  'Food & Dining': '#f97316',
  'Transportation': '#3b82f6',
  'Shopping': '#ec4899',
  'Entertainment': '#8b5cf6',
  'Bills & Utilities': '#eab308',
  'Health & Fitness': '#22c55e',
  'Education': '#06b6d4',
  'Salary': '#10b981',
  'Freelance': '#6366f1',
  'Investment': '#14b8a6',
  'Gift': '#f43f5e',
  'Other': '#94a3b8',
}

const SAMPLE_TRANSACTIONS = [
  { id: uuidv4(), text: 'Monthly Salary', amount: 75000, type: 'income', category: 'Salary', date: '2026-01-01' },
  { id: uuidv4(), text: 'Electricity Bill', amount: 2400, type: 'expense', category: 'Bills & Utilities', date: '2026-01-05' },
  { id: uuidv4(), text: 'Grocery Shopping', amount: 4500, type: 'expense', category: 'Food & Dining', date: '2026-01-07' },
  { id: uuidv4(), text: 'Uber Rides', amount: 1800, type: 'expense', category: 'Transportation', date: '2026-01-10' },
  { id: uuidv4(), text: 'Netflix Subscription', amount: 649, type: 'expense', category: 'Entertainment', date: '2026-01-12' },
  { id: uuidv4(), text: 'Freelance Project', amount: 15000, type: 'income', category: 'Freelance', date: '2026-01-15' },
  { id: uuidv4(), text: 'Gym Membership', amount: 2000, type: 'expense', category: 'Health & Fitness', date: '2026-01-18' },
  { id: uuidv4(), text: 'Monthly Salary', amount: 75000, type: 'income', category: 'Salary', date: '2026-02-01' },
  { id: uuidv4(), text: 'Online Shopping', amount: 8500, type: 'expense', category: 'Shopping', date: '2026-02-03' },
  { id: uuidv4(), text: 'Electricity Bill', amount: 2200, type: 'expense', category: 'Bills & Utilities', date: '2026-02-05' },
  { id: uuidv4(), text: 'Restaurant Dinner', amount: 3200, type: 'expense', category: 'Food & Dining', date: '2026-02-08' },
  { id: uuidv4(), text: 'Birthday Gift', amount: 2500, type: 'expense', category: 'Gift', date: '2026-02-14' },
  { id: uuidv4(), text: 'Course Subscription', amount: 4999, type: 'expense', category: 'Education', date: '2026-02-16' },
  { id: uuidv4(), text: 'Freelance Design Work', amount: 20000, type: 'income', category: 'Freelance', date: '2026-02-20' },
  { id: uuidv4(), text: 'Monthly Salary', amount: 75000, type: 'income', category: 'Salary', date: '2026-03-01' },
  { id: uuidv4(), text: 'Grocery Shopping', amount: 5200, type: 'expense', category: 'Food & Dining', date: '2026-03-04' },
  { id: uuidv4(), text: 'Metro Card Recharge', amount: 1000, type: 'expense', category: 'Transportation', date: '2026-03-06' },
  { id: uuidv4(), text: 'Movie Tickets', amount: 800, type: 'expense', category: 'Entertainment', date: '2026-03-10' },
  { id: uuidv4(), text: 'Stock Dividend', amount: 5000, type: 'income', category: 'Investment', date: '2026-03-15' },
  { id: uuidv4(), text: 'Wi-Fi Bill', amount: 999, type: 'expense', category: 'Bills & Utilities', date: '2026-03-18' },
]

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getMonthYear(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

function groupByCategory(transactions) {
  const map = {}
  for (const t of transactions) {
    map[t.category] = (map[t.category] || 0) + t.amount
  }
  return Object.entries(map)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}

function groupByMonth(transactions) {
  const map = {}
  for (const t of transactions) {
    const key = getMonthYear(t.date)
    if (!map[key]) map[key] = { month: key, income: 0, expense: 0 }
    if (t.type === 'income') map[key].income += t.amount
    else map[key].expense += t.amount
  }
  return Object.values(map).sort((a, b) => new Date('01 ' + a.month) - new Date('01 ' + b.month))
}

function ChartCard({ children }) {
  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-2xl p-5 sm:p-6 border border-gray-200/60 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
      {children}
    </div>
  )
}

function generateInsights(transactions) {
  if (transactions.length === 0) return []
  const insights = []
  const expenses = transactions.filter((t) => t.type === 'expense')
  const incomes = transactions.filter((t) => t.type === 'income')

  if (expenses.length > 0) {
    const catTotals = groupByCategory(expenses)
    const top = catTotals[0]
    insights.push({
      icon: '🔥',
      title: 'Top Spending Category',
      value: top.category,
      description: `You spent ${formatCurrency(top.total)} on ${top.category}`,
      color: 'from-orange-500 to-red-500',
    })
  }

  const monthlyData = groupByMonth(transactions)
  if (monthlyData.length >= 2) {
    const cur = monthlyData[monthlyData.length - 1]
    const prev = monthlyData[monthlyData.length - 2]
    const diff = cur.expense - prev.expense
    const pct = prev.expense > 0 ? ((diff / prev.expense) * 100).toFixed(1) : '0.0'
    insights.push({
      icon: diff > 0 ? '📈' : '📉',
      title: 'Monthly Spending Trend',
      value: `${diff > 0 ? '+' : ''}${pct}%`,
      description: `Spending ${diff > 0 ? 'increased' : 'decreased'} from ${formatCurrency(prev.expense)} to ${formatCurrency(cur.expense)}`,
      color: diff > 0 ? 'from-red-500 to-pink-500' : 'from-green-500 to-emerald-500',
    })
  }

  const avgExp = expenses.length > 0 ? Math.round(expenses.reduce((s, t) => s + t.amount, 0) / expenses.length) : 0
  insights.push({
    icon: '📊',
    title: 'Avg Expense',
    value: formatCurrency(avgExp),
    description: `Across ${expenses.length} expense transactions`,
    color: 'from-blue-500 to-cyan-500',
  })

  const totalIncome = incomes.reduce((s, t) => s + t.amount, 0)
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0)
  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : '0.0'
  insights.push({
    icon: '💎',
    title: 'Savings Rate',
    value: `${savingsRate}%`,
    description: `Saved ${formatCurrency(totalIncome - totalExpense)} of ${formatCurrency(totalIncome)}`,
    color: 'from-violet-500 to-purple-500',
  })

  const largest = [...transactions].sort((a, b) => b.amount - a.amount)[0]
  if (largest) {
    insights.push({
      icon: '💸',
      title: 'Largest Transaction',
      value: formatCurrency(largest.amount),
      description: `"${largest.text}" (${largest.type})`,
      color: 'from-amber-500 to-yellow-500',
    })
  }
  return insights
}

function exportToCSV(transactions) {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount']
  const rows = transactions.map((t) => [t.date, `"${t.text}"`, `"${t.category}"`, t.type, t.amount].join(','))
  const csv = [headers.join(','), ...rows].join('\n')
  downloadFile(csv, 'transactions.csv', 'text/csv')
}

function exportToJSON(transactions) {
  downloadFile(JSON.stringify(transactions, null, 2), 'transactions.json', 'application/json')
}

function parseTransactionsJSON(text) {
  const parsed = JSON.parse(text)
  if (!Array.isArray(parsed)) throw new Error('JSON must be an array')
  return parsed
}

function parseTransactionsCSV(text) {
  const lines = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 0) return []

  const header = splitCSVLine(lines[0]).map((h) => h.trim().toLowerCase())
  const idx = {
    date: header.indexOf('date'),
    text: header.indexOf('description'),
    category: header.indexOf('category'),
    type: header.indexOf('type'),
    amount: header.indexOf('amount'),
  }
  for (const k of ['date', 'text', 'category', 'type', 'amount']) {
    if (idx[k] === -1) throw new Error(`Missing CSV column: ${k === 'text' ? 'Description' : k}`)
  }

  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i])
    rows.push({
      date: cols[idx.date] ?? '',
      description: cols[idx.text] ?? '',
      category: cols[idx.category] ?? '',
      type: cols[idx.type] ?? '',
      amount: cols[idx.amount] ?? '',
    })
  }
  return rows
}

function normalizeImportedTransactions(raw) {
  if (!Array.isArray(raw)) throw new Error('Invalid data')
  const normalized = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const text = String(item.text ?? item.description ?? '').trim()
    const category = String(item.category ?? '').trim() || 'Other'
    const type = String(item.type ?? '').trim().toLowerCase()
    const date = String(item.date ?? '').trim()
    const amountNum = typeof item.amount === 'number'
      ? item.amount
      : Number(String(item.amount ?? '').replace(/[,\s]/g, ''))

    if (!text) continue
    if (!date || Number.isNaN(new Date(date).getTime())) continue
    if (type !== 'income' && type !== 'expense') continue
    if (!Number.isFinite(amountNum) || amountNum <= 0) continue

    normalized.push({
      text,
      category,
      type,
      amount: Math.round(amountNum),
      date: date.slice(0, 10),
    })
  }
  return normalized
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function splitCSVLine(line) {
  const out = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      out.push(cur)
      cur = ''
    } else {
      cur += ch
    }
  }
  out.push(cur)
  return out.map((s) => s.trim())
}

const AppContext = createContext(null)

function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be inside provider')
  return ctx
}

function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('financeflow_transactions')
    return saved ? JSON.parse(saved) : SAMPLE_TRANSACTIONS
  })
  const [role, setRole] = useState(() => localStorage.getItem('financeflow_role') || 'admin')
  const [theme, setTheme] = useState(() => localStorage.getItem('financeflow_theme') || 'dark')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    type: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  })

  useEffect(() => { localStorage.setItem('financeflow_transactions', JSON.stringify(transactions)) }, [transactions])
  useEffect(() => { localStorage.setItem('financeflow_role', role) }, [role])
  useEffect(() => { localStorage.setItem('financeflow_theme', theme) }, [theme])
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark') }, [theme])

  const income = useMemo(
    () => transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [transactions],
  )
  const expense = useMemo(
    () => transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [transactions],
  )
  const balance = income - expense

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        if (filters.search && !t.text.toLowerCase().includes(filters.search.toLowerCase())) return false
        if (filters.category !== 'All' && t.category !== filters.category) return false
        if (filters.type !== 'all' && t.type !== filters.type) return false
        return true
      })
      .sort((a, b) => {
        let cmp = 0
        if (filters.sortBy === 'date') cmp = new Date(a.date) - new Date(b.date)
        else if (filters.sortBy === 'amount') cmp = a.amount - b.amount
        else if (filters.sortBy === 'name') cmp = a.text.localeCompare(b.text)
        return filters.sortOrder === 'desc' ? -cmp : cmp
      })
  }, [transactions, filters])

  const value = {
    transactions,
    filteredTransactions,
    role,
    theme,
    filters,
    income,
    expense,
    balance,
    sidebarOpen,
    setSidebarOpen,
    setRole,
    setFilters,
    resetFilters: () => setFilters({ search: '', category: 'All', type: 'all', sortBy: 'date', sortOrder: 'desc' }),
    toggleTheme: () => setTheme((p) => (p === 'dark' ? 'light' : 'dark')),
    addTransaction: (t) => setTransactions((prev) => [{ ...t, id: uuidv4() }, ...prev]),
    editTransaction: (id, data) => setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t))),
    deleteTransaction: (id) => setTransactions((prev) => prev.filter((t) => t.id !== id)),
    resetToSampleData: () => setTransactions(SAMPLE_TRANSACTIONS),
    clearAllTransactions: () => setTransactions([]),
    importTransactions: (raw, { mode = 'replace' } = {}) => {
      const cleaned = normalizeImportedTransactions(raw).map((t) => ({ ...t, id: uuidv4() }))
      if (mode === 'append') setTransactions((prev) => [...cleaned, ...prev])
      else setTransactions(cleaned)
      return cleaned.length
    },
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: FiHome },
  { to: '/charts', label: 'Charts', icon: FiBarChart2 },
  { to: '/transactions', label: 'Transactions', icon: FiList },
]

function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppContext()
  function handleLinkClick() { setSidebarOpen(false) }

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[280px]
          bg-white dark:bg-gray-950 border-r border-gray-200/70 dark:border-gray-800/70 shadow-xl shadow-black/5 dark:shadow-black/30
          flex flex-col transition-transform duration-300 ease-in-out
          lg:z-30
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-500/20">
              <FiDollarSign className="w-5 h-5 text-white drop-shadow" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
                FinanceFlow
              </h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">Personal Finance</p>
            </div>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-3 mb-3 text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Menu
          </p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/15 dark:border-emerald-500/20'
                  : 'text-gray-700 dark:text-gray-200/80 hover:bg-gray-50 dark:hover:bg-gray-900/60 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-emerald-500/15 dark:bg-emerald-500/20' : 'bg-gray-100 dark:bg-gray-900/60 group-hover:bg-gray-200 dark:group-hover:bg-gray-900'}`}>
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-300' : 'text-gray-600 dark:text-gray-300'}`} />
                  </div>
                  <span>{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center">© 2026 FinanceFlow</p>
        </div>
      </aside>
    </>
  )
}

function Topbar() {
  const { role, setRole, theme, toggleTheme, setSidebarOpen } = useAppContext()
  return (
    <header
      className="sticky top-0 z-30 h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8
        bg-white/85 dark:bg-gray-950/75 backdrop-blur-xl
        border-b border-gray-200/70 dark:border-gray-800/70"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen((p) => !p)}
          className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 items-center justify-center ring-1 ring-emerald-500/20">
            <FiDollarSign className="w-4.5 h-4.5 text-white drop-shadow" />
          </div>
          <div className="leading-tight">
            <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
              FinanceFlow
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:block">
              Personal Finance Dashboard
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="appearance-none pl-8 sm:pl-9 pr-6 sm:pr-8 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-200
              bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
              text-gray-700 dark:text-gray-200
              hover:border-emerald-400 dark:hover:border-emerald-500
              focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <option value="admin">🛡️ Admin</option>
            <option value="viewer">👁️ Viewer</option>
          </select>
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            {role === 'admin'
              ? <FiShield className="w-3.5 h-3.5 text-emerald-500" />
              : <FiEye className="w-3.5 h-3.5 text-blue-500" />
            }
          </div>
        </div>

        <span className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all
          ${role === 'admin'
            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/20'
            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-1 ring-blue-500/20'
          }`}
        >
          {role === 'admin' ? '✏️ Can Edit' : '👀 View Only'}
        </span>

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
          aria-label="Toggle theme"
        >
          {theme === 'dark'
            ? <FiSun className="w-[18px] h-[18px] text-amber-400" />
            : <FiMoon className="w-[18px] h-[18px] text-indigo-500" />
          }
        </button>
      </div>
    </header>
  )
}

function Layout() {
  const { sidebarOpen } = useAppContext()
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Sidebar />
      <div className={`${sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-0'} flex flex-col min-h-screen transition-[margin] duration-300`}>
        <Topbar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </main>
        <footer className="border-t border-gray-200/50 dark:border-gray-800/50 px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-[11px] text-gray-400 dark:text-gray-600 text-center">
            💰 FinanceFlow Dashboard · Expense Tracking Interface || All Rightes Reserved
            <h4>©</h4>
          </p>
        </footer>
      </div>
    </div>
  )
}

function SummaryCards() {
  const { income, expense, balance, transactions } = useAppContext()
  const cards = [
    {
      id: 'income',
      title: 'Total Income',
      amount: income,
      icon: <FiTrendingUp className="w-6 h-6" />,
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      count: transactions.filter((t) => t.type === 'income').length,
    },
    {
      id: 'expense',
      title: 'Total Expenses',
      amount: expense,
      icon: <FiTrendingDown className="w-6 h-6" />,
      gradient: 'from-rose-500 to-pink-600',
      shadow: 'shadow-rose-500/20',
      text: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-500/10',
      count: transactions.filter((t) => t.type === 'expense').length,
    },
    {
      id: 'balance',
      title: 'Net Balance',
      amount: balance,
      icon: <FiDollarSign />,
      gradient: balance >= 0 ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-600',
      shadow: balance >= 0 ? 'shadow-blue-500/20' : 'shadow-orange-500/20',
      text: balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400',
      iconBg: balance >= 0 ? 'bg-blue-500/10' : 'bg-orange-500/10',
      count: transactions.length,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {cards.map((c) => (
        <div
          key={c.id}
          className={`group relative overflow-hidden rounded-2xl p-5 sm:p-6 transition-all duration-300
            bg-white dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/50
            hover:shadow-xl ${c.shadow} hover:scale-[1.02] hover:-translate-y-0.5 cursor-default`}
        >
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.gradient}`} />
          <div className={`absolute -right-6 -top-6 w-28 h-28 rounded-full bg-gradient-to-br ${c.gradient} opacity-[0.04] group-hover:opacity-[0.08] transition-opacity`} />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{c.title}</p>
              <p className={`text-2xl sm:text-3xl font-bold mt-2 ${c.text}`}>{formatCurrency(c.amount)}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">{c.count} transactions</p>
            </div>
            <div className={`p-3 rounded-xl ${c.iconBg} ${c.text}`}>{c.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
      {label && <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</p>}
      {payload.map((e, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: e.color || e.payload?.fill }}>
          {e.name}: {formatCurrency(e.value)}
        </p>
      ))}
    </div>
  )
}

function Charts({ compact = false }) {
  const { transactions, theme } = useAppContext()
  const expenses = transactions.filter((t) => t.type === 'expense')
  const categoryData = groupByCategory(expenses)
  const monthlyData = groupByMonth(transactions)
  const axisColor = theme === 'dark' ? '#6b7280' : '#9ca3af'
  const gridColor = theme === 'dark' ? '#1f2937' : '#f3f4f6'

  if (transactions.length === 0) return null

  return (
    <div className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-2">
      <ChartCard>
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">📊 Spending by Category</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={compact ? 260 : 300}>
            <PieChart>
              <Pie data={categoryData} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={95} innerRadius={55} paddingAngle={3} strokeWidth={0}>
                {categoryData.map((e) => (
                  <Cell key={e.category} fill={CATEGORY_COLORS[e.category] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" iconSize={7} />
            </PieChart>
          </ResponsiveContainer>
        ) : <p className="text-sm text-gray-400 text-center py-8">No expense data</p>}
      </ChartCard>

      <ChartCard>
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">📅 Monthly Overview</h3>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={compact ? 260 : 300}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} axisLine={{ stroke: gridColor }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" iconSize={7} />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[5, 5, 0, 0]} maxBarSize={36} />
              <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[5, 5, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-sm text-gray-400 text-center py-8">No data</p>}
      </ChartCard>

      {!compact && (
        <div className="lg:col-span-2">
          <ChartCard>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">📈 Income vs Expense Trend</h3>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} axisLine={{ stroke: gridColor }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" iconSize={7} />
                  <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2.5} fill="url(#gIncome)" />
                  <Area type="monotone" dataKey="expense" name="Expense" stroke="#f43f5e" strokeWidth={2.5} fill="url(#gExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-gray-400 text-center py-8">No data</p>}
          </ChartCard>
        </div>
      )}
    </div>
  )
}

function InsightsPanel({ limit, embedded } = {}) {
  const { transactions } = useAppContext()
  const allInsights = generateInsights(transactions)
  const insights = typeof limit === 'number' ? allInsights.slice(0, limit) : allInsights
  if (insights.length === 0) return null

  const Grid = (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${typeof limit === 'number' ? 'xl:grid-cols-3' : 'xl:grid-cols-5'} gap-3`}>
      {insights.map((ins, i) => (
        <div
          key={i}
          className="group relative overflow-hidden rounded-xl p-4 transition-all duration-200 hover:scale-[1.02]
            bg-gray-50 dark:bg-gray-900/60 border border-gray-200/50 dark:border-gray-700/40
            hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${ins.color} opacity-0 group-hover:opacity-[0.04] transition-opacity`} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{ins.icon}</span>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider leading-tight">{ins.title}</p>
            </div>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-0.5">{ins.value}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{ins.description}</p>
          </div>
        </div>
      ))}
    </div>
  )

  if (embedded) return Grid

  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-2xl p-5 sm:p-6 border border-gray-200/60 dark:border-gray-700/50">
      <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        🧠 Smart Insights
      </h3>
      {Grid}
    </div>
  )
}

function EmptyState() {
  const { filters, resetFilters, role } = useAppContext()
  const hasFilters = filters.search || filters.category !== 'All' || filters.type !== 'all'
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <FiInbox className="w-8 h-8 text-gray-300 dark:text-gray-600" />
      </div>
      <h3 className="text-base font-bold text-gray-700 dark:text-gray-300 mb-1">
        {hasFilters ? 'No matching transactions' : 'No transactions yet'}
      </h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 text-center max-w-sm mb-5">
        {hasFilters ? 'Try adjusting your filters or search query.' : role === 'admin' ? 'Start by adding your first transaction.' : 'Switch to Admin role to add transactions.'}
      </p>
      {hasFilters && (
        <button
          onClick={resetFilters}
          className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
            hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}

function TransactionTable({ onEdit }) {
  const { filteredTransactions, role, deleteTransaction } = useAppContext()

  function handleDelete(id, text) {
    if (window.confirm(`Delete "${text}"?`)) deleteTransaction(id)
  }

  if (filteredTransactions.length === 0) return <EmptyState />

  return (
    <div className="space-y-3">
      <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200/60 dark:border-gray-700/50 bg-white dark:bg-gray-800/60">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transaction</th>
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th className="text-right px-5 py-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
              {role === 'admin' && <th className="text-right px-5 py-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="group hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{CATEGORY_ICONS[t.category] || '📦'}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{t.text}</p>
                      <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
                        ${t.type === 'income'
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {t.type}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400">{t.category}</td>
                <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{formatDate(t.date)}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </td>
                {role === 'admin' && (
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(t)} className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors" title="Edit">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(t.id, t.text)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors" title="Delete">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {filteredTransactions.map((t) => (
          <div key={t.id} className="bg-white dark:bg-gray-800/60 rounded-xl p-4 border border-gray-200/60 dark:border-gray-700/50 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{CATEGORY_ICONS[t.category] || '📦'}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t.text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.category} · {formatDate(t.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
                  ${t.type === 'income'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                  }`}
                >
                  {t.type}
                </span>
              </div>
            </div>
            {role === 'admin' && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                <button
                  onClick={() => onEdit(t)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
                    bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <FiEdit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.text)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
                    bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <FiTrash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function TransactionForm({ isOpen, onClose, editingTransaction }) {
  const { addTransaction, editTransaction } = useAppContext()
  const [form, setForm] = useState(() => ({
    text: editingTransaction?.text ?? '',
    amount: editingTransaction ? String(editingTransaction.amount) : '',
    type: editingTransaction?.type ?? 'expense',
    category: editingTransaction?.category ?? 'Food & Dining',
    date: editingTransaction?.date ?? new Date().toISOString().split('T')[0],
  }))
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  function validate() {
    const e = {}
    if (!form.text.trim()) e.text = 'Required'
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Invalid'
    if (!form.date) e.date = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function upd(k, v) {
    setForm((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => ({ ...p, [k]: '' }))
  }

  function submit(ev) {
    ev.preventDefault()
    if (!validate()) return
    const data = {
      text: form.text.trim(),
      amount: Math.round(Number(form.amount)),
      type: form.type,
      category: form.category,
      date: form.date,
    }
    if (editingTransaction) editTransaction(editingTransaction.id, data)
    else addTransaction(data)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-slideUp">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
            {editingTransaction ? '✏️ Edit Transaction' : '➕ New Transaction'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={submit} className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <input
              type="text"
              value={form.text}
              onChange={(e) => upd('text', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200
                bg-gray-50 dark:bg-gray-900 border text-gray-900 dark:text-gray-100
                placeholder-gray-400 focus:outline-none focus:ring-2
                ${errors.text ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-500/50 focus:border-emerald-400'}`}
            />
            {errors.text && <p className="mt-1 text-xs text-red-500">{errors.text}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Amount (₹)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.amount}
                onChange={(e) => upd('amount', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200
                  bg-gray-50 dark:bg-gray-900 border text-gray-900 dark:text-gray-100
                  placeholder-gray-400 focus:outline-none focus:ring-2
                  ${errors.amount ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-500/50 focus:border-emerald-400'}`}
              />
              {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type</label>
              <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 h-[42px]">
                {['income', 'expense'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => upd('type', t)}
                    className={`flex-1 text-sm font-medium capitalize transition-all duration-200
                      ${form.type === t
                        ? t === 'income' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                        : 'bg-gray-50 dark:bg-gray-900 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => upd('category', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-200
                  bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                  text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => upd('date', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200
                  bg-gray-50 dark:bg-gray-900 border text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2
                  ${errors.date ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-500/50 focus:border-emerald-400'}`}
              />
              {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300
              bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600
              hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]
              flex items-center justify-center gap-2"
          >
            {editingTransaction ? <><FiCheck className="w-4 h-4" /> Update</> : <><FiPlus className="w-4 h-4" /> Add</>}
          </button>
        </form>
      </div>
    </div>
  )
}

function FilterBar() {
  const { filters, setFilters, resetFilters, filteredTransactions, transactions, role, importTransactions, resetToSampleData, clearAllTransactions } = useAppContext()
  const fileInputRef = useRef(null)
  const [importError, setImportError] = useState('')
  const [importInfo, setImportInfo] = useState('')

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  async function handleImportFile(file) {
    setImportError('')
    setImportInfo('')
    if (!file) return
    try {
      const text = await file.text()
      const ext = file.name.toLowerCase().split('.').pop()
      const raw = ext === 'csv' ? parseTransactionsCSV(text) : parseTransactionsJSON(text)
      const importedCount = importTransactions(raw, { mode: 'replace' })
      setImportInfo(`Imported ${importedCount} transactions`)
      resetFilters()
    } catch (e) {
      setImportError(e instanceof Error ? e.message : 'Import failed')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function handleResetSample() {
    setImportError('')
    setImportInfo('')
    if (!window.confirm('Reset transactions to sample data? This will replace your current list.')) return
    resetToSampleData()
    resetFilters()
    setImportInfo('Reset to sample data')
  }

  function handleClearAll() {
    setImportError('')
    setImportInfo('')
    if (!window.confirm('Clear ALL transactions? This cannot be undone.')) return
    clearAllTransactions()
    resetFilters()
    setImportInfo('Cleared all transactions')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 sm:py-3 rounded-xl text-sm transition-all duration-200
              bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
              text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400"
          />
          {filters.search ? (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <FiX className="w-3.5 h-3.5 text-gray-400" />
            </button>
          ) : (
            <FiSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => exportToCSV(filteredTransactions)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200
              bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
              text-gray-600 dark:text-gray-300 hover:border-emerald-400 hover:text-emerald-600
              dark:hover:border-emerald-400 dark:hover:text-emerald-400 hover:shadow-md"
          >
            <FiDownload className="w-4 h-4" />
            <span className="hidden sm:inline">CSV</span>
          </button>
          <button
            onClick={() => exportToJSON(filteredTransactions)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200
              bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
              text-gray-600 dark:text-gray-300 hover:border-cyan-400 hover:text-cyan-600
              dark:hover:border-cyan-400 dark:hover:text-cyan-400 hover:shadow-md"
          >
            <FiDownload className="w-4 h-4" />
            <span className="hidden sm:inline">JSON</span>
          </button>

          {role === 'admin' && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json,application/json,text/csv"
                className="hidden"
                onChange={(e) => handleImportFile(e.target.files?.[0])}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200
                  bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                  text-gray-600 dark:text-gray-300 hover:border-violet-400 hover:text-violet-600
                  dark:hover:border-violet-400 dark:hover:text-violet-400 hover:shadow-md"
                title="Import transactions from CSV or JSON (replaces current list)"
              >
                <FiUpload className="w-4 h-4" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <button
                onClick={handleResetSample}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200
                  bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                  text-gray-600 dark:text-gray-300 hover:border-amber-400 hover:text-amber-600
                  dark:hover:border-amber-400 dark:hover:text-amber-400 hover:shadow-md"
                title="Reset to bundled sample data"
              >
                <FiRefreshCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200
                  bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                  text-gray-600 dark:text-gray-300 hover:border-rose-400 hover:text-rose-600
                  dark:hover:border-rose-400 dark:hover:text-rose-400 hover:shadow-md"
                title="Clear all transactions"
              >
                <FiTrash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {(importError || importInfo) && (
        <div className={`rounded-xl border px-4 py-3 text-sm ${
          importError
            ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
            : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
        }`}>
          {importError || importInfo}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <FiFilter className="w-4 h-4 text-gray-400 hidden sm:block" />
        <select
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="px-3 py-2 rounded-xl text-xs sm:text-sm cursor-pointer transition-all duration-200
            bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
            text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {['all', 'income', 'expense'].map((type) => (
            <button
              key={type}
              onClick={() => updateFilter('type', type)}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium capitalize transition-all duration-200
                ${filters.type === type
                  ? type === 'income' ? 'bg-emerald-500 text-white'
                    : type === 'expense' ? 'bg-rose-500 text-white'
                      : 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750'
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-')
            setFilters((prev) => ({ ...prev, sortBy, sortOrder }))
          }}
          className="px-3 py-2 rounded-xl text-xs sm:text-sm cursor-pointer transition-all duration-200
            bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
            text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
          <option value="name-asc">A → Z</option>
          <option value="name-desc">Z → A</option>
        </select>

        {(filters.search || filters.category !== 'All' || filters.type !== 'all') && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200
              bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400
              hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800"
          >
            <FiX className="w-3.5 h-3.5" />
            Clear
          </button>
        )}

        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
          {filteredTransactions.length} of {transactions.length} transactions
        </span>
      </div>
    </div>
  )
}

function DashboardPage() {
  const { transactions } = useAppContext()
  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8)

  return (
    <div className="space-y-5 sm:space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of your financial activity</p>
      </div>

      <SummaryCards />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
        <div className="xl:col-span-2 space-y-4 sm:space-y-5">
          <Charts compact />
        </div>
        <div className="space-y-4 sm:space-y-5">
          <div className="bg-white dark:bg-gray-800/60 rounded-2xl p-5 sm:p-6 border border-gray-200/60 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">🧠 Key Insights</h3>
              <Link to="/charts" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                View more
              </Link>
            </div>
            <InsightsPanel limit={3} embedded />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-200/60 dark:border-gray-700/50 overflow-hidden">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700/50">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">📋 Recent Transactions</h3>
          <Link
            to="/transactions"
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            View All <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/40 max-h-[340px] overflow-auto">
            {recentTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-5 sm:px-6 py-3 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{CATEGORY_ICONS[t.category] || '📦'}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{t.text}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">{t.category} · {formatDate(t.date)}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">No transactions yet</p>
        )}
      </div>
    </div>
  )
}

function ChartsPage() {
  const { transactions } = useAppContext()
  const expenses = transactions.filter((t) => t.type === 'expense')
  const categoryBreakdown = groupByCategory(expenses)

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Charts & Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Visual breakdown of your income and expenses</p>
      </div>

      <Charts />

      <div className="bg-white dark:bg-gray-800/60 rounded-2xl p-5 sm:p-6 border border-gray-200/60 dark:border-gray-700/50">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">📂 Category Breakdown</h3>
        {categoryBreakdown.length > 0 ? (
          <div className="space-y-3">
            {categoryBreakdown.map((cat) => {
              const totalExp = expenses.reduce((s, t) => s + t.amount, 0)
              const pct = totalExp > 0 ? ((cat.total / totalExp) * 100).toFixed(1) : 0
              return (
                <div key={cat.category} className="flex items-center gap-3">
                  <span className="text-lg w-8 text-center">{CATEGORY_ICONS[cat.category] || '📦'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{cat.category}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500">{pct}%</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{formatCurrency(cat.total)}</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[cat.category] || '#94a3b8' }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">No expense data to show</p>
        )}
      </div>
    </div>
  )
}

function TransactionsPage() {
  const { role } = useAppContext()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  function handleAdd() { setEditingTransaction(null); setIsFormOpen(true) }
  function handleEdit(t) { setEditingTransaction(t); setIsFormOpen(true) }
  function handleClose() { setIsFormOpen(false); setEditingTransaction(null) }

  return (
    <div className="space-y-5 sm:space-y-6 animate-fadeIn">
      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Transactions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {role === 'admin' ? 'Manage your income and expenses' : 'View your income and expenses'}
          </p>
        </div>
        {role === 'admin' && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl text-sm font-semibold text-white
              bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600
              shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/25
              transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <FiPlus className="w-4 h-4" />
            Add Transaction
          </button>
        )}
      </div>

      <FilterBar />
      <TransactionTable onEdit={handleEdit} />

      {role === 'admin' && isFormOpen && (
        <TransactionForm
          key={editingTransaction?.id || 'new'}
          isOpen={isFormOpen}
          onClose={handleClose}
          editingTransaction={editingTransaction}
        />
      )}
    </div>
  )
}

export default function FinanceFlowStandalone() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/charts" element={<ChartsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Route>
      </Routes>
    </AppProvider>
  )
}
