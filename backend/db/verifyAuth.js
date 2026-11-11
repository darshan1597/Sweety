import 'dotenv/config'
import app from '../app.js'
import pool from '../config/db.js'

const testEmail = `auth-check-${Date.now()}@sweety.invalid`
const testPassword = 'TemporaryPassword123!'

const request = async (baseUrl, path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const body = await response.json()
  return { response, body }
}

const verifyAuth = async () => {
  const server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  const { port } = server.address()
  const baseUrl = `http://127.0.0.1:${port}`

  try {
    const unauthorized = await request(baseUrl, '/api/auth/me')
    if (unauthorized.response.status !== 401) throw new Error('Protected route did not return 401.')

    const registration = await request(baseUrl, '/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Temporary Auth Check',
        email: testEmail,
        password: testPassword,
      }),
    })
    if (registration.response.status !== 201) throw new Error(registration.body.message)

    const cookie = registration.response.headers.get('set-cookie')?.split(';')[0]
    if (!cookie) throw new Error('Registration did not set an authentication cookie.')
    if ('password_hash' in registration.body.user) throw new Error('Registration exposed the password hash.')

    const storedUser = await pool.query(
      'SELECT password_hash FROM users WHERE email = $1',
      [testEmail],
    )
    if (!storedUser.rows[0]?.password_hash.startsWith('$2')) {
      throw new Error('Password was not stored as a bcrypt hash.')
    }

    const currentUser = await request(baseUrl, '/api/auth/me', {
      headers: { Cookie: cookie },
    })
    if (currentUser.response.status !== 200 || currentUser.body.user.email !== testEmail) {
      throw new Error('Authenticated current-user lookup failed.')
    }

    const invalidLogin = await request(baseUrl, '/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: testEmail, password: 'incorrect-password' }),
    })
    if (invalidLogin.response.status !== 401) throw new Error('Invalid login was not rejected.')

    const validLogin = await request(baseUrl, '/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    })
    if (validLogin.response.status !== 200) throw new Error('Valid login failed.')

    const duplicateRegistration = await request(baseUrl, '/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Duplicate Auth Check',
        email: testEmail.toUpperCase(),
        password: testPassword,
      }),
    })
    if (duplicateRegistration.response.status !== 409) {
      throw new Error('Case-insensitive duplicate email was not rejected.')
    }

    console.log('Authentication verification passed.')
  } finally {
    await pool.query('DELETE FROM users WHERE email = $1', [testEmail])
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()))
    })
    await pool.end()
  }
}

verifyAuth().catch((error) => {
  console.error('Authentication verification failed:', error.message)
  process.exit(1)
})
