import pool from '../config/db.js'

export const getReportData = async ({ userId, startDate, endDate }, client = pool) => {
  const [summaryResult, readingsResult] = await Promise.all([
    client.query(
      `SELECT MAX(value)::INTEGER AS highest, MIN(value)::INTEGER AS lowest,
              ROUND(AVG(value)::NUMERIC, 1) AS average, COUNT(*)::INTEGER AS count
       FROM readings WHERE user_id = $1 AND reading_date BETWEEN $2 AND $3`,
      [userId, startDate, endDate],
    ),
    client.query(
      `SELECT id, user_id, reading_date, slot, value, created_at, updated_at
       FROM readings WHERE user_id = $1 AND reading_date BETWEEN $2 AND $3
       ORDER BY reading_date DESC,
         CASE slot WHEN 'morning_fasting' THEN 1 WHEN 'after_breakfast' THEN 2 WHEN 'after_lunch' THEN 3 ELSE 4 END`,
      [userId, startDate, endDate],
    ),
  ])
  const raw = summaryResult.rows[0]
  return {
    summary: { highest: raw.highest, lowest: raw.lowest, average: raw.average === null ? null : Number(raw.average), count: raw.count },
    readings: readingsResult.rows,
  }
}
