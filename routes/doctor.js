import { Router } from "express";
import {
  getPredictions,
  getSymptoms,
  predictionHistoryGet,
  predictionHistoryPost,
  runTriage,
} from "../handlers/doctorHandler.js";
const doctorxRouter = Router();

doctorxRouter.get("/symptoms", getSymptoms);
doctorxRouter.post("/diagnosis", getPredictions);
doctorxRouter.post("/triage", runTriage);
doctorxRouter.post("/history", predictionHistoryPost);
doctorxRouter.get("/history", predictionHistoryGet);
export default doctorxRouter;
