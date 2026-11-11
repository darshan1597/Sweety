import { Router } from 'express'
import { checkDatabaseConnection } from '../config/db.js'

const healthRouter = Router()

healthRouter.get('/', async (_request, response) => {
  try {
    await checkDatabaseConnection()
    response.status(200).json({ status: 'ok', database: 'connected' })
  } catch {
    response.status(503).json({ status: 'error', database: 'disconnected' })
  }
})

export default healthRouter
