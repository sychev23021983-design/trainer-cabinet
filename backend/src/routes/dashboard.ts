import { Router } from 'express'
import { prisma } from '../lib'
import { authMiddleware, AuthRequest } from '../middleware/auth'

export const dashboardRouter = Router()
dashboardRouter.use(authMiddleware)

dashboardRouter.get('/', async (req: AuthRequest, res) => {
  const trainerId = req.trainerId!
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(todayStart.getTime() + 86400000)

  const [totalClients, activeClients, todaySessions, monthPayments, upcomingSessions, debtClients] = await Promise.all([
    prisma.client.count({ where: { trainerId } }),
    prisma.client.count({ where: { trainerId, status: 'active' } }),
    prisma.schedule.count({ where: { trainerId, startTime: { gte: todayStart, lt: todayEnd }, status: 'scheduled' } }),
    prisma.payment.aggregate({ where: { client: { trainerId }, date: { gte: monthStart }, status: 'paid' }, _sum: { amount: true } }),
    prisma.schedule.findMany({ where: { trainerId, startTime: { gte: now }, status: 'scheduled' }, orderBy: { startTime: 'asc' }, take: 5 }),
    prisma.subscription.findMany({ where: { client: { trainerId }, status: 'active', usedSessions: { gte: prisma.subscription.fields.totalSessions } }, include: { client: { select: { name: true } } }, take: 5 })
  ])

  res.json({ totalClients, activeClients, todaySessions, monthIncome: monthPayments._sum.amount || 0, upcomingSessions })
})
