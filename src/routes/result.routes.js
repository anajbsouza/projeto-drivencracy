import { Router } from "express";
import { showResult } from "../controllers/result.controller.js";

const resultRouter = Router();

resultRouter.get("/poll/:id/result", showResult);

export default resultRouter;