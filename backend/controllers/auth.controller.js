import bcrypt from 'bcryptjs'
import { createUser, findUserByEmail } from '../models/user.model.js'
import {AUTH_COOKIE_NAME, createAuthToken, getAuthCookieOptions, getClearCookieOptions,} from '../utils/token.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const normalizeRegistration = (body = {}) => ({
  name: typeof body.name === 'string' ? body.name.trim() : '',
  email: typeof body.email === 'string' ? body.email.trim().toLowerCase() : '',
  password: typeof body.password === 'string' ? body.password : '',
})

const validateRegistration = ({ name, email, password }) => {
  const errors = {}

  if (!name) errors.name = 'Name is required.'
  else if (name.length > 100) errors.name = 'Name must be 100 characters or fewer.'

  if (!email) errors.email = 'Email is required.'
  else if (!emailPattern.test(email)) errors.email = 'Please enter a valid email address.'
  else if (email.length > 255) errors.email = 'Email must be 255 characters or fewer.'

  if (!password) errors.password = 'Password is required.'
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters.'
  else if (password.length > 72) errors.password = 'Password must be 72 characters or fewer.'

  return errors
}

const setAuthCookie = (response, userId) => {
  const token = createAuthToken(userId)
  response.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions())
}

export const register = async (request, response, next) => {
  try {
    const input = normalizeRegistration(request.body)
    const errors = validateRegistration(input)

    if (Object.keys(errors).length > 0) {
      response.status(400).json({ message: 'Please correct the highlighted fields.', errors })
      return
    }

    const existingUser = await findUserByEmail(input.email)
    if (existingUser) {
      response.status(409).json({
        message: 'An account with this email already exists.',
        errors: { email: 'An account with this email already exists.' },
      })
      return
    }

    const passwordHash = await bcrypt.hash(input.password, 12)
    const user = await createUser({
      name: input.name,
      email: input.email,
      passwordHash,
    })

    setAuthCookie(response, user.id)
    response.status(201).json({ message: 'Account created successfully.', user })
  } catch (error) {
    if (error.code === '23505') {
      response.status(409).json({
        message: 'An account with this email already exists.',
        errors: { email: 'An account with this email already exists.' },
      })
      return
    }

    next(error)
  }
}

export const login = async (request, response, next) => {
  try {
    const email = typeof request.body?.email === 'string'
      ? request.body.email.trim().toLowerCase()
      : ''
    const password = typeof request.body?.password === 'string' ? request.body.password : ''
    const errors = {}

    if (!email) errors.email = 'Email is required.'
    else if (!emailPattern.test(email)) errors.email = 'Please enter a valid email address.'
    if (!password) errors.password = 'Password is required.'

    if (Object.keys(errors).length > 0) {
      response.status(400).json({ message: 'Please correct the highlighted fields.', errors })
      return
    }

    const user = await findUserByEmail(email)
    const passwordMatches = user
      ? await bcrypt.compare(password, user.password_hash)
      : false

    if (!user || !passwordMatches) {
      response.status(401).json({ message: 'Invalid email or password. Please try again.' })
      return
    }

    setAuthCookie(response, user.id)
    const { password_hash: _passwordHash, ...publicUser } = user
    response.status(200).json({ message: 'Logged in successfully.', user: publicUser })
  } catch (error) {
    next(error)
  }
}

export const logout = (_request, response) => {
  response.clearCookie(AUTH_COOKIE_NAME, getClearCookieOptions())
  response.status(200).json({ message: 'Logged out successfully.' })
}

export const getCurrentUser = (request, response) => {
  response.status(200).json({ user: request.user })
}
