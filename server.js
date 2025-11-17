// NOT IS USE ANYMORE. FUCK GOOGLE CLOUD
//
//
//
// const { Translate } = require("@google-cloud/translate").v2;
// require("dotenv").config();
// import { translate } from "./translation.js";
const express = require("express");
// import express from "express";
// import { fileURLToPath } from "url";
// import path from "path";
// import { dirname } from "path";
//
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const path = require("path");
const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// async function translateText(text) {
//   let res = [text.trim()];
//
//   try {
//     for (let i = 0; i < 5; i++) {
//       const random = Math.floor(Math.random() * lang.length);
//       const language = lang[random];
//       res = await translate(res[0], language);
//       res[0] = res[0].trim();
//     }
//     res = await translate(res[0], "en");
//     res[0] = res[0].trim();
//
//     return res[0];
//   } catch (error) {
//     console.log(`Error at translateText --> ${error}`);
//     return text; // Return original text if translation fails
//   }
// }

//
//   for (const line of poemLines) {
//     if (line.trim()) {
//       // Only translate non-empty lines
//       const translatedLine = await translateText(line);
//       translatedLines.push(translatedLine);
//     } else {
//       translatedLines.push(line); // Keep empty lines as is
//     }
//   }
//
//   return translatedLines;
// }

// Add middleware to parse JSON bodies
app.use(express.json());

const variants = require("./translations.json");

let index = 0;

app.post("/api/translate", async (req, res) => {
  const poem = variants[index % variants.length];
  index++;
  res.json({ poem });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Server is listening to port 8080");
});
