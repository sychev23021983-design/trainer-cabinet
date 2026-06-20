import { Router } from 'express'
import { prisma } from '../lib'
import { authMiddleware, AuthRequest } from '../middleware/auth'

export const scheduleRouter = Router()
scheduleRouter.use(authMiddleware)

scheduleRouter.get('/', async (req: AuthRequest, res) => {
  const { from, to } = req.query
  const where: any = { trainerId: req.trainerId! }
  if (from) where.startTime = { gte: new Date(from as string) }
  if (to) where.startTime = { ...where.startTime, lte: new Date(to as string) }
  const items = await prisma.schedule.findMany({
    where, include: { session: true },
    orderBy: { startTime: 'asc' }
  })
  res.json(items)
})

scheduleRouter.post('/', async (req: AuthRequest, res) => {
  try {
    const item = await prisma.schedule.create({ data: { ...req.body, trainerId: req.trainerId! } })
    res.json(item)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

scheduleRouter.put('/:id', async (req: AuthRequest, res) => {
  await prisma.schedule.updateMany({ where: { id: req.params.id, trainerId: req.trainerId! }, data: req.body })
  res.json({ ok: true })
})

scheduleRouter.delete('/:id', async (req: AuthRequest, res) => {
  await prisma.schedule.updateMany({ where: { id: req.params.id, trainerId: req.trainerId! }, data: { status: 'cancelled' } })
  res.json({ ok: true })
})
