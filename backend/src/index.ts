import express from 'express'
import cors from 'cors'
import path from 'path'
import { authRouter } from './routes/auth'
import { clientsRouter } from './routes/clients'
import { scheduleRouter } from './routes/schedule'
import { sessionsRouter } from './routes/sessions'
import { paymentsRouter } from './routes/payments'
import { measurementsRouter } from './routes/measurements'
import { templatesRouter } from './routes/templates'
import { dashboardRouter } from './routes/dashboard'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '10mb' }))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/api/auth', authRouter)
app.use('/api/clients', clientsRouter)
app.use('/api/schedule', scheduleRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/measurements', measurementsRouter)
app.use('/api/templates', templatesRouter)
app.use('/api/dashboard', dashboardRouter)

app.get('/api/health', (_, res) => res.json({ ok: true, version: '1.0.0' }))

app.listen(PORT, () => console.log(`Backend running on :${PORT}`))
