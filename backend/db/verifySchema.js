import 'dotenv/config'
import pool from '../config/db.js'

const expectConstraintFailure = async (client, query, values, expectedConstraint) => {
  await client.query('SAVEPOINT constraint_check')
  try {
    await client.query(query, values)
    throw new Error(`Expected ${expectedConstraint} to reject the query.`)
  } catch (error) {
    if (error.constraint !== expectedConstraint) throw error
  } finally {
    await client.query('ROLLBACK TO SAVEPOINT constraint_check')
  }
}

const verifySchema = async () => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id`,
      ['Schema Test User', 'schema-test@sweety.invalid', 'not-a-real-password-hash'],
    )
    const userId = userResult.rows[0].id

    await client.query(
      `INSERT INTO readings (user_id, reading_date, slot, value)
       VALUES ($1, CURRENT_DATE, 'morning_fasting', 110)`,
      [userId],
    )

    await expectConstraintFailure(
      client,
      `INSERT INTO readings (user_id, reading_date, slot, value)
       VALUES ($1, CURRENT_DATE, 'morning_fasting', 120)`,
      [userId],
      'readings_user_date_slot_unique',
    )

    await expectConstraintFailure(
      client,
      `INSERT INTO readings (user_id, reading_date, slot, value)
       VALUES ($1, CURRENT_DATE, 'after_breakfast', 39)`,
      [userId],
      'readings_value_range',
    )

    await expectConstraintFailure(
      client,
      `INSERT INTO readings (user_id, reading_date, slot, value)
       VALUES ($1, CURRENT_DATE, 'invalid_slot', 110)`,
      [userId],
      'readings_slot_valid',
    )

    await client.query('ROLLBACK')
    console.log('Schema verification passed. Temporary verification data was rolled back.')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

verifySchema().catch((error) => {
  console.error('Schema verification failed:', error.message)
  process.exit(1)
})
