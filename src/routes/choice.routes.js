import { Router } from "express";
import { createChoice, showVote } from "../controllers/choice.controller.js";

const choiceRouter = Router();

choiceRouter.post("/choice", createChoice);
choiceRouter.post("/choice/:id/vote", showVote);

export default choiceRouter;