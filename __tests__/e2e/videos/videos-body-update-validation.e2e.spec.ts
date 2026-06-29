import express from 'express'
import { setApp } from '../../../src/setup-app'
import { Resolutions } from '../../../src/videos/types/video'
import request from 'supertest';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { UpdateVideoInputModel } from '../../../src/videos/dto/updateVideo.input';

describe('Video API body validation cheсk', () => {
    const app = express()
    setApp(app)

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

    // Copy from create validation test and refactor
})