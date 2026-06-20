import { Router } from 'express'
import { prisma } from '../lib'
import { authMiddleware, AuthRequest } from '../middleware/auth'

export const paymentsRouter = Router()
paymentsRouter.use(authMiddleware)

paymentsRouter.get('/', async (req: AuthRequest, res) => {
  const { from, to } = req.query
  const where: any = { client: { trainerId: req.trainerId! } }
  if (from) where.date = { gte: new Date(from as string) }
  if (to) where.date = { ...where.date, lte: new Date(to as string) }
  const payments = await prisma.payment.findMany({ where, include: { client: { select: { name: true } } }, orderBy: { date: 'desc' } })
  res.json(payments)
})

paymentsRouter.post('/', async (req: AuthRequest, res) => {
  const payment = await prisma.payment.create({ data: req.body })
  res.json(payment)
})

paymentsRouter.get('/stats', async (req: AuthRequest, res) => {
  const { period } = req.query
  const now = new Date()
  let from = new Date(now.getFullYear(), now.getMonth(), 1)
  if (period === 'year') from = new Date(now.getFullYear(), 0, 1)
  if (period === 'all') from = new Date(0)

  const payments = await prisma.payment.findMany({
    where: { client: { trainerId: req.trainerId! }, date: { gte: from }, status: 'paid' }
  })
  const total = payments.reduce((s, p) => s + p.amount, 0)
  const count = payments.length
  res.json({ total, count, avg: count ? total / count : 0 })
})
