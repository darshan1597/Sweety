import pool from '../config/db.js'

const publicUserColumns = 'id, name, email, created_at, updated_at'

export const createUser = async ({ name, email, passwordHash }, client = pool) => {
  const result = await client.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING ${publicUserColumns}`,
    [name, email, passwordHash],
  )

  return result.rows[0]
}

export const findUserByEmail = async (email, client = pool) => {
  const result = await client.query(
    `SELECT id, name, email, password_hash, created_at, updated_at
     FROM users
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [email],
  )

  return result.rows[0] || null
}

export const findUserById = async (id, client = pool) => {
  const result = await client.query(
    `SELECT ${publicUserColumns}
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [id],
  )

  return result.rows[0] || null
}
