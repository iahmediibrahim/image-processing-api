import express, { Application } from 'express'
import morgan from 'morgan'
import * as dotenv from 'dotenv'
import path from 'path'
import routes from './routes'
import errorHandler from './middleware/errorHandler.middleware'

dotenv.config()

const PORT = process.env.PORT || 3000

// create an instance server
const app: Application = express()

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.static('images'))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// create main routes default to use '/api'
app.use('/api', routes)

// HTTP request logger middleware
app.use(morgan('short'))

// Global error handling
app.use(errorHandler)

// start express server
app.listen(PORT, () => {
  console.log(`Server is starting at port:${PORT}`)
})
export default app
