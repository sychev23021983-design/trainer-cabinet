import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib'

export const authRouter = Router()
const SECRET = process.env.JWT_SECRET || 'trainer_secret'

authRouter.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body
    const exists = await prisma.trainer.findUnique({ where: { email } })
    if (exists) return res.status(400).json({ error: 'Email already registered' })
    const hash = await bcrypt.hash(password, 10)
    const trainer = await prisma.trainer.create({ data: { email, password: hash, name, phone } })
    const token = jwt.sign({ trainerId: trainer.id }, SECRET, { expiresIn: '30d' })
    res.json({ token, trainer: { id: trainer.id, name: trainer.name, email: trainer.email } })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const trainer = await prisma.trainer.findUnique({ where: { email } })
    if (!trainer) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, trainer.password)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ trainerId: trainer.id }, SECRET, { expiresIn: '30d' })
    res.json({ token, trainer: { id: trainer.id, name: trainer.name, email: trainer.email } })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

authRouter.get('/me', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, SECRET) as { trainerId: string }
    const trainer = await prisma.trainer.findUnique({ where: { id: payload.trainerId }, select: { id: true, name: true, email: true, phone: true, avatar: true } })
    res.json(trainer)
  } catch { res.status(401).json({ error: 'Invalid token' }) }
})
