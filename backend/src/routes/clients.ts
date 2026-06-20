import { Router } from 'express'
import { prisma } from '../lib'
import { authMiddleware, AuthRequest } from '../middleware/auth'

export const clientsRouter = Router()
clientsRouter.use(authMiddleware)

clientsRouter.get('/', async (req: AuthRequest, res) => {
  const clients = await prisma.client.findMany({
    where: { trainerId: req.trainerId! },
    include: {
      subscriptions: { where: { status: 'active' }, orderBy: { createdAt: 'desc' }, take: 1 },
      payments: { orderBy: { date: 'desc' }, take: 1 }
    },
    orderBy: { name: 'asc' }
  })
  res.json(clients)
})

clientsRouter.post('/', async (req: AuthRequest, res) => {
  try {
    const client = await prisma.client.create({ data: { ...req.body, trainerId: req.trainerId! } })
    res.json(client)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

clientsRouter.get('/:id', async (req: AuthRequest, res) => {
  const client = await prisma.client.findFirst({
    where: { id: req.params.id, trainerId: req.trainerId! },
    include: {
      subscriptions: { orderBy: { createdAt: 'desc' } },
      sessions: { include: { exercises: true }, orderBy: { completedAt: 'desc' }, take: 10 },
      measurements: { orderBy: { date: 'desc' } },
      progressPhotos: { orderBy: { date: 'desc' } },
      payments: { orderBy: { date: 'desc' } }
    }
  })
  if (!client) return res.status(404).json({ error: 'Not found' })
  res.json(client)
})

clientsRouter.put('/:id', async (req: AuthRequest, res) => {
  try {
    const client = await prisma.client.updateMany({
      where: { id: req.params.id, trainerId: req.trainerId! },
      data: req.body
    })
    res.json(client)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

clientsRouter.delete('/:id', async (req: AuthRequest, res) => {
  await prisma.client.updateMany({ where: { id: req.params.id, trainerId: req.trainerId! }, data: { status: 'archived' } })
  res.json({ ok: true })
})
