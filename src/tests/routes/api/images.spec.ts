import supertest from 'supertest'
import path from 'path'
import fs from 'fs'
import app from '../../..'

const request = supertest(app)

describe('Test /api/images endpoint response', () => {
  it('Should return an Unprocessable Entity status of 422 ( user has to add width, height , filename )', async () => {
    const response = await request.get('/api/images')
    expect(response.status).toBe(422)
  })
  it('Should return an Unprocessable Entity status of 422 ( user has to add a correct width or height or filename )', async () => {
    const response = await request.get('/api/images/?width=600&height=500&filename')
    expect(response.status).toBe(422)
  })
  it('Should return an ok status of 200 ( image resized successfully )', async () => {
    const response = await request.get('/api/images/?width=600&height=500&filename=fjord')
    expect(response.status).toBe(200)
  })
  it('Images already resized should exist', () => {
    expect(fs.existsSync(`${path.resolve(__dirname, '../../../images/thumbnails')}/fjord-600-500.jpg`)).toBeTruthy()
  })
  it('Images with same name but new width and height should not exist', () => {
    expect(fs.existsSync(`${path.resolve(__dirname, '../../../images/thumbnails')}/fjord-300-200.jpg`)).toBeFalsy()
  })
})