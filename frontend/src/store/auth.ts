import { create } from 'zustand'
import { api } from '../utils/api'

interface Trainer { id: string; name: string; email: string; phone?: string }
interface AuthStore {
  trainer: Trainer | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  loadMe: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  trainer: null,
  token: localStorage.getItem('token'),

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    set({ token: data.token, trainer: data.trainer })
  },

  register: async (formData) => {
    const { data } = await api.post('/auth/register', formData)
    localStorage.setItem('token', data.token)
    set({ token: data.token, trainer: data.trainer })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, trainer: null })
  },

  loadMe: async () => {
    try {
      const { data } = await api.get('/auth/me')
      set({ trainer: data })
    } catch { set({ trainer: null, token: null }) }
  }
}))
