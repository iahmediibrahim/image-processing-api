import path from 'path'
import sharp from 'sharp'

const imagePath: string = path.resolve(__dirname, '../images')
const imageThumbnailPath: string = path.resolve(__dirname, '../images/thumbnails')

const resizeImage = async (width: number, height: number, filename: string): Promise<void> => {
  const fullImagePath = `${imagePath}/${filename}.jpg`
  const thumbnailImage = `${imageThumbnailPath}/${filename}-${width}-${height}.jpg`
  try {
    await sharp(fullImagePath).resize(Number(width), Number(height)).toFile(thumbnailImage)
  } catch (error) {
    throw new Error('Error occurred while processing image')
  }
}

export default resizeImage
