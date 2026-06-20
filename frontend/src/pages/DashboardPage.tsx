import { useEffect, useState } from 'react'
import { Users, Calendar, TrendingUp, Clock } from 'lucide-react'
import { api } from '../utils/api'
import Card from '../components/ui/Card'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface Stats { totalClients: number; activeClients: number; todaySessions: number; monthIncome: number; upcomingSessions: any[] }

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => { api.get('/dashboard').then(r => setStats(r.data)) }, [])

  const cards = stats ? [
    { label: 'Всего клиентов', value: stats.totalClients, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Активных', value: stats.activeClients, icon: Users, color: 'text-primary', bg: 'bg-primary-light' },
    { label: 'Тренировок сегодня', value: stats.todaySessions, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Доход за месяц', value: `${stats.monthIncome.toLocaleString('ru')} ₽`, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
  ] : []

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Главная</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="p-5">
            <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <div className="text-2xl font-semibold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </Card>
        ))}
      </div>
      {stats?.upcomingSessions?.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-gray-400" />
            <h2 className="font-medium text-gray-900">Ближайшие тренировки</h2>
          </div>
          <div className="space-y-3">
            {stats.upcomingSessions.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-gray-900">{s.title || 'Тренировка'}</div>
                  <div className="text-xs text-gray-500">{format(new Date(s.startTime), 'dd MMM, HH:mm', { locale: ru })}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
