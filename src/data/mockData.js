/**
 * Sample data and configuration for FinanceFlow
 */

import { v4 as uuidv4 } from 'uuid'

export const CATEGORIES = [
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

// Emoji icons for each category
export const CATEGORY_ICONS = {
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

// Colors for visualizations
export const CATEGORY_COLORS = {
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

// Sample transactions
export const INITIAL_TRANSACTIONS = [
  // jan
  { id: uuidv4(), text: 'Monthly Salary',        amount: 75000, type: 'income',  category: 'Salary',           date: '2026-01-01' },
  { id: uuidv4(), text: 'Electricity Bill',       amount: 2400,  type: 'expense', category: 'Bills & Utilities', date: '2026-01-05' },
  { id: uuidv4(), text: 'Grocery Shopping',       amount: 4500,  type: 'expense', category: 'Food & Dining',     date: '2026-01-07' },
  { id: uuidv4(), text: 'Uber Rides',             amount: 1800,  type: 'expense', category: 'Transportation',    date: '2026-01-10' },
  { id: uuidv4(), text: 'Netflix Subscription',   amount: 649,   type: 'expense', category: 'Entertainment',     date: '2026-01-12' },
  { id: uuidv4(), text: 'Freelance Project',      amount: 15000, type: 'income',  category: 'Freelance',         date: '2026-01-15' },
  { id: uuidv4(), text: 'Gym Membership',         amount: 2000,  type: 'expense', category: 'Health & Fitness',  date: '2026-01-18' },

  // feb
  { id: uuidv4(), text: 'Monthly Salary',        amount: 75000, type: 'income',  category: 'Salary',           date: '2026-02-01' },
  { id: uuidv4(), text: 'Online Shopping',        amount: 8500,  type: 'expense', category: 'Shopping',          date: '2026-02-03' },
  { id: uuidv4(), text: 'Electricity Bill',       amount: 2200,  type: 'expense', category: 'Bills & Utilities', date: '2026-02-05' },
  { id: uuidv4(), text: 'Restaurant Dinner',      amount: 3200,  type: 'expense', category: 'Food & Dining',     date: '2026-02-08' },
  { id: uuidv4(), text: 'Birthday Gift',          amount: 2500,  type: 'expense', category: 'Gift',              date: '2026-02-14' },
  { id: uuidv4(), text: 'Course Subscription',    amount: 4999,  type: 'expense', category: 'Education',         date: '2026-02-16' },
  { id: uuidv4(), text: 'Freelance Design Work',  amount: 20000, type: 'income',  category: 'Freelance',         date: '2026-02-20' },

  // march
  { id: uuidv4(), text: 'Monthly Salary',        amount: 75000, type: 'income',  category: 'Salary',           date: '2026-03-01' },
  { id: uuidv4(), text: 'Grocery Shopping',       amount: 5200,  type: 'expense', category: 'Food & Dining',     date: '2026-03-04' },
  { id: uuidv4(), text: 'Metro Card Recharge',    amount: 1000,  type: 'expense', category: 'Transportation',    date: '2026-03-06' },
  { id: uuidv4(), text: 'Movie Tickets',          amount: 800,   type: 'expense', category: 'Entertainment',     date: '2026-03-10' },
  { id: uuidv4(), text: 'Stock Dividend',         amount: 5000,  type: 'income',  category: 'Investment',        date: '2026-03-15' },
  { id: uuidv4(), text: 'Wi-Fi Bill',             amount: 999,   type: 'expense', category: 'Bills & Utilities', date: '2026-03-18' },
]
