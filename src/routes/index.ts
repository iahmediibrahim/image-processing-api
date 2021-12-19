import express from 'express'
import imagesRouter from './api/images'

const routes = express.Router()

routes.use('/images', imagesRouter)

export default routes
