import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'trainer_secret'
export interface AuthRequest extends Request { trainerId?: string }

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, SECRET) as { trainerId: string }
    req.trainerId = payload.trainerId
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
