/**
 * Utility Functions for FinanceFlow Dashboard
 * Provides formatting, data transformation, and export/import utilities
 */

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getMonthName(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', { month: 'short' })
}

export function getMonthYear(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

export function groupByCategory(transactions) {
  const map = {}
  transactions.forEach((t) => {
    if (!map[t.category]) map[t.category] = 0
    map[t.category] += t.amount
  })
  return Object.entries(map)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}

export function groupByMonth(transactions) {
  const map = {}
  transactions.forEach((t) => {
    const key = getMonthYear(t.date)
    if (!map[key]) map[key] = { month: key, income: 0, expense: 0 }
    if (t.type === 'income') map[key].income += t.amount
    else map[key].expense += t.amount
  })
  // sort by date
  return Object.values(map).sort(
    (a, b) => new Date('01 ' + a.month) - new Date('01 ' + b.month)
  )
}

// generates the insight cards
export function generateInsights(transactions) {
  if (transactions.length === 0) return []
  // console.log('generating insights for', transactions.length, 'transactions')

  const insights = []
  const expenses = transactions.filter((t) => t.type === 'expense')
  const incomes = transactions.filter((t) => t.type === 'income')

  // top spending category
  if (expenses.length > 0) {
    const categoryTotals = groupByCategory(expenses)
    const top = categoryTotals[0]
    insights.push({
      icon: '🔥',
      title: 'Top Spending Category',
      value: top.category,
      description: `You spent ${formatCurrency(top.total)} on ${top.category}`,
      color: 'from-orange-500 to-red-500',
    })
  }

  // monthly comparison
  const monthlyData = groupByMonth(transactions)
  if (monthlyData.length >= 2) {
    const current = monthlyData[monthlyData.length - 1]
    const previous = monthlyData[monthlyData.length - 2]
    const diff = current.expense - previous.expense
    const pct = previous.expense > 0 ? ((diff / previous.expense) * 100).toFixed(1) : 0
    insights.push({
      icon: diff > 0 ? '📈' : '📉',
      title: 'Monthly Spending Trend',
      value: `${diff > 0 ? '+' : ''}${pct}%`,
      description: `Spending ${diff > 0 ? 'increased' : 'decreased'} from ${formatCurrency(previous.expense)} to ${formatCurrency(current.expense)}`,
      color: diff > 0 ? 'from-red-500 to-pink-500' : 'from-green-500 to-emerald-500',
    })
  }

  // average expense
  const avgExpense = expenses.length > 0
    ? Math.round(expenses.reduce((s, t) => s + t.amount, 0) / expenses.length)
    : 0
  insights.push({
    icon: '📊',
    title: 'Avg Expense Per Transaction',
    value: formatCurrency(avgExpense),
    description: `Across ${expenses.length} expense transactions`,
    color: 'from-blue-500 to-cyan-500',
  })

  // savings rate
  const totalIncome = incomes.reduce((s, t) => s + t.amount, 0)
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0)
  const savingsRate = totalIncome > 0
    ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)
    : 0
  insights.push({
    icon: '💎',
    title: 'Savings Rate',
    value: `${savingsRate}%`,
    description: `You saved ${formatCurrency(totalIncome - totalExpense)} out of ${formatCurrency(totalIncome)} earned`,
    color: 'from-violet-500 to-purple-500',
  })

  // biggest transaction
  const largest = [...transactions].sort((a, b) => b.amount - a.amount)[0]
  if (largest) {
    insights.push({
      icon: '💸',
      title: 'Largest Transaction',
      value: formatCurrency(largest.amount),
      description: `"${largest.text}" (${largest.type})`,
      color: 'from-amber-500 to-yellow-500',
    })
  }

  return insights
}

// export to csv file
export function exportToCSV(transactions) {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount']
  const rows = transactions.map((t) =>
    [t.date, `"${t.text}"`, `"${t.category}"`, t.type, t.amount].join(',')
  )
  const csv = [headers.join(','), ...rows].join('\n')
  downloadFile(csv, 'transactions.csv', 'text/csv')
}

export function exportToJSON(transactions) {
  const json = JSON.stringify(transactions, null, 2)
  downloadFile(json, 'transactions.json', 'application/json')
}

export function parseTransactionsJSON(text) {
  const parsed = JSON.parse(text)
  if (!Array.isArray(parsed)) throw new Error('JSON must be an array')
  return parsed
}

export function parseTransactionsCSV(text) {
  const lines = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 0) return []

  const header = splitCSVLine(lines[0]).map((h) => h.trim().toLowerCase())
  const idx = {
    date: header.indexOf('date'),
    text: header.indexOf('description'),
    category: header.indexOf('category'),
    type: header.indexOf('type'),
    amount: header.indexOf('amount'),
  }

  // make sure all required columns exist
  const required = ['date', 'text', 'category', 'type', 'amount']
  for (const k of required) {
    if (idx[k] === -1) throw new Error(`Missing CSV column: ${k === 'text' ? 'Description' : k}`)
  }

  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i])
    rows.push({
      date: cols[idx.date] ?? '',
      text: cols[idx.text] ?? '',
      category: cols[idx.category] ?? '',
      type: cols[idx.type] ?? '',
      amount: cols[idx.amount] ?? '',
    })
  }
  return rows
}

export function normalizeImportedTransactions(raw, { allowUnknownCategories = true } = {}) {
  if (!Array.isArray(raw)) throw new Error('Invalid data')

  const normalized = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue

    const text = String(item.text ?? item.description ?? '').trim()
    const category = String(item.category ?? '').trim()
    const type = String(item.type ?? '').trim().toLowerCase()
    const date = String(item.date ?? '').trim()
    const amountNum = typeof item.amount === 'number'
      ? item.amount
      : Number(String(item.amount ?? '').replace(/[,\s]/g, ''))

    // skip invalid rows
    if (!text) continue
    if (!date || Number.isNaN(new Date(date).getTime())) continue
    if (type !== 'income' && type !== 'expense') continue
    if (!Number.isFinite(amountNum) || amountNum <= 0) continue
    if (!category && !allowUnknownCategories) continue

    normalized.push({
      text,
      category: category || 'Other',
      type,
      amount: Math.round(amountNum),
      date: date.slice(0, 10),
    })
  }

  return normalized
}

// triggers a file download in the browser
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// handles quoted fields in CSV
function splitCSVLine(line) {
  const out = []
  let cur = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      out.push(cur)
      cur = ''
    } else {
      cur += ch
    }
  }
  out.push(cur)
  return out.map((s) => s.trim())
}
