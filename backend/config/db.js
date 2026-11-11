import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

const connectionString = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL

const pool = new Pool({
  connectionString,
})

export const checkDatabaseConnection = async () => {
  const result = await pool.query('SELECT NOW() AS current_time')
  return result.rows[0]
}

export default pool
