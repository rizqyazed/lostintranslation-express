const fs = require("fs");
require("dotenv").config();
const { Translate } = require("@google-cloud/translate").v2;

// -------------------------
// CONFIGURATION
// -------------------------

const POEM_LINES = [
  "Oh, my love",
  "If you're crazy like me,",
  "You'll throw away your jewelry,",
  "Sell all your bracelets,",
  "And sleep in my eyes.",
];

const LANGS = [
  "ar",
  "az",
  "zh",
  "cs",
  "nl",
  "en",
  "fr",
  "de",
  "el",
  "hi",
  "hu",
  "id",
  "ga",
  "it",
  "ja",
  "ko",
  "fa",
  "pl",
  "pt",
  "ru",
  "sk",
  "es",
  "sv",
  "tr",
  "uk",
  "vi",
];

// Your translation endpoint (LibreTranslate example)

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
});

// Number of poem variants to pre-generate
const NUM_VARIANTS = 3500;

// -------------------------
// TRANSLATION FUNCTION
// -------------------------

// async function ltTranslate(text, target) {
//   const res = await fetch(ENDPOINT, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       q: text,
//       source: "auto",
//       target,
//       format: "text",
//     }),
//   });
//
//   const data = await res.json();
//   if (!data.translatedText) throw new Error("Bad translation response");
//   return data.translatedText.trim();
// }

// Full chain translation of a single line
async function translateLine(text) {
  let res = [text.trim()];

  // 5 random languages
  for (let i = 0; i < 5; i++) {
    const lang = LANGS[Math.floor(Math.random() * LANGS.length)];
    res = await translate.translate(res[0], lang);
    res[0] = res[0].trim();

    // prevent Google rate-limit
    await new Promise((r) => setTimeout(r, 100));
  }

  // Return to English
  res = await translate.translate(res[0], "en");
  res[0] = res[0].trim();
  return res[0];
}

// Translate the whole poem for one variant
async function translatePoemOnce(prevPoem) {
  const out = [];
  for (const line of prevPoem) {
    out.push(await translateLine(line));
  }
  return out;
}

// -------------------------
// GENERATION LOOP
// -------------------------

async function main() {
  const results = [];
  let currentPoem = POEM_LINES; // start from original poem

  console.log(`Generating ${NUM_VARIANTS} poem variations ...`);

  for (let i = 0; i < NUM_VARIANTS; i++) {
    console.log(`→ Variant ${i + 1}/${NUM_VARIANTS}`);
    const poem = await translatePoemOnce(currentPoem);
    results.push(poem);

    currentPoem = poem;

    // Save incremental progress every 30 variants
    if (i % 30 === 0) {
      fs.writeFileSync("translations.json", JSON.stringify(results, null, 2));
    }
  }

  fs.writeFileSync("translations.json", JSON.stringify(results, null, 2));
  console.log("DONE! Saved to translations.json");
}

main().catch((err) => console.error(err));
