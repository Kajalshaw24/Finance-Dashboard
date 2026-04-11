import { useAppContext } from '../../context/AppContext'
import { generateInsights } from '../../utils/helpers'

function InsightsPanel() {
  const { transactions } = useAppContext()

  const insights = generateInsights(transactions)

  if (insights.length === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        🧠 Smart Insights
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            id={`insight-${index}`}
            className="group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5
              bg-gray-50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50
              hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${insight.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{insight.icon}</span>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider leading-tight">
                  {insight.title}
                </p>
              </div>

              <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                {insight.value}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {insight.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InsightsPanel
