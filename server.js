const { Translate } = require("@google-cloud/translate").v2;
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const lang = [
  "am",
  "ar",
  "bg",
  "bn",
  "ca",
  "cs",
  "cy",
  "da",
  "de",
  "el",
  "en",
  "fr",
  "gu",
  "hi",
  "hr",
  "hu",
  "is",
  "it",
  "iw",
  "ja",
  "kn",
  "ko",
  "lt",
  "lv",
  "ml",
  "mr",
  "ms",
  "nl",
  "no",
  "pl",
  "pt-BR",
  "pt-PT",
  "ro",
  "ru",
  "rw",
  "sk",
  "sl",
  "sr",
  "sv",
  "sw",
  "ta",
  "te",
  "tr",
  "th",
  "uk",
  "ur",
  "vi",
  "zh-CN",
  "zh-TW",
];

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
});

async function translateText(text) {
  let res = [text.trim()];

  try {
    for (let i = 0; i < 5; i++) {
      const random = Math.floor(Math.random() * lang.length);
      const language = lang[random];
      res = await translate.translate(res[0], language);
      res[0] = res[0].trim();
    }
    res = await translate.translate(res[0], "en");
    res[0] = res[0].trim();

    return res[0];
  } catch (error) {
    console.log(`Error at translateText --> ${error}`);
    return text; // Return original text if translation fails
  }
}

async function translatePoemLines(poemLines) {
  const translatedLines = [];

  for (const line of poemLines) {
    if (line.trim()) {
      // Only translate non-empty lines
      const translatedLine = await translateText(line);
      translatedLines.push(translatedLine);
    } else {
      translatedLines.push(line); // Keep empty lines as is
    }
  }

  return translatedLines;
}

// Add middleware to parse JSON bodies
app.use(express.json());

app.post("/api/translate", async (req, res) => {
  try {
    const { poemLines } = req.body;
    if (!poemLines || !Array.isArray(poemLines)) {
      return res.status(400).json({ error: "poemLines array is required" });
    }

    console.log("Received poem lines:", poemLines);

    const translatedLines = await translatePoemLines(poemLines);

    console.log("Translated poem lines:", translatedLines);

    res.status(200).json({
      poem: translatedLines,
    });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Server is listening to port 8080");
});
