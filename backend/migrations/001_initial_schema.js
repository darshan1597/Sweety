export const name = '001_initial_schema'

export const up = async (client) => {
  await client.query(`
    CREATE TABLE users (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT users_name_not_blank CHECK (LENGTH(TRIM(name)) > 0),
      CONSTRAINT users_email_not_blank CHECK (LENGTH(TRIM(email)) > 0)
    )
  `)

  await client.query(`
    CREATE UNIQUE INDEX users_email_unique_lower_idx
    ON users (LOWER(email))
  `)

  await client.query(`
    CREATE TABLE readings (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      reading_date DATE NOT NULL,
      slot VARCHAR(30) NOT NULL,
      value SMALLINT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT readings_slot_valid CHECK (
        slot IN (
          'morning_fasting',
          'after_breakfast',
          'after_lunch',
          'after_dinner'
        )
      ),
      CONSTRAINT readings_value_range CHECK (value BETWEEN 40 AND 600),
      CONSTRAINT readings_user_date_slot_unique UNIQUE (user_id, reading_date, slot)
    )
  `)

  await client.query(`
    CREATE INDEX readings_user_date_idx
    ON readings (user_id, reading_date DESC)
  `)
}

export const down = async (client) => {
  await client.query('DROP TABLE IF EXISTS readings')
  await client.query('DROP TABLE IF EXISTS users')
}
