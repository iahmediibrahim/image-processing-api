import { Request, Response, NextFunction } from 'express'
import ApiError from './ApiError'

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500
  const message = err.message || 'Something went wrong'
  res.status(status).json({ status, message })
}

export default errorHandler
