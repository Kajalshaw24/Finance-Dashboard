/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect } from 'react'

import { createContext, useContext, useState, useEffect } from 'react'
import { INITIAL_TRANSACTIONS } from '../data/mockData'
import { v4 as uuidv4 } from 'uuid'
import { normalizeImportedTransactions } from '../utils/helpers'

const AppContext = createContext()

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance_transactions')
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS
  })

  const [role, setRole] = useState(() => {
    return localStorage.getItem('finance_role') || 'admin'
  })

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('finance_theme') || 'dark'
  })

  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    type: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  })

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('finance_role', role)
  }, [role])

  useEffect(() => {
    localStorage.setItem('finance_theme', theme)
  }, [theme])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  function addTransaction(transaction) {
    const newTransaction = {
      ...transaction,
      id: uuidv4(),
    }
    setTransactions((prev) => [newTransaction, ...prev])
  }

  function editTransaction(id, updatedData) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t))
    )
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  function replaceAllTransactions(next) {
    setTransactions(next)
  }

  function resetToSampleData() {
    setTransactions(INITIAL_TRANSACTIONS)
  }

  function clearAllTransactions() {
    setTransactions([])
  }

  function importTransactions(raw, { mode = 'replace' } = {}) {
    const cleaned = normalizeImportedTransactions(raw)
    const withIds = cleaned.map((t) => ({ ...t, id: uuidv4() }))

    if (mode === 'append') {
      setTransactions((prev) => [...withIds, ...prev])
      return withIds.length
    }

    replaceAllTransactions(withIds)
    return withIds.length
  }

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  function resetFilters() {
    setFilters({
      search: '',
      category: 'All',
      type: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
    })
  }

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expense

  const filteredTransactions = transactions
    .filter((t) => {
      if (filters.search && !t.text.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      if (filters.category !== 'All' && t.category !== filters.category) {
        return false
      }
      if (filters.type !== 'all' && t.type !== filters.type) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      let comparison = 0
      if (filters.sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date)
      } else if (filters.sortBy === 'amount') {
        comparison = a.amount - b.amount
      } else if (filters.sortBy === 'name') {
        comparison = a.text.localeCompare(b.text)
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison
    })

  const value = {
    transactions,
    filteredTransactions,
    role,
    theme,
    filters,
    income,
    expense,
    balance,
    addTransaction,
    editTransaction,
    deleteTransaction,
    replaceAllTransactions,
    resetToSampleData,
    clearAllTransactions,
    importTransactions,
    setRole,
    toggleTheme,
    setFilters,
    resetFilters,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
