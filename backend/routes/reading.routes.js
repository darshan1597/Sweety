import { Router } from 'express'
import { createReading, deleteReading, getReadings, updateReading } from '../controllers/reading.controller.js'
import isAuth from '../middlewares/isAuth.js'

const readingRouter = Router()
readingRouter.use(isAuth)
readingRouter.route('/').get(getReadings).post(createReading)
readingRouter.route('/:id').put(updateReading).delete(deleteReading)

export default readingRouter
