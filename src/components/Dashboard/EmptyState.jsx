import { useAppContext } from '../../context/AppContext'
import { FiInbox } from 'react-icons/fi'

function EmptyState() {
  const { filters, resetFilters, role } = useAppContext()

  const hasActiveFilters = filters.search || filters.category !== 'All' || filters.type !== 'all'

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <FiInbox className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 dark:text-gray-600" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">
        {hasActiveFilters ? 'No matching transactions' : 'No transactions yet'}
      </h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 text-center max-w-sm mb-6">
        {hasActiveFilters
          ? 'Try adjusting your filters or search query to find what you\'re looking for.'
          : role === 'admin'
          ? 'Start tracking your finances by adding your first transaction.'
          : 'Switch to Admin role to add transactions.'}
      </p>

      <div className="flex gap-3">
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
              hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  )
}

export default EmptyState
