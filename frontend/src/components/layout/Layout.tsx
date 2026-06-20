import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Users, Calendar, BarChart2, Dumbbell, LayoutDashboard, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/auth'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Главная', exact: true },
  { to: '/clients', icon: Users, label: 'Клиенты' },
  { to: '/schedule', icon: Calendar, label: 'Расписание' },
  { to: '/templates', icon: Dumbbell, label: 'Тренировки' },
  { to: '/finance', icon: BarChart2, label: 'Финансы' },
]

export default function Layout() {
  const { trainer, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <div className="text-primary font-semibold text-lg">Тренер</div>
          <div className="text-gray-500 text-sm mt-0.5">{trainer?.name}</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ to, icon: Icon, label, exact }) => (
            <NavLink key={to} to={to} end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-primary-light text-primary-dark font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors">
            <LogOut size={18} /> Выйти
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
