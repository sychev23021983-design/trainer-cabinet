import { Router } from 'express'
import { prisma } from '../lib'
import { authMiddleware, AuthRequest } from '../middleware/auth'

export const sessionsRouter = Router()
sessionsRouter.use(authMiddleware)

sessionsRouter.post('/', async (req: AuthRequest, res) => {
  try {
    const { scheduleId, clientId, duration, notes, mood, exercises } = req.body
    const session = await prisma.session.create({
      data: {
        scheduleId, clientId, duration, notes, mood,
        exercises: { create: exercises || [] }
      },
      include: { exercises: true }
    })
    await prisma.schedule.update({ where: { id: scheduleId }, data: { status: 'completed' } })
    await prisma.subscription.updateMany({
      where: { clientId, status: 'active' },
      data: { usedSessions: { increment: 1 } }
    })
    res.json(session)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

sessionsRouter.get('/client/:clientId', async (req: AuthRequest, res) => {
  const sessions = await prisma.session.findMany({
    where: { clientId: req.params.clientId },
    include: { exercises: true },
    orderBy: { completedAt: 'desc' }
  })
  res.json(sessions)
})
