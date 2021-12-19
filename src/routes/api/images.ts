import express, { NextFunction, Request, Response } from 'express'
import { query, ValidationError, validationResult } from 'express-validator'
import { promises as fsPromises } from 'fs'
import path from 'path'
import sharp from 'sharp'
import ApiError from '../../middleware/ApiError'
// constants
const images: string[] = ['fjord', 'encenadaport', 'palmtunnel', 'santamonica', 'icelandwaterfall']
const imagePath: string = path.resolve(__dirname, '../../images')
const imageThumbnailPath: string = path.resolve(__dirname, '../../images/thumbnails')

// images Router
const imagesRouter = express.Router()

// using the default way of validating result from express validator and handle errors
const validateQueryParams = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response<string> => {
  // format error message
  const errorFormatter = ({ msg, param }: ValidationError) => `[${param}]: ${msg}`
  const errors = validationResult(req).formatWith(errorFormatter)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'error',
      errors: errors.array({ onlyFirstError: true })
    })
  }
  return next()
}

// returns a boolean in which the file path exists or not
const fileExists = async (filePath: string): Promise<boolean> =>
  !!(await fsPromises.stat(filePath).catch(() => false))

imagesRouter.get(
  '/',
  [
    query('width')
      .exists()
      .withMessage('Image height must have a value.')
      .toInt()
      .isInt({ max: 1000 })
      .withMessage('The max width should be 1000.'),
    query('height')
      .exists()
      .withMessage('Image height must have a value.')
      .toInt()
      .isInt({ max: 1000 })
      .withMessage('The max height should be 1000.'),
    query('filename')
      .exists()
      .withMessage('filename must have a value.')
      .isIn(images)
      .withMessage('Image does not exist, please write a correct image name!')
  ],
  validateQueryParams,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { width, height, filename } = req.query
    const thumbnailImage = `${imageThumbnailPath}/${filename}-${width}-${height}.jpg`
    const imageToRender = `${filename}-${width}-${height}.jpg`
    // check if the thumbnails directory exist ( if not fs will create it )
    await fsPromises.mkdir(imageThumbnailPath, { recursive: true })

    // check if the image thumbnail already exists using the fs
    const isFileExist = await fileExists(thumbnailImage)

    if (isFileExist) {
      // Thumbnail image is there ( no need to create it )

      console.log('image already exist')
      res.render('index', { title: 'Image Already exists', image: imageToRender })
    } else {
      // Thumbnail image isn't there ( we have to create it )
      // resize image using sharp

      sharp(`${imagePath}/${filename}.jpg`)
        .resize(Number(parseInt(width as string, 10)), Number(parseInt(height as string, 10)))
        .toFile(thumbnailImage)
        .then(() =>
          res.render('index', { title: 'Hoooooray! a new image created.', image: imageToRender })
        )
        .catch((err) => next(ApiError.badRequest(err.message)))
    }
  }
)

export default imagesRouter
