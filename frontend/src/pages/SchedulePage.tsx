import { useEffect, useState } from 'react'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '../utils/api'
import Card from '../components/ui/Card'

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [sessions, setSessions] = useState<any[]>([])

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  useEffect(() => {
    const from = weekStart.toISOString()
    const to = addDays(weekStart, 7).toISOString()
    api.get(`/schedule?from=${from}&to=${to}`).then(r => setSessions(r.data))
  }, [currentWeek])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Расписание</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentWeek(d => addDays(d, -7))} className="p-2 rounded-lg hover:bg-gray-100"><ChevronLeft size={18} /></button>
          <span className="text-sm text-gray-600 min-w-[120px] text-center">
            {format(days[0], 'd MMM', { locale: ru })} — {format(days[6], 'd MMM', { locale: ru })}
          </span>
          <button onClick={() => setCurrentWeek(d => addDays(d, 7))} className="p-2 rounded-lg hover:bg-gray-100"><ChevronRight size={18} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map(day => {
          const daySessions = sessions.filter(s => isSameDay(new Date(s.startTime), day))
          const isToday = isSameDay(day, new Date())
          return (
            <div key={day.toISOString()}>
              <div className={`text-center mb-2 py-2 rounded-lg text-xs font-medium ${isToday ? 'bg-primary text-white' : 'text-gray-500'}`}>
                <div>{format(day, 'EEE', { locale: ru })}</div>
                <div className="text-base font-semibold">{format(day, 'd')}</div>
              </div>
              <div className="space-y-1 min-h-[120px]">
                {daySessions.map(s => (
                  <div key={s.id} className="bg-primary-light border border-primary/20 rounded-lg p-2">
                    <div className="text-xs font-medium text-primary">{format(new Date(s.startTime), 'HH:mm')}</div>
                    <div className="text-xs text-primary-dark mt-0.5 truncate">{s.title || 'Тренировка'}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
