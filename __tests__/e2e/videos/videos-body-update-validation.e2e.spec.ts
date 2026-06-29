import express from 'express'
import { setApp } from '../../../src/setup-app'
import { Resolutions } from '../../../src/videos/types/video'
import request from 'supertest';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { UpdateVideoInputModel } from '../../../src/videos/dto/updateVideo.input';
import { CreateVideoInputModel } from '../../../src/videos/dto/createVideo.input';

describe('Video API body validation check', () => {
    const app = express()
    setApp(app)

      const testVideoDataInput: CreateVideoInputModel = {
        title: 'Test title',
        author: 'Test Author',
        availableResolutions: [Resolutions.P720, Resolutions.P1080]
    }
    

    const correctVideoInputData: UpdateVideoInputModel = {
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

    it ('should not update video with incorrect body past', async () => {
        const newVideo = await request(app)
                    .post('/videos')
                    .send({...testVideoDataInput, title: 'Another Video'})
                    .expect(HttpStatus.Created)
        
        const invalidDataSet1 = await request(app)
            .put(`/videos/${newVideo.body.id}`)
            .send({
            ...correctVideoInputData,
            title: 12, // Not string
            author: 'Too long Too long Too long Too long', // too long string
            availableResolutions: [12]
            })
            .expect(HttpStatus.BadRequest)

        expect(invalidDataSet1.body.errorsMessages).toHaveLength(3)

        const invalidDataSet2 = await request(app)
            .put(`/videos/${newVideo.body.id}`)
            .send({
                ...correctVideoInputData,
                availableResolutions: [...(Object.values(Resolutions)), Resolutions.P1080]
            })
            .expect (HttpStatus.BadRequest)

        expect(invalidDataSet2.body.errorsMessages).toHaveLength(1)

        const invalidDataSet3 = await request(app)
            .put(`/videos/${newVideo.body.id}`)
            .send({
                ...correctVideoInputData,
                author: 12,
                availableResolutions: {P144: Resolutions.P144}
            })
            .expect (HttpStatus.BadRequest)

        expect(invalidDataSet3.body.errorsMessages).toHaveLength(2) 
    })
})