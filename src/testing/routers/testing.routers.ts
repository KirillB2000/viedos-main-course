import { Request, Response, Router } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { db } from "../../db/in-memory.db";

export const testingRouter = Router();

testingRouter
  .get("", (req: Request, res: Response) => {
    res.status(200).send("testing url");
  })

  .delete("/all-data", (req: Request, res: Response) => {
    db.videos = [];
    res.sendStatus(HttpStatus.NoContent);
  });
