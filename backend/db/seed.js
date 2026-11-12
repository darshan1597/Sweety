import "dotenv/config";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";

const demoEmail = process.env.DEMO_USER_EMAIL || "demo@sweety.app";
const demoPassword = process.env.DEMO_USER_PASSWORD || "Demo@123";
const demoName = "Demo Patient";
const slots = [
  "morning_fasting",
  "after_breakfast",
  "after_lunch",
  "after_dinner",
];

const localToday = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(
    new Date(),
  );
const asDate = (value) => new Date(`${value}T00:00:00Z`);
const iso = (date) => date.toISOString().slice(0, 10);
const readingsForDay = (day, monthOffset = 0) => [
  Math.round(94 + Math.sin((day + monthOffset) / 3) * 7),
  Math.round(132 + Math.sin((day + monthOffset) / 4) * 15),
  Math.round(116 + Math.cos((day + monthOffset) / 3) * 10),
  Math.round(127 + Math.cos((day + monthOffset) / 5) * 12),
];

const buildReadings = () => {
  const today = localToday();
  const current = asDate(today);
  const year = current.getUTCFullYear();
  const month = current.getUTCMonth();
  const currentDay = current.getUTCDate();
  const previousMonthEnd = new Date(Date.UTC(year, month, 0));
  const readings = [];

  for (let day = 1; day <= previousMonthEnd.getUTCDate(); day += 1) {
    const readingDate = iso(
      new Date(
        Date.UTC(
          previousMonthEnd.getUTCFullYear(),
          previousMonthEnd.getUTCMonth(),
          day,
        ),
      ),
    );
    readingsForDay(day, 4).forEach((value, index) =>
      readings.push([readingDate, slots[index], value]),
    );
  }

  for (let day = 1; day <= currentDay; day += 1) {
    const readingDate = iso(new Date(Date.UTC(year, month, day)));
    const values = readingsForDay(day);
    const slotCount = day === currentDay ? 3 : 4;
    for (let index = 0; index < slotCount; index += 1)
      readings.push([readingDate, slots[index], values[index]]);
  }

  return readings;
};

const seed = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const passwordHash = await bcrypt.hash(demoPassword, 12);
    const existing = await client.query(
      "SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
      [demoEmail],
    );
    let userId;
    if (existing.rows[0]) {
      userId = existing.rows[0].id;
      await client.query(
        "UPDATE users SET name = $1, password_hash = $2, updated_at = NOW() WHERE id = $3",
        [demoName, passwordHash, userId],
      );
    } else {
      const created = await client.query(
        "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
        [demoName, demoEmail, passwordHash],
      );
      userId = created.rows[0].id;
    }
    await client.query("DELETE FROM readings WHERE user_id = $1", [userId]);
    const readings = buildReadings();
    for (const [readingDate, slot, value] of readings) {
      await client.query(
        "INSERT INTO readings (user_id, reading_date, slot, value) VALUES ($1, $2, $3, $4)",
        [userId, readingDate, slot, value],
      );
    }
    await client.query("COMMIT");
    console.log(`Demo user seeded: ${demoEmail}`);
    console.log(`Demo password: ${demoPassword}`);
    console.log(`Sample readings created: ${readings.length}`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
