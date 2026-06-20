import { useState } from 'react'
import { X } from 'lucide-react'
import { api } from '../../utils/api'
import Input from '../ui/Input'
import Button from '../ui/Button'
import toast from 'react-hot-toast'

interface Props { onClose: () => void; onAdded: (client: any) => void }

export default function AddClientModal({ onClose, onAdded }: Props) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', goal: '', healthNotes: '' })
  const [loading, setLoading] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Введите имя клиента')
    setLoading(true)
    try {
      const { data } = await api.post('/clients', form)
      toast.success('Клиент добавлен')
      onAdded(data)
      onClose()
    } catch { toast.error('Ошибка при добавлении') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Новый клиент</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Имя *" value={form.name} onChange={set('name')} placeholder="Анна Иванова" required />
          <Input label="Телефон" value={form.phone} onChange={set('phone')} placeholder="+7 900 000-00-00" type="tel" />
          <Input label="Email" value={form.email} onChange={set('email')} placeholder="client@email.com" type="email" />
          <Input label="Цель" value={form.goal} onChange={set('goal')} placeholder="Похудение, набор массы..." />
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Здоровье / ограничения</label>
            <textarea
              value={form.healthNotes} onChange={set('healthNotes')}
              placeholder="Травмы, противопоказания..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1 justify-center" onClick={onClose}>Отмена</Button>
            <Button type="submit" className="flex-1 justify-center" disabled={loading}>
              {loading ? 'Сохраняем...' : 'Добавить'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
