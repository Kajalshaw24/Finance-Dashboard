import { useAppContext } from '../../context/AppContext'
import { FiSun, FiMoon, FiShield, FiEye, FiDollarSign } from 'react-icons/fi'

function Header() {
  const { role, setRole, theme, toggleTheme } = useAppContext()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <FiDollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                FinanceFlow
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                Personal Finance Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">

            <div className="relative">
              <select
                id="role-switcher"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="appearance-none pl-8 sm:pl-10 pr-6 sm:pr-8 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border
                  bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200
                  hover:border-emerald-400 dark:hover:border-emerald-400"
              >
                <option value="admin">🛡️ Admin</option>
                <option value="viewer">👁️ Viewer</option>
              </select>
              <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {role === 'admin' ? (
                  <FiShield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                ) : (
                  <FiEye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                )}
              </div>
            </div>

            <span className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300
              ${role === 'admin'
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/20'
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-1 ring-blue-500/20'
              }`}
            >
              {role === 'admin' ? '✏️ Can Edit' : '👀 View Only'}
            </span>

            {/* theme toggle */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110
                bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300
                hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-lg"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FiSun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <FiMoon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
