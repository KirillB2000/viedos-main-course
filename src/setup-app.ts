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

    app.post('/videos', (req: Request, res: Response) => {
        // Create new video
    })

    app.put('/videos/:id', (req: Request, res: Response) => {
        // Update video by id
    })

    app.delete('/videos/:id', (req: Request, res: Response) => {
        // Delete video by id
    })

    return app;
};