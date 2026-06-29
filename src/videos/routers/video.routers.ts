import { Router } from "express";
import { Video } from "../types/video";
import express, { Express, Request, Response } from "express";
import { db, getDateISOByDays } from "../../db/in-memory.db";
import { HttpStatus } from "../../core/types/http-statuses";
import { APIErrorResult } from "../../core/types/validationError";
import { createErrorMessages } from "../../core/utils/error.utils";
import { CreateVideoInputModel } from "../dto/createVideo.input";
import { createVideoInputDtoValidation, updateVideoInputDtoValidation } from "../validation/videoInputDtoValidation";
import { UpdateVideoInputModel } from "../dto/updateVideo.input";


export const videoRouter = Router();

videoRouter
    .get("", (req: Request, res: Response<Video[]>) => {
            res.status(HttpStatus.Ok).send(db.videos)
    })

    .get('/:id', 
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

    .post("", 
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

    .put("/:id",
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

    .delete("/:id",
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