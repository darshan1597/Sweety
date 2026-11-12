import { Router } from 'express'
import { getReport } from '../controllers/report.controller.js'
import isAuth from '../middlewares/isAuth.js'

const reportRouter = Router()
reportRouter.get('/', isAuth, getReport)
export default reportRouter
