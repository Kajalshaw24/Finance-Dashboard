import { useAppContext } from '../../context/AppContext'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { CATEGORY_ICONS } from '../../data/mockData'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import EmptyState from './EmptyState'

function TransactionTable({ onEdit }) {
  const { filteredTransactions, role, deleteTransaction } = useAppContext()

  function handleDelete(id, text) {
    if (window.confirm(`Delete "${text}"? This cannot be undone.`)) {
      deleteTransaction(id)
    }
  }

  if (filteredTransactions.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-3">
      {/* desktop table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Transaction
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              {role === 'admin' && (
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {filteredTransactions.map((t) => (
              <tr
                key={t.id}
                className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{CATEGORY_ICONS[t.category] || '📦'}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {t.text}
                      </p>
                      <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
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

                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t.category}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(t.date)}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <span className={`text-sm font-bold
                    ${t.type === 'income'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </td>

                {role === 'admin' && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => onEdit(t)}
                        className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id, t.text)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                        title="Delete"
                      >
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

      {/* mobile cards */}
      <div className="md:hidden space-y-3">
        {filteredTransactions.map((t) => (
          <div
            key={t.id}
            className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700
              hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{CATEGORY_ICONS[t.category] || '📦'}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {t.text}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {t.category} · {formatDate(t.date)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold
                  ${t.type === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
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
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => onEdit(t)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
                    bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400
                    hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <FiEdit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.text)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
                    bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400
                    hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
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

export default TransactionTable
