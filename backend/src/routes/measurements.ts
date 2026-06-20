import { Router } from 'express'
import { prisma } from '../lib'
import { authMiddleware, AuthRequest } from '../middleware/auth'

export const measurementsRouter = Router()
measurementsRouter.use(authMiddleware)

measurementsRouter.post('/', async (req: AuthRequest, res) => {
  const m = await prisma.measurement.create({ data: req.body })
  res.json(m)
})

measurementsRouter.get('/client/:clientId', async (req: AuthRequest, res) => {
  const items = await prisma.measurement.findMany({
    where: { clientId: req.params.clientId },
    orderBy: { date: 'asc' }
  })
  res.json(items)
})
