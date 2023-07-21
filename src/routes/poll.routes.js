import { Router } from "express";
import { createPoll, returnPoll, showResult, voteOptions } from "../controllers/poll.controller.js";

const pollRouter = Router();

pollRouter.post("/poll", createPoll);
pollRouter.get("/poll", returnPoll);
pollRouter.get("/poll/:id/choice", voteOptions);
pollRouter.get("/poll/:id/result", showResult);

export default pollRouter;