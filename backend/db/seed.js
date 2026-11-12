import 'dotenv/config'
import bcrypt from 'bcryptjs'
import pool from '../config/db.js'

const demoEmail = process.env.DEMO_USER_EMAIL || 'demo@sweety.app'
const demoPassword = process.env.DEMO_USER_PASSWORD || 'Demo@123'
const demoName = 'Demo Patient'
const slots = ['morning_fasting', 'after_breakfast', 'after_lunch', 'after_dinner']

const localToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date())
const asDate = (value) => new Date(`${value}T00:00:00Z`)
const iso = (date) => date.toISOString().slice(0, 10)
const shiftDays = (value, amount) => { const date = asDate(value); date.setUTCDate(date.getUTCDate() + amount); return iso(date) }
const previousMonthDate = (day) => { const date = asDate(localToday()); return iso(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - 1, day))) }

const buildReadings = () => {
  const today = localToday()
  const monthStart = `${today.slice(0, 7)}-01`
  return [
    [today, slots[0], 98], [today, slots[1], 132], [today, slots[2], 118],
    [shiftDays(today, -1), slots[0], 101], [shiftDays(today, -1), slots[1], 126], [shiftDays(today, -1), slots[2], 121], [shiftDays(today, -1), slots[3], 137],
    [shiftDays(today, -3), slots[0], 95], [shiftDays(today, -3), slots[1], 140], [shiftDays(today, -3), slots[3], 129],
    [monthStart, slots[0], 104], [monthStart, slots[1], 148], [monthStart, slots[2], 115], [monthStart, slots[3], 134],
    [previousMonthDate(3), slots[0], 92], [previousMonthDate(3), slots[1], 142], [previousMonthDate(3), slots[2], 119], [previousMonthDate(3), slots[3], 131],
    [previousMonthDate(10), slots[0], 88], [previousMonthDate(10), slots[1], 156], [previousMonthDate(10), slots[2], 124], [previousMonthDate(10), slots[3], 139],
    [previousMonthDate(18), slots[0], 97], [previousMonthDate(18), slots[1], 145], [previousMonthDate(18), slots[2], 116], [previousMonthDate(18), slots[3], 128],
    [previousMonthDate(26), slots[0], 93], [previousMonthDate(26), slots[1], 151], [previousMonthDate(26), slots[2], 120], [previousMonthDate(26), slots[3], 136],
  ]
}

const seed = async () => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const passwordHash = await bcrypt.hash(demoPassword, 12)
    const existing = await client.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1', [demoEmail])
    let userId
    if (existing.rows[0]) {
      userId = existing.rows[0].id
      await client.query('UPDATE users SET name = $1, password_hash = $2, updated_at = NOW() WHERE id = $3', [demoName, passwordHash, userId])
    } else {
      const created = await client.query('INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id', [demoName, demoEmail, passwordHash])
      userId = created.rows[0].id
    }
    await client.query('DELETE FROM readings WHERE user_id = $1', [userId])
    const readings = buildReadings()
    for (const [readingDate, slot, value] of readings) {
      await client.query('INSERT INTO readings (user_id, reading_date, slot, value) VALUES ($1, $2, $3, $4)', [userId, readingDate, slot, value])
    }
    await client.query('COMMIT')
    console.log(`Demo user seeded: ${demoEmail}`)
    console.log(`Demo password: ${demoPassword}`)
    console.log(`Sample readings created: ${readings.length}`)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch((error) => { console.error('Seed failed:', error.message); process.exit(1) })
