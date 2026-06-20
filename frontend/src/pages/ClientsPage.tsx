import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Phone } from 'lucide-react'
import { api } from '../utils/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => { api.get('/clients').then(r => setClients(r.data)) }, [])

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  const getSubStatus = (client: any) => {
    const sub = client.subscriptions?.[0]
    if (!sub) return { label: 'Нет абонемента', color: 'red' as const }
    const left = sub.totalSessions - sub.usedSessions
    if (left <= 2) return { label: `Осталось ${left}`, color: 'yellow' as const }
    return { label: `Осталось ${left}`, color: 'green' as const }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Клиенты</h1>
        <Button size="sm"><Plus size={16} /> Добавить</Button>
      </div>
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Поиск клиента..."
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
      <div className="space-y-2">
        {filtered.map(client => {
          const { label, color } = getSubStatus(client)
          return (
            <Link key={client.id} to={`/clients/${client.id}`}>
              <Card className="p-4 hover:border-primary/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-medium text-sm flex-shrink-0">
                    {client.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm">{client.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      {client.goal && <span>{client.goal}</span>}
                      {client.phone && <><span>·</span><Phone size={10} /><span>{client.phone}</span></>}
                    </div>
                  </div>
                  <Badge color={color}>{label}</Badge>
                </div>
              </Card>
            </Link>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            {search ? 'Клиент не найден' : 'Добавьте первого клиента'}
          </div>
        )}
      </div>
    </div>
  )
}
