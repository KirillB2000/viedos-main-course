import request from 'supertest';
import express from 'express';
import { setApp } from '../../../src/setup-app';
import { CreateVideoInputModel } from '../../../src/videos/dto/createVideo.input';
import { Resolutions, Video } from '../../../src/videos/types/video';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { UpdateVideoInputModel } from '../../../src/videos/dto/updateVideo.input';


describe ('Videos API', () => {
  const app = express();
  setApp(app)

  const testVideoDataInput: CreateVideoInputModel = {
    title: 'Test title',
    author: 'Test Author',
    availableResolutions: [Resolutions.P720, Resolutions.P1080]
  }

   const updateVideoInputData: UpdateVideoInputModel = {
    title: 'Test update title',
    author: 'Test update author',
    canBeDownloaded: true,
    minAgeRestriction: null,
    publicationDate: '2025-10-10T22:08:43.847Z',
    availableResolutions: [Resolutions.P720, Resolutions.P240]
  }

  beforeAll(async () => {
    await request(app).delete('/testing/all-data').expect(HttpStatus.NoContent)
  })

  it('It should create vieos; POST /videos', async () => {

    const res = await request(app)
        .post('/videos')
        .send(testVideoDataInput)
        .expect(HttpStatus.Created)

    const testVideoResponse: Video = {
      id: expect.any(Number),
      title: testVideoDataInput.title,
      author: testVideoDataInput.author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
      availableResolutions: testVideoDataInput.availableResolutions
    }

    expect (res.body).toEqual(testVideoResponse)
  })

  it ("should return videos list; GET /videos", async () => {

    await request(app)
      .post('/videos')
      .send({...testVideoDataInput, title: 'Test title 2'})
      .expect(HttpStatus.Created)
    await request(app)
      .post('/videos')
      .send({...testVideoDataInput, title: 'Test title 3'})
      .expect(HttpStatus.Created)
    
    const videosListResponse = await request(app)
          .get('/videos')
          .expect(HttpStatus.Ok)

    expect(videosListResponse.body).toBeInstanceOf(Array)
    expect(videosListResponse.body.length).toBeGreaterThanOrEqual(2)
  })

  it ("should return video by id; GET /videos/:id", async () => {

    const createResponse = await request(app)
      .post('/videos')
      .send({...testVideoDataInput, title: 'Another Video'})
      .expect(HttpStatus.Created)
    
    const getResponse = await request(app)
      .get(`/videos/${createResponse.body.id}`)
      .expect(HttpStatus.Ok)

    expect(getResponse.body).toEqual(createResponse.body)
  })

  it ("should update video by id; UPDATE /videos/:id", async () => {
    const createResponse = await request(app)
      .post('/videos')
      .send({...testVideoDataInput, title: 'Another Video'})
      .expect(HttpStatus.Created)

    await request(app)
      .put(`/videos/${createResponse.body.id}`)
      .send(updateVideoInputData)
      .expect(HttpStatus.NoContent)

    const getResponse = await request(app)
      .get(`/videos/${createResponse.body.id}`)
      .expect(HttpStatus.Ok)

    expect(getResponse.body.title).toBe(updateVideoInputData.title)
    expect(getResponse.body.author).toBe(updateVideoInputData.author)
    expect(getResponse.body.canBeDownloaded).toBe(updateVideoInputData.canBeDownloaded)
    expect(getResponse.body.minAgeRestriction).toBe(updateVideoInputData.minAgeRestriction)
    expect(getResponse.body.publicationDate).toBe(updateVideoInputData.publicationDate)
    expect((getResponse.body.availableResolutions.join())).toBe(updateVideoInputData.availableResolutions.join())
  })

  it ("should delete video by id; DELETE /videos/:id", async () => {
    const createResponse = await request(app)
      .post('/videos')
      .send({...testVideoDataInput, title: 'Another Video'})
      .expect(HttpStatus.Created)

    await request(app)
      .delete(`/videos/${createResponse.body.id}`)
      .expect(HttpStatus.NoContent)

    await request(app)
      .get(`/videos/${createResponse.body.id}`)
      .expect(HttpStatus.NotFound)
  })
})