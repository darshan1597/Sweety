import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import authRouter from './routes/auth.routes.js'
import healthRouter from './routes/health.routes.js'
import readingRouter from './routes/reading.routes.js'
import reportRouter from './routes/report.routes.js'

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/readings', readingRouter)
app.use('/api/reports', reportRouter)

app.use((_request, response) => {
  response.status(404).json({ message: 'API endpoint not found.' })
})

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(error.status || 500).json({
    message: error.message || 'Something went wrong.',
  })
})

export default app
