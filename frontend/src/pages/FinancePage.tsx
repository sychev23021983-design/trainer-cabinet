import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import Card from '../components/ui/Card'
import { TrendingUp } from 'lucide-react'

export default function FinancePage() {
  const [stats, setStats] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [period, setPeriod] = useState<'month' | 'year' | 'all'>('month')

  useEffect(() => {
    api.get(`/payments/stats?period=${period}`).then(r => setStats(r.data))
    api.get('/payments').then(r => setPayments(r.data))
  }, [period])

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Финансы</h1>
      <div className="flex gap-2 mb-6">
        {(['month', 'year', 'all'] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === p ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {p === 'month' ? 'Месяц' : p === 'year' ? 'Год' : 'Всё время'}
          </button>
        ))}
      </div>
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Доход', value: `${stats.total.toLocaleString('ru')} ₽` },
            { label: 'Платежей', value: stats.count },
            { label: 'Средний чек', value: `${Math.round(stats.avg).toLocaleString('ru')} ₽` },
          ].map(({ label, value }) => (
            <Card key={label} className="p-4">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{label}</div>
            </Card>
          ))}
        </div>
      )}
      <Card>
        <div className="p-4 border-b border-gray-100 font-medium text-gray-900">История платежей</div>
        {payments.map(p => (
          <div key={p.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
            <div>
              <div className="text-sm font-medium text-gray-900">{p.client?.name}</div>
              <div className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString('ru')}</div>
            </div>
            <span className="text-sm font-semibold text-primary">+{p.amount.toLocaleString('ru')} ₽</span>
          </div>
        ))}
        {payments.length === 0 && <div className="text-center py-8 text-gray-400">Платежей пока нет</div>}
      </Card>
    </div>
  )
}
