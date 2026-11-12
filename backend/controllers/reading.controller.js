import {
  countReadingsForDate,
  createReading as insertReading,
  deleteReading as removeReading,
  findReadingById,
  findReadingBySlot,
  findReadingsByUser,
  updateReading as saveReading,
} from '../models/reading.model.js'

export const slots = ['morning_fasting', 'after_breakfast', 'after_lunch', 'after_dinner']
const slotLabels = { morning_fasting: 'Morning (fasting)', after_breakfast: 'After breakfast', after_lunch: 'After lunch', after_dinner: 'After dinner' }
const datePattern = /^\d{4}-\d{2}-\d{2}$/
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date())
const isValidDate = (value) => {
  if (!datePattern.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}
const isValidId = (value) => /^\d+$/.test(String(value)) && BigInt(value) > 0n

export const normalizeReading = (body = {}) => ({
  readingDate: typeof (body.readingDate ?? body.date) === 'string' ? (body.readingDate ?? body.date).trim() : '',
  slot: typeof body.slot === 'string' ? body.slot.trim() : '',
  value: body.value,
})

export const validateReading = ({ readingDate, slot, value }, currentDate = today()) => {
  const errors = {}
  if (value === '' || value === null || value === undefined) errors.value = 'Please enter a glucose value.'
  else if (!Number.isInteger(Number(value)) || Number(value) < 40 || Number(value) > 600) errors.value = 'Value must be between 40 and 600 mg/dl.'
  if (!readingDate || !isValidDate(readingDate)) errors.readingDate = 'Please select a valid date.'
  else if (readingDate > currentDate) errors.readingDate = 'Date cannot be in the future.'
  if (!slots.includes(slot)) errors.slot = 'Please select a valid time slot.'
  return errors
}

const validateConflicts = async ({ userId, readingDate, slot, excludedId }) => {
  const duplicate = await findReadingBySlot(userId, readingDate, slot, excludedId)
  if (duplicate) return { status: 409, message: `You already have an ${slotLabels[slot]} reading for this date.` }
  const count = await countReadingsForDate(userId, readingDate, excludedId)
  if (count >= 4) return { status: 409, message: 'You can add only 4 readings per day.' }
  return null
}

export const createReading = async (request, response, next) => {
  try {
    const input = normalizeReading(request.body)
    const errors = validateReading(input)
    if (Object.keys(errors).length) { response.status(400).json({ message: 'Please correct the highlighted fields.', errors }); return }
    const conflict = await validateConflicts({ userId: request.user.id, ...input })
    if (conflict) { response.status(conflict.status).json({ message: conflict.message }); return }
    const reading = await insertReading({ userId: request.user.id, ...input, value: Number(input.value) })
    response.status(201).json({ message: 'Reading added successfully.', reading })
  } catch (error) {
    if (error.code === '23505') { response.status(409).json({ message: `You already have an ${slotLabels[request.body?.slot] || ''} reading for this date.` }); return }
    next(error)
  }
}

export const getReadings = async (request, response, next) => {
  try {
    const readingDate = typeof request.query.date === 'string' ? request.query.date.trim() : ''
    if (readingDate && !isValidDate(readingDate)) { response.status(400).json({ message: 'Please select a valid date.' }); return }
    const readings = await findReadingsByUser({ userId: request.user.id, readingDate: readingDate || undefined })
    response.status(200).json({ readings })
  } catch (error) { next(error) }
}

export const updateReading = async (request, response, next) => {
  try {
    if (!isValidId(request.params.id)) { response.status(400).json({ message: 'Invalid reading ID.' }); return }
    const existing = await findReadingById(request.params.id, request.user.id)
    if (!existing) { response.status(404).json({ message: 'Reading not found.' }); return }
    const input = normalizeReading(request.body)
    const errors = validateReading(input)
    if (Object.keys(errors).length) { response.status(400).json({ message: 'Please correct the highlighted fields.', errors }); return }
    const conflict = await validateConflicts({ userId: request.user.id, ...input, excludedId: existing.id })
    if (conflict) { response.status(conflict.status).json({ message: conflict.message }); return }
    const reading = await saveReading({ id: existing.id, userId: request.user.id, ...input, value: Number(input.value) })
    response.status(200).json({ message: 'Reading updated successfully.', reading })
  } catch (error) {
    if (error.code === '23505') { response.status(409).json({ message: `You already have an ${slotLabels[request.body?.slot] || ''} reading for this date.` }); return }
    next(error)
  }
}

export const deleteReading = async (request, response, next) => {
  try {
    if (!isValidId(request.params.id)) { response.status(400).json({ message: 'Invalid reading ID.' }); return }
    const reading = await removeReading(request.params.id, request.user.id)
    if (!reading) { response.status(404).json({ message: 'Reading not found.' }); return }
    response.status(200).json({ message: 'Reading deleted successfully.', reading })
  } catch (error) { next(error) }
}
