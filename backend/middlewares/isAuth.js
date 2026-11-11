import { findUserById } from '../models/user.model.js'
import { AUTH_COOKIE_NAME, verifyAuthToken } from '../utils/token.js'

const getRequestToken = (request) => {
  if (request.cookies?.[AUTH_COOKIE_NAME]) {
    return request.cookies[AUTH_COOKIE_NAME]
  }

  const authorization = request.get('authorization')
  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice(7)
  }

  return null
}

const isAuth = async (request, response, next) => {
  const token = getRequestToken(request)

  if (!token) {
    response.status(401).json({ message: 'Please log in to continue.' })
    return
  }

  try {
    const payload = verifyAuthToken(token)
    const user = await findUserById(payload.userId)

    if (!user) {
      response.status(401).json({ message: 'Your session is no longer valid.' })
      return
    }

    request.user = user
    next()
  } catch {
    response.status(401).json({ message: 'Your session has expired. Please log in again.' })
  }
}

export default isAuth
