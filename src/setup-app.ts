import express, { Express, Request, Response } from "express";
import { HttpStatus } from "./core/types/http-statuses";
import { db, getDateISOByDays } from "./db/in-memory.db";
import { Video } from "./videos/types/video";
import { CreateVideoInputModel } from "./videos/dto/createVideo.input";
import { createErrorMessages } from "./core/utils/error.utils";
import { APIErrorResult } from "./core/types/validationError";
import { createVideoInputDtoValidation, updateVideoInputDtoValidation } from "./videos/validation/videoInputDtoValidation";
import { UpdateVideoInputModel } from "./videos/dto/updateVideo.input";
import e from "express";

export const setApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    app.get("/", (req: Request, res: Response) => {
        res.status(200).send("Hello world!");
    });

    app.get('/videos', (req: Request, res: Response<Video[]>) => {
        res.status(HttpStatus.Ok).send(db.videos)
    })

    app.get('/videos/:id', 
        (
            req: Request<{id: string}>, 
            res: Response<Video>
        ) => {
            const videoById = db.videos.find(v => v.id === +req.params.id)
            
            if (!videoById) {
                res.sendStatus(404)
                return;
            }

            res.status(200).json(videoById) 
    })

    app.post(
        '/videos', 
        (
            req: Request<{}, {}, CreateVideoInputModel>, 
            res: Response<APIErrorResult | Video>
        ) => {
            const errors = createVideoInputDtoValidation(req.body)
            if (errors.length > 0) {
                res.status(HttpStatus.BadRequest).send(createErrorMessages(errors))
                return;
            }
            const newVideo: Video = {
                id: db.videos.length ? db.videos[db.videos.length - 1].id + 1 : 1,
                title: req.body.title,
                author: req.body.author,
                canBeDownloaded: false,
                minAgeRestriction: null,
                createdAt: getDateISOByDays(),
                publicationDate: getDateISOByDays(1),
                availableResolutions: req.body.availableResolutions
            }

            db.videos.push(newVideo);

            res.status(HttpStatus.Created).json(newVideo)
    })

    app.put('/videos/:id', 
        (
            req: Request<{id: string}, {}, UpdateVideoInputModel>, 
            res: Response
        ) => {

        const errors = updateVideoInputDtoValidation(req.body)

        if (errors.length > 0) {
            res.status(HttpStatus.BadRequest).send(createErrorMessages(errors))
            return;
        }

        let videoById = db.videos.find(v => v.id === Number(req.params.id))

        if (!videoById) {
            res.sendStatus(HttpStatus.NotFound)
            return;
        }

        videoById.title = req.body.title;
        videoById.author = req.body.author;
        videoById.canBeDownloaded = req.body.canBeDownloaded;
        videoById.minAgeRestriction = req.body.minAgeRestriction;
        videoById.publicationDate = req.body.publicationDate;
        videoById.availableResolutions = req.body.availableResolutions;

        res.sendStatus(HttpStatus.NoContent)
    })

    app.delete('/videos/:id', 
        (
            req: Request<{id: string}>, 
            res: Response
        ) => {
            const videoById = db.videos.find(v => v.id === Number(req.params.id))

            if(!videoById) {
                res.sendStatus(HttpStatus.NotFound)
                return;
            }

            db.videos = db.videos.filter(v => v.id !== Number(req.params.id))

            res.sendStatus(HttpStatus.NoContent)
    })

    app.get('/testing', (req: Request, res: Response) => {
        res.status(200).send('testing url')
    })

    app.delete('/testing/all-data', (req: Request, res: Response) => {
        db.videos = [];
        res.sendStatus(HttpStatus.NoContent);
    })

    return app;
};