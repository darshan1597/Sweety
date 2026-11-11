import jwt from 'jsonwebtoken'

export const AUTH_COOKIE_NAME = 'sweety_token'

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.')
  }

  return process.env.JWT_SECRET
}

export const createAuthToken = (userId) => jwt.sign(
  { userId: String(userId) },
  getJwtSecret(),
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
)

export const verifyAuthToken = (token) => jwt.verify(token, getJwtSecret())

export const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
})

export const getClearCookieOptions = () => {
  const { maxAge: _maxAge, ...options } = getAuthCookieOptions()
  return options
}
