import { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { CATEGORIES } from '../../data/mockData'
import { FiX, FiPlus, FiCheck } from 'react-icons/fi'

function TransactionForm({ isOpen, onClose, editingTransaction }) {
  const { addTransaction, editTransaction } = useAppContext()

  // Form state with defaults based on edit mode
  const [formData, setFormData] = useState({
    text: editingTransaction?.text ?? '',
    amount: editingTransaction ? String(editingTransaction.amount) : '',
    type: editingTransaction?.type ?? 'expense',
    category: editingTransaction?.category ?? 'Food & Dining',
    date: editingTransaction?.date ?? new Date().toISOString().split('T')[0],
  })

  // Track validation errors
  const [errors, setErrors] = useState({})

  function validate() {
    const newErrors = {}
    if (!formData.text.trim()) newErrors.text = 'Description is required'
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Enter a valid amount'
    if (!formData.date) newErrors.date = 'Date is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    const transactionData = {
      text: formData.text.trim(),
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date,
    }

    if (editingTransaction) {
      editTransaction(editingTransaction.id, transactionData)
    } else {
      addTransaction(transactionData)
    }

    onClose()
  }

  function updateField(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-slideUp">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
            {editingTransaction ? '✏️ Edit Transaction' : '➕ New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description
            </label>
            <input
              id="form-description"
              type="text"
              value={formData.text}
              onChange={(e) => updateField('text', e.target.value)}
              placeholder="e.g. Grocery Shopping"
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200
                bg-gray-50 dark:bg-gray-900 border text-gray-900 dark:text-gray-100
                placeholder-gray-400 focus:outline-none focus:ring-2
                ${errors.text
                  ? 'border-red-400 focus:ring-red-500/50'
                  : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-500/50 focus:border-emerald-400'
                }`}
            />
            {errors.text && <p className="mt-1 text-xs text-red-500">{errors.text}</p>}
          </div>

          {/* amount + type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Amount (₹)
              </label>
              <input
                id="form-amount"
                type="number"
                min="0"
                step="1"
                value={formData.amount}
                onChange={(e) => updateField('amount', e.target.value)}
                placeholder="5000"
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200
                  bg-gray-50 dark:bg-gray-900 border text-gray-900 dark:text-gray-100
                  placeholder-gray-400 focus:outline-none focus:ring-2
                  ${errors.amount
                    ? 'border-red-400 focus:ring-red-500/50'
                    : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-500/50 focus:border-emerald-400'
                  }`}
              />
              {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Type
              </label>
              <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 h-[42px]">
                <button
                  type="button"
                  onClick={() => updateField('type', 'income')}
                  className={`flex-1 text-sm font-medium transition-all duration-200
                    ${formData.type === 'income'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => updateField('type', 'expense')}
                  className={`flex-1 text-sm font-medium transition-all duration-200
                    ${formData.type === 'expense'
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  Expense
                </button>
              </div>
            </div>
          </div>

          {/* category + date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Category
              </label>
              <select
                id="form-category"
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-200
                  bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                  text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Date
              </label>
              <input
                id="form-date"
                type="date"
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200
                  bg-gray-50 dark:bg-gray-900 border text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2
                  ${errors.date
                    ? 'border-red-400 focus:ring-red-500/50'
                    : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-500/50 focus:border-emerald-400'
                  }`}
              />
              {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
            </div>
          </div>

          <button
            id="form-submit"
            type="submit"
            className="w-full mt-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300
              bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600
              hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]
              flex items-center justify-center gap-2"
          >
            {editingTransaction ? (
              <><FiCheck className="w-4 h-4" /> Update Transaction</>
            ) : (
              <><FiPlus className="w-4 h-4" /> Add Transaction</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default TransactionForm
