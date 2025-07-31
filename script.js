const { Translate } = require("@google-cloud/translate").v2;
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(8080, () => {
  console.log("Server is listening to port 8080");
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
  let res = [text.replaceAll(/\r?\n/g, "\n").trim()];
  // let res = "test\ning";
  // console.log(res[0]);
  try {
    for (let i = 0; i < 5; i++) {
      const random = Math.floor(Math.random() * lang.length);
      const language = lang[random];
      res = await translate.translate(res[0], language);
      res[0] = res[0].replaceAll(/\r?\n/g, "\n").trim();
      //   console.log("Translations: ", res[0]);
    }
    res = await translate.translate(res[0], "en");
    res[0] = res[0].replaceAll(/\r?\n/g, "\n").trim();

    console.log(res[0]);
    return res[0];
  } catch (error) {
    console.log(`Error at translateText --> ${error}`);
  }
}

//poem already devided by line + the other consecutive poems
const list = [
  "Oh, my love-\nIf you were at the level of my madness,\nYou would cast away your jewelry,\nSell all your bracelets,\nAnd sleep in my eyes.",
];

app.get("/api/poemgen", async (req, res) => {
  var transPoem = await translateText(list[list.length - 1]);
  //   console.log("this is the poem\n", transPoem);
  // console.log(list);
  list.push(transPoem);
  res.status(200).send(transPoem.replaceAll("\n", "<br>"));
  // console.log(transPoem);
  console.log(list);
  //   res.status(200).send(list[0].replaceAll("\n", "<br>"));
});

const translateLoop = async () => {
  for (let i = 1; i < 10; i++) {
    let transPoem = await translateText(list[list.length - 1]);
    console.log(await transPoem);
    // document.getElementsByClassName("1").innerHTML = await transPoem;
    // list.push(await transPoem);
  }
  //   console.log("this is thew list after translations:", list);
};

// translateLoop();
