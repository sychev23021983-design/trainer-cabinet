import { useEffect, useState } from 'react'
import { Plus, Dumbbell } from 'lucide-react'
import { api } from '../utils/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([])

  useEffect(() => { api.get('/templates').then(r => setTemplates(r.data)) }, [])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Тренировки</h1>
        <Button size="sm"><Plus size={16} /> Создать шаблон</Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {templates.map(t => (
          <Card key={t.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                <Dumbbell size={18} className="text-primary" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">{t.name}</div>
                {t.goal && <div className="text-xs text-gray-500 mt-0.5">{t.goal}</div>}
                <div className="text-xs text-gray-400 mt-1">{t.exercises?.length || 0} упражнений</div>
              </div>
            </div>
          </Card>
        ))}
        {templates.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-400">
            Создайте первый шаблон тренировки
          </div>
        )}
      </div>
    </div>
  )
}
