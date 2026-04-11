import { useAppContext } from '../../context/AppContext'
import { groupByCategory, groupByMonth, formatCurrency } from '../../utils/helpers'
import { CATEGORY_COLORS } from '../../data/mockData'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const data = payload[0]
  return (
    <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{data.name}</p>
      <p className="text-sm font-semibold" style={{ color: data.payload.fill }}>
        {formatCurrency(data.value)}
      </p>
    </div>
  )
}

function Charts() {
  const { transactions, theme } = useAppContext()

  const expenses = transactions.filter((t) => t.type === 'expense')
  const categoryData = groupByCategory(expenses)
  const monthlyData = groupByMonth(transactions)

  const axisColor = theme === 'dark' ? '#6b7280' : '#9ca3af'
  const gridColor = theme === 'dark' ? '#374151' : '#f3f4f6'

  if (transactions.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

      {/* pie chart - spending by category */}
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700
        hover:shadow-lg transition-shadow duration-300" id="chart-pie">
        <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200 mb-4">
          📊 Spending by Category
        </h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={3}
                strokeWidth={0}
              >
                {categoryData.map((entry) => (
                  <Cell
                    key={entry.category}
                    fill={CATEGORY_COLORS[entry.category] || '#94a3b8'}
                  />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">No expense data</p>
        )}
      </div>

      {/* bar chart - monthly overview */}
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700
        hover:shadow-lg transition-shadow duration-300" id="chart-bar">
        <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200 mb-4">
          📅 Monthly Overview
        </h3>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: axisColor }}
                axisLine={{ stroke: gridColor }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: axisColor }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#f43f5e"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">No monthly data</p>
        )}
      </div>

      {/* area chart - trend */}
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700
        hover:shadow-lg transition-shadow duration-300 lg:col-span-2" id="chart-area">
        <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200 mb-4">
          📈 Income vs Expense Trend
        </h3>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="gradientIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradientExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: axisColor }}
                axisLine={{ stroke: gridColor }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: axisColor }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
                iconSize={8}
              />
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#gradientIncome)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#f43f5e"
                strokeWidth={2.5}
                fill="url(#gradientExpense)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">No trend data</p>
        )}
      </div>
    </div>
  )
}

export default Charts
