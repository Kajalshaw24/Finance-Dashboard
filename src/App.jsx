import { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppProvider, useAppContext } from './context/AppContext'
import Header from './components/Dashboard/Header'
import SummaryCards from './components/Dashboard/SummaryCards'
import Charts from './components/Dashboard/Charts'
import InsightsPanel from './components/Dashboard/InsightsPanel'
import FilterBar from './components/Dashboard/FilterBar'
import TransactionTable from './components/Dashboard/TransactionTable'
import TransactionForm from './components/Dashboard/TransactionForm'
import { FiPlus } from 'react-icons/fi'

function DashboardContent() {
  const { role } = useAppContext()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  function handleAdd() {
    setEditingTransaction(null)
    setIsFormOpen(true)
  }

  function handleEdit(transaction) {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  function handleCloseForm() {
    setIsFormOpen(false)
    setEditingTransaction(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-y-10">

        <section id="summary-section" className="flex flex-col gap-y-6">
          <SummaryCards />
        </section>

        <section id="charts-section" >
          <Charts />
        </section>

        <section id="insights-section">
          <InsightsPanel />
        </section>

        <section id="transactions-section" className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
                📋 Transactions
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {role === 'admin' ? 'Manage your income and expenses' : 'View your income and expenses'}
              </p>
            </div>

            {role === 'admin' && (
              <button
                id="add-transaction-btn"
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm font-semibold text-white
                  bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600
                  shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30
                  transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <FiPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Transaction</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
          </div>

          <FilterBar />
          <TransactionTable onEdit={handleEdit} />
        </section>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            💰 FinanceFlow Dashboard · Expense Tracking Interface || All Rightes Reserved
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Role: <span className="font-semibold capitalize text-gray-600 dark:text-gray-300">{role}</span>
            </span>
            <span className="text-gray-300 dark:text-gray-700 mx-2">·</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Data persisted in localStorage
            </span>
          </div>
        </div>
      </footer>

      {/* modal for add/edit */}
      {role === 'admin' && isFormOpen && (
        <TransactionForm
          key={editingTransaction?.id || 'new'}
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          editingTransaction={editingTransaction}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <HashRouter>
    <AppProvider>
      <Routes>
        <Route path="*" element={<DashboardContent />}/>
      </Routes>
      
    </AppProvider>
    </HashRouter>
  )
}

export default App
