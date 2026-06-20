import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, Calendar, TrendingDown } from 'lucide-react'
import { api } from '../utils/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export default function ClientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState<any>(null)
  const [tab, setTab] = useState<'profile' | 'sessions' | 'payments'>('profile')

  useEffect(() => { api.get(`/clients/${id}`).then(r => setClient(r.data)) }, [id])

  if (!client) return <div className="p-6 text-gray-400">Загрузка...</div>

  const sub = client.subscriptions?.[0]
  const left = sub ? sub.totalSessions - sub.usedSessions : 0

  return (
    <div className="p-6 max-w-2xl">
      <button onClick={() => navigate('/clients')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm">
        <ArrowLeft size={16} /> Клиенты
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-lg">
          {client.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{client.name}</h1>
          <div className="text-sm text-gray-500 flex items-center gap-3 mt-0.5">
            {client.phone && <span className="flex items-center gap-1"><Phone size={12} />{client.phone}</span>}
            {client.goal && <span>{client.goal}</span>}
          </div>
        </div>
      </div>

      {sub && (
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Абонемент</span>
            <span className={`text-sm font-medium ${left <= 2 ? 'text-red-500' : 'text-primary'}`}>осталось {left} занятий</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(sub.usedSessions / sub.totalSessions) * 100}%` }} />
          </div>
          <div className="text-xs text-gray-400 mt-1">{sub.usedSessions} из {sub.totalSessions} занятий использовано</div>
        </Card>
      )}

      <div className="flex gap-2 mb-4">
        {(['profile', 'sessions', 'payments'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t === 'profile' ? 'Профиль' : t === 'sessions' ? 'Тренировки' : 'Оплаты'}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <Card className="p-4 space-y-3">
          {[
            { label: 'Цель', value: client.goal },
            { label: 'Здоровье', value: client.healthNotes },
            { label: 'Email', value: client.email },
            { label: 'Телефон', value: client.phone },
          ].filter(f => f.value).map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{label}</span>
              <span className="text-sm text-gray-900 font-medium">{value}</span>
            </div>
          ))}
        </Card>
      )}

      {tab === 'sessions' && (
        <div className="space-y-3">
          {client.sessions?.length === 0 && <div className="text-center py-8 text-gray-400">Тренировок пока нет</div>}
          {client.sessions?.map((s: any) => (
            <Card key={s.id} className="p-4">
              <div className="text-xs text-gray-400 mb-1">{format(new Date(s.completedAt), 'dd MMMM, HH:mm', { locale: ru })}</div>
              {s.notes && <div className="text-sm text-gray-700 mb-2">{s.notes}</div>}
              {s.exercises?.length > 0 && (
                <div className="text-xs text-gray-500 space-y-0.5">
                  {s.exercises.map((ex: any) => (
                    <div key={ex.id}>{ex.name}{ex.sets && ` · ${ex.sets}×${ex.reps}`}{ex.weight && ` · ${ex.weight} кг`}</div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {tab === 'payments' && (
        <div className="space-y-2">
          {client.payments?.map((p: any) => (
            <Card key={p.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">{p.amount.toLocaleString('ru')} ₽</div>
                <div className="text-xs text-gray-400">{format(new Date(p.date), 'dd MMMM yyyy', { locale: ru })}</div>
              </div>
              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Оплачено</span>
            </Card>
          ))}
          {client.payments?.length === 0 && <div className="text-center py-8 text-gray-400">Платежей пока нет</div>}
        </div>
      )}
    </div>
  )
}
