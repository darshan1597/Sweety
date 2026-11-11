import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const checkDatabaseConnection = async () => {
  const result = await pool.query('SELECT NOW() AS current_time')
  return result.rows[0]
}

export default pool
