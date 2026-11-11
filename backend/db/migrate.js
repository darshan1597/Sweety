import 'dotenv/config'
import pool from '../config/db.js'
import * as initialSchema from '../migrations/001_initial_schema.js'

const migrations = [initialSchema]
const command = process.argv[2] || 'up'

const ensureMigrationsTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

const getAppliedMigrations = async (client) => {
  const result = await client.query('SELECT name FROM schema_migrations ORDER BY applied_at, name')
  return result.rows.map((row) => row.name)
}

const migrateUp = async (client) => {
  const applied = new Set(await getAppliedMigrations(client))
  const pending = migrations.filter((migration) => !applied.has(migration.name))

  if (pending.length === 0) {
    console.log('Database is already up to date.')
    return
  }

  for (const migration of pending) {
    await client.query('BEGIN')
    try {
      await migration.up(client)
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [migration.name])
      await client.query('COMMIT')
      console.log(`Applied migration: ${migration.name}`)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    }
  }
}

const migrateDown = async (client) => {
  const applied = await getAppliedMigrations(client)
  const latestName = applied.at(-1)

  if (!latestName) {
    console.log('No migration is available to roll back.')
    return
  }

  const migration = migrations.find((item) => item.name === latestName)
  if (!migration) {
    throw new Error(`Migration file not found for ${latestName}.`)
  }

  await client.query('BEGIN')
  try {
    await migration.down(client)
    await client.query('DELETE FROM schema_migrations WHERE name = $1', [migration.name])
    await client.query('COMMIT')
    console.log(`Rolled back migration: ${migration.name}`)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  }
}

const showStatus = async (client) => {
  const applied = new Set(await getAppliedMigrations(client))
  for (const migration of migrations) {
    console.log(`${applied.has(migration.name) ? 'applied' : 'pending'}  ${migration.name}`)
  }
}

const run = async () => {
  if (!['up', 'down', 'status'].includes(command)) {
    throw new Error('Use one of: up, down, status.')
  }

  const client = await pool.connect()
  try {
    await ensureMigrationsTable(client)
    if (command === 'up') await migrateUp(client)
    if (command === 'down') await migrateDown(client)
    if (command === 'status') await showStatus(client)
  } finally {
    client.release()
    await pool.end()
  }
}

run().catch((error) => {
  console.error('Migration failed:', error.message)
  process.exit(1)
})
