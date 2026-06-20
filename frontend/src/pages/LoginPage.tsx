import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch { toast.error('Неверный email или пароль') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-2xl font-semibold text-primary mb-1">Тренер</div>
          <p className="text-gray-500 text-sm">Войдите в свой кабинет</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input label="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full justify-center" disabled={loading}>
            {loading ? 'Входим...' : 'Войти'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Нет аккаунта? <Link to="/register" className="text-primary hover:underline">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}
