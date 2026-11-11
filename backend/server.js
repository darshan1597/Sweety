import 'dotenv/config'
import app from './app.js'
import { checkDatabaseConnection } from './config/db.js'

const port = process.env.PORT || 5000

const startServer = async () => {
  try {
    await checkDatabaseConnection()
    console.log('PostgreSQL connected')
  } catch (error) {
    console.error('PostgreSQL connection failed:', error.message)
  }

  app.listen(port, () => {
    console.log(`Sweety API running on port ${port}`)
  })
}

startServer().catch((error) => {
  console.error('Server startup failed:', error)
  process.exit(1)
})
