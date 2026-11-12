import pool from '../config/db.js'

const columns = 'id, user_id, reading_date, slot, value, created_at, updated_at'

export const createReading = async ({ userId, readingDate, slot, value }, client = pool) => {
  const result = await client.query(
    `INSERT INTO readings (user_id, reading_date, slot, value)
     VALUES ($1, $2, $3, $4)
     RETURNING ${columns}`,
    [userId, readingDate, slot, value],
  )
  return result.rows[0]
}

export const findReadingsByUser = async ({ userId, readingDate }, client = pool) => {
  const values = [userId]
  let dateFilter = ''
  if (readingDate) { values.push(readingDate); dateFilter = 'AND reading_date = $2' }
  const result = await client.query(
    `SELECT ${columns} FROM readings
     WHERE user_id = $1 ${dateFilter}
     ORDER BY reading_date DESC,
       CASE slot WHEN 'morning_fasting' THEN 1 WHEN 'after_breakfast' THEN 2 WHEN 'after_lunch' THEN 3 ELSE 4 END`,
    values,
  )
  return result.rows
}

export const findReadingById = async (id, userId, client = pool) => {
  const result = await client.query(`SELECT ${columns} FROM readings WHERE id = $1 AND user_id = $2 LIMIT 1`, [id, userId])
  return result.rows[0] || null
}

export const countReadingsForDate = async (userId, readingDate, excludedId = null, client = pool) => {
  const result = await client.query(
    `SELECT COUNT(*)::INTEGER AS count FROM readings
     WHERE user_id = $1 AND reading_date = $2 AND ($3::BIGINT IS NULL OR id <> $3)`,
    [userId, readingDate, excludedId],
  )
  return result.rows[0].count
}

export const findReadingBySlot = async (userId, readingDate, slot, excludedId = null, client = pool) => {
  const result = await client.query(
    `SELECT ${columns} FROM readings
     WHERE user_id = $1 AND reading_date = $2 AND slot = $3
       AND ($4::BIGINT IS NULL OR id <> $4) LIMIT 1`,
    [userId, readingDate, slot, excludedId],
  )
  return result.rows[0] || null
}

export const updateReading = async ({ id, userId, readingDate, slot, value }, client = pool) => {
  const result = await client.query(
    `UPDATE readings SET reading_date = $3, slot = $4, value = $5, updated_at = NOW()
     WHERE id = $1 AND user_id = $2 RETURNING ${columns}`,
    [id, userId, readingDate, slot, value],
  )
  return result.rows[0] || null
}

export const deleteReading = async (id, userId, client = pool) => {
  const result = await client.query(`DELETE FROM readings WHERE id = $1 AND user_id = $2 RETURNING ${columns}`, [id, userId])
  return result.rows[0] || null
}
