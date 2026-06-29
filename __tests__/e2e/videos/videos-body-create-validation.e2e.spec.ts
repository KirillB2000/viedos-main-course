import express from 'express'
import { setApp } from '../../../src/setup-app'
import { CreateVideoInputModel } from '../../../src/videos/dto/createVideo.input'
import { Resolutions } from '../../../src/videos/types/video'
import request from 'supertest';
import { HttpStatus } from '../../../src/core/types/http-statuses';

describe('Video API body validation cheсk', () => {
    const app = express()
    setApp(app)

    const correctVideoInputData: CreateVideoInputModel = {
        title: 'Some title',
        author: 'Some author',
        availableResolutions: [Resolutions.P1440]
    }

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(HttpStatus.NoContent)
    })

    it ('should not create video with incorrect body past', async () => {
        const invalidDataSet1 = await request(app)
            .post('/videos')
            .send({
            title: 12, // Not string
            author: 'Too long Too long Too long Too long', // too long string
            availableResolutions: [12]
            })
            .expect(HttpStatus.BadRequest)

        expect(invalidDataSet1.body.errorsMessages).toHaveLength(3)

        const invalidDataSet2 = await request(app)
            .post('/videos')
            .send({
                ...correctVideoInputData,
                availableResolutions: [...(Object.values(Resolutions)), Resolutions.P1080]
            })
            .expect (HttpStatus.BadRequest)

        expect(invalidDataSet2.body.errorsMessages).toHaveLength(1)

        const invalidDataSet3 = await request(app)
            .post('/videos')
            .send({
                author: 12,
                availableResolutions: {P144: Resolutions.P144}
            })
            .expect (HttpStatus.BadRequest)

        expect(invalidDataSet3.body.errorsMessages).toHaveLength(3) 
    })
})