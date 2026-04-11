import { useAppContext } from '../../context/AppContext'
import { formatCurrency } from '../../utils/helpers'
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi'

function SummaryCards() {
  const { income, expense, balance, transactions } = useAppContext()

  const cards = [
    {
      id: 'income-card',
      title: 'Total Income',
      amount: income,
      icon: <FiTrendingUp className="w-6 h-6" />,
      gradient: 'from-emerald-500 to-teal-600',
      shadowColor: 'shadow-emerald-500/25',
      bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10',
    },
    {
      id: 'expense-card',
      title: 'Total Expenses',
      amount: expense,
      icon: <FiTrendingDown className="w-6 h-6" />,
      gradient: 'from-rose-500 to-pink-600',
      shadowColor: 'shadow-rose-500/25',
      bgLight: 'bg-rose-50 dark:bg-rose-900/20',
      textColor: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-500/10',
    },
    {
      id: 'balance-card',
      title: 'Net Balance',
      amount: balance,
      icon: <FiDollarSign className="w-6 h-6" />,
      gradient: balance >= 0 ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-600',
      shadowColor: balance >= 0 ? 'shadow-blue-500/25' : 'shadow-orange-500/25',
      bgLight: balance >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20',
      textColor: balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400',
      iconBg: balance >= 0 ? 'bg-blue-500/10' : 'bg-orange-500/10',
    },
  ]

  return (
    <div className="flex flex-col gap-6 w-full">
      {cards.map((card, index) => (
        <div
          key={card.id}
          id={card.id}
          className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 cursor-default
            bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50
            hover:shadow-xl ${card.shadowColor}`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* gradient bar on top */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`} />

          <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {card.title}
              </p>
              <p className={`text-2xl sm:text-3xl font-bold mt-2 ${card.textColor} transition-colors`}>
                {formatCurrency(card.amount)}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {card.id === 'balance-card'
                  ? `From ${transactions.length} transactions`
                  : `${transactions.filter(t => t.type === card.id.split('-')[0]).length} transactions`
                }
              </p>
            </div>

            <div className={`p-3 rounded-xl ${card.iconBg} ${card.textColor}`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards
