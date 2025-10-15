import "./db/connection.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import userRouter from "./routes/user.js";
import doctorxRouter from "./routes/doctor.js";
import adminRouter from "./routes/admin.js";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors({ origin: "http://localhost:5173" }));
app.use("/api/v1/user", userRouter);
app.use("/api/v1/doctorx", doctorxRouter);
app.use("/api/v1/admin", adminRouter);

// List of supported languages
const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "nl", name: "Dutch" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "bn", name: "Bengali" },
  { code: "ur", name: "Urdu" },
  { code: "tr", name: "Turkish" },
  { code: "vi", name: "Vietnamese" },
  { code: "th", name: "Thai" },
  { code: "el", name: "Greek" },
  { code: "pl", name: "Polish" },
  { code: "ro", name: "Romanian" },
  { code: "cs", name: "Czech" },
  { code: "hu", name: "Hungarian" },
  { code: "sv", name: "Swedish" },
  { code: "da", name: "Danish" },
  { code: "fi", name: "Finnish" },
  { code: "no", name: "Norwegian" },
  { code: "he", name: "Hebrew" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
  { code: "tl", name: "Filipino" },
  { code: "sw", name: "Swahili" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "pa", name: "Punjabi" },
  { code: "gu", name: "Gujarati" },
  { code: "mr", name: "Marathi" },
  { code: "ne", name: "Nepali" },
  { code: "si", name: "Sinhala" },
  { code: "km", name: "Khmer" },
  { code: "lo", name: "Lao" },
  { code: "my", name: "Burmese" },
  { code: "mn", name: "Mongolian" },
  { code: "ka", name: "Georgian" },
  { code: "hy", name: "Armenian" },
  { code: "az", name: "Azerbaijani" },
  { code: "uz", name: "Uzbek" },
  { code: "kk", name: "Kazakh" },
  { code: "tk", name: "Turkmen" },
  { code: "ky", name: "Kyrgyz" },
  { code: "tg", name: "Tajik" },
  { code: "ps", name: "Pashto" },
  { code: "fa-AF", name: "Dari" },
  { code: "ku", name: "Kurdish" },
  { code: "so", name: "Somali" },
  { code: "am", name: "Amharic" },
  { code: "ti", name: "Tigrinya" },
  { code: "om", name: "Oromo" },
  { code: "yo", name: "Yoruba" },
  { code: "ig", name: "Igbo" },
  { code: "ha", name: "Hausa" },
  { code: "zu", name: "Zulu" },
  { code: "xh", name: "Xhosa" },
  { code: "af", name: "Afrikaans" },
  { code: "mi", name: "Maori" },
  { code: "sm", name: "Samoan" },
  { code: "haw", name: "Hawaiian" },
  { code: "ty", name: "Tahitian" },
  { code: "fj", name: "Fijian" },
  { code: "to", name: "Tongan" },
  { code: "mg", name: "Malagasy" },
  { code: "mlg", name: "Malagasy" },
  { code: "st", name: "Sesotho" },
  { code: "tn", name: "Tswana" },
  { code: "sn", name: "Shona" },
  { code: "rw", name: "Kinyarwanda" },
  { code: "rn", name: "Kirundi" },
  { code: "wo", name: "Wolof" },
  { code: "qu", name: "Quechua" },
  { code: "gn", name: "Guarani" },
  { code: "ay", name: "Aymara" },
  { code: "nah", name: "Nahuatl" },
  { code: "arn", name: "Mapudungun" },
];

// Endpoint to fetch supported languages
app.get("/api/languages", (req, res) => {
  res.json(supportedLanguages);
});

// Translation endpoint
app.post("/translate", async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res.status(400).send("Text or targetLanguage missing.");
  }

  try {
    const response = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params: {
          q: text,
          langpair: `en|${targetLanguage}`,
          key: "72ccfd436699f5ff1ab4", // Replace with your actual API key
        },
      }
    );
    res.json(response.data.responseData.translatedText);
  } catch (error) {
    console.error("Error translating text:", error.message);
    res.status(500).send("Error translating text");
  }
});
// Default route for testing deployment
app.get("/", (req, res) => {
  res.send("🚀 Backend API is running successfully! — Deployed by Falak Ahmad");
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => console.log("Server is Running on ", PORT));
