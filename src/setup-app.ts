import express, { Express, Request, Response } from "express";
 
export const setApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    app.get("/", (req: Request, res: Response) => {
        res.status(200).send("Hello world!");
    });

    app.get('/videos', (req: Request, res: Response) => {
        // Get all videos
    })

    app.get('/videos/:id', (req: Request, res: Response) => {
        // Get video by id
    })

    app.get('/videos', (req: Request, res: Response) => {
        // Create new video
    })

    app.get('/videos', (req: Request, res: Response) => {
        // Get all videos
    })

    return app;
};