import { predictionData, symptomData } from "../db/queries.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const BASE_URL = "https://api.infermedica.com/v3";
const { APP_ID, APP_KEY } = process.env;
import { History } from "../models/PredictionHistory.js";

export const getSymptoms = async (req, res) => {
  const result = await symptomData(req);
  res.send(result);
};

export const getPredictions = async (req, res) => {
  const result = await predictionData(req);
  res.send(result);
};

export const runTriage = async (req, res) => {
  const interviewId = req.header("Interview-Id");
  if (!interviewId) {
    return res.status(400).json({ message: "Missing Interview-Id header" });
  }
  try {
    const { sex, age, evidence } = req.body;
    const infer = await axios.post(
      `${BASE_URL}/triage`,
      { sex, age, evidence },
      {
        headers: {
          "App-Id": APP_ID,
          "App-Key": APP_KEY,
          "Content-Type": "application/json",
          "Interview-Id": interviewId,
        },
        validateStatus: (s) => true, // let us forward errors
      }
    );

    if (infer.status >= 400) {
      console.error("Infermedica /triage:", infer.status, infer.data);
      return res.status(infer.status).json(infer.data);
    }

    return res.json(infer.data);
  } catch (err) {
    console.error("Error proxying Infermedica triage:", err);
    return res.status(500).json({ message: err.message });
  }
};

// POST: Save new prediction history
export const predictionHistoryPost = async (req, res) => {
  const { userEmail, mode, symptoms, result } = req.body;

  if (!userEmail || !mode || !symptoms || !result) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newHistory = new History({
      userEmail,
      mode,
      symptoms,
      result,
    });

    await newHistory.save();

    res.status(201).json({
      message: "History saved successfully",
      history: newHistory,
    });
  } catch (err) {
    console.error("Error saving history:", err);
    res.status(500).json({ message: "Error saving history" });
  }
};
// GET: Fetch prediction history for specific user
export const predictionHistoryGet = async (req, res) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ message: "User email is required" });
  }

  try {
    const history = await History.find({ userEmail }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error("Error fetching prediction history:", err);
    res.status(500).json({ message: "Error fetching prediction history" });
  }
};
