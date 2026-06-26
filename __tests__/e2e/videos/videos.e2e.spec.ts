import request from 'supertest';
import express from 'express';
import { setApp } from '../../../src/setup-app';
import { CreateVideoInputModel } from '../../../src/videos/dto/createVideo.input';
import { Resolutions, Video } from '../../../src/videos/types/video';
import { HttpStatus } from '../../../src/core/types/http-statuses';


describe ('Videos API', () => {
  const app = express();
  setApp(app)

  const testVideoDataInput: CreateVideoInputModel = {
    title: 'Test title',
    author: 'Test Author',
    availableResolutions: [Resolutions.P720, Resolutions.P1080]
  }

  beforeAll(async () => {
    await request(app).delete('/testing/all-data').expect(HttpStatus.NoContent)
  })

  it('It should create vieos; POST /videos', async () => {

    const res = await request(app)
        .post('/videos')
        .send(testVideoDataInput)
        .expect(HttpStatus.Created)

    expect (res.body).toEqual({
      id: expect.any(Number),
      title: testVideoDataInput.title,
      author: testVideoDataInput.author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
      availableResolutions: testVideoDataInput.availableResolutions
    })
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
})