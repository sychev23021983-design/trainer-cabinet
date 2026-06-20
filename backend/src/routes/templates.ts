import { Router } from 'express'
import { prisma } from '../lib'
import { authMiddleware, AuthRequest } from '../middleware/auth'

export const templatesRouter = Router()
templatesRouter.use(authMiddleware)

templatesRouter.get('/', async (req: AuthRequest, res) => {
  const templates = await prisma.workoutTemplate.findMany({
    where: { trainerId: req.trainerId! },
    include: { exercises: { orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' }
  })
  res.json(templates)
})

templatesRouter.post('/', async (req: AuthRequest, res) => {
  const { exercises, ...data } = req.body
  const template = await prisma.workoutTemplate.create({
    data: { ...data, trainerId: req.trainerId!, exercises: { create: exercises || [] } },
    include: { exercises: true }
  })
  res.json(template)
})

templatesRouter.delete('/:id', async (req: AuthRequest, res) => {
  await prisma.workoutTemplate.deleteMany({ where: { id: req.params.id, trainerId: req.trainerId! } })
  res.json({ ok: true })
})
