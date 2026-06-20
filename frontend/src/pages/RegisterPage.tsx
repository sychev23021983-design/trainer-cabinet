import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      navigate('/')
      toast.success('Добро пожаловать!')
    } catch { toast.error('Ошибка регистрации') }
    finally { setLoading(false) }
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({...f, [k]: e.target.value}))

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-2xl font-semibold text-primary mb-1">Тренер</div>
          <p className="text-gray-500 text-sm">Создайте свой кабинет</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Ваше имя" value={form.name} onChange={set('name')} required />
          <Input label="Email" type="email" value={form.email} onChange={set('email')} required />
          <Input label="Телефон" type="tel" value={form.phone} onChange={set('phone')} />
          <Input label="Пароль" type="password" value={form.password} onChange={set('password')} required minLength={6} />
          <Button type="submit" className="w-full justify-center" disabled={loading}>
            {loading ? 'Создаём...' : 'Создать кабинет'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Уже есть аккаунт? <Link to="/login" className="text-primary hover:underline">Войти</Link>
        </p>
      </div>
    </div>
  )
}
