import { useRef, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { CATEGORIES } from '../../data/mockData'
import { exportToCSV, exportToJSON, parseTransactionsCSV, parseTransactionsJSON } from '../../utils/helpers'
import { FiSearch, FiX, FiDownload, FiFilter, FiUpload, FiRefreshCcw, FiTrash2 } from 'react-icons/fi'

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
      {/* Search + export */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="search-transactions"
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl text-sm transition-all duration-200
              bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
              text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <FiX className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            id="export-csv"
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
            id="export-json"
            onClick={() => exportToJSON(filteredTransactions)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200
              bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
              text-gray-600 dark:text-gray-300 hover:border-cyan-400 hover:text-cyan-600
              dark:hover:border-cyan-400 dark:hover:text-cyan-400 hover:shadow-md"
          >
            <FiDownload className="w-4 h-4" />
            <span className="hidden sm:inline">JSON</span>
          </button>

          {/* admin only buttons */}
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
                id="import-btn"
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
                id="reset-sample-btn"
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
                id="clear-all-btn"
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

      {/* filters row */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <FiFilter className="w-4 h-4 text-gray-400 hidden sm:block" />

        <select
          id="filter-category"
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="px-3 py-2 rounded-xl text-xs sm:text-sm cursor-pointer transition-all duration-200
            bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
            text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* type filter buttons */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {['all', 'income', 'expense'].map((type) => (
            <button
              key={type}
              id={`filter-type-${type}`}
              onClick={() => updateFilter('type', type)}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium capitalize transition-all duration-200
                ${filters.type === type
                  ? type === 'income'
                    ? 'bg-emerald-500 text-white'
                    : type === 'expense'
                    ? 'bg-rose-500 text-white'
                    : 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750'
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        <select
          id="filter-sort"
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

        {/* clear filters */}
        {(filters.search || filters.category !== 'All' || filters.type !== 'all') && (
          <button
            id="reset-filters"
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

export default FilterBar
