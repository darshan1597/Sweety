import { getReportData } from '../models/report.model.js'

const datePattern = /^\d{4}-\d{2}-\d{2}$/
const isValidDate = (value) => {
  if (!datePattern.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}
const currentDate = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date())
const iso = (date) => date.toISOString().slice(0, 10)

export const getReportRange = (type, selectedDate) => {
  if (type === 'daily') return { startDate: selectedDate, endDate: selectedDate }
  if (type === 'month-to-date') return { startDate: `${selectedDate.slice(0, 7)}-01`, endDate: selectedDate }
  const date = new Date(`${selectedDate}T00:00:00Z`)
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - 1, 1))
  const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 0))
  return { startDate: iso(start), endDate: iso(end) }
}

export const validateReportRequest = (type, selectedDate, today = currentDate()) => {
  if (!['daily', 'month-to-date', 'previous-month'].includes(type)) return 'Please select a valid report type.'
  if (!isValidDate(selectedDate)) return 'Please select a valid date.'
  if (selectedDate > today) return 'Date cannot be in the future.'
  return null
}

export const getReport = async (request, response, next) => {
  try {
    const type = typeof request.query.type === 'string' ? request.query.type : 'daily'
    const selectedDate = typeof request.query.date === 'string' ? request.query.date : currentDate()
    const validationError = validateReportRequest(type, selectedDate)
    if (validationError) { response.status(400).json({ message: validationError }); return }
    const range = getReportRange(type, selectedDate)
    const data = await getReportData({ userId: request.user.id, ...range })
    response.status(200).json({ type, selectedDate, range, ...data })
  } catch (error) { next(error) }
}
