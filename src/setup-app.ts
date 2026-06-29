import express, { Express } from "express";
import { videoRouter } from "./videos/routers/video.routers";
import { testingRouter } from "./testing/routers/testing.routers";

export const setApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  app.use("/videos", videoRouter);
  app.use("/testing", testingRouter);

  return app;
};
