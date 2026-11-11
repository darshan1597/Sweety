import { Router } from 'express'
import {
  getCurrentUser,
  login,
  logout,
  register,
} from '../controllers/auth.controller.js'
import isAuth from '../middlewares/isAuth.js'

const authRouter = Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.get('/me', isAuth, getCurrentUser)

export default authRouter
