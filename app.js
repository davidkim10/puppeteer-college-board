import express from "express";
import { Browser } from "./browser/Browser.js";
import { FORM_FIELDS_MAP } from "./websites/collegeboard-efc.js";
import { calculateEFC } from "./websites/efc/index.js";

const app = express();
const PORT = 5000;

// These values will be generated from user form onboarding.

function parseId(id) {
  return id.replace(/(?<!^)\./g, "\\.");
}
async function autoFillFields(page, fields) {
  for (const field of fields) {
    const fieldId = parseId(field.target);
    const methodType = field.type === "input" ? "type" : "select";
    try {
      await page[methodType](fieldId, field.value);
    } catch (err) {
      console.error(err);
    }
  }
}

const getEFC = async () => {
  const COLLEGEBOARD_EFC_URL = `https://npc.collegeboard.org/app/efc/start`;
  const browser = new Browser("College Board EFC Calculator");
  await browser.start();
  const page = await browser.newPage(COLLEGEBOARD_EFC_URL, "EFC Calculator");

  await page.waitForSelector(FORM_FIELDS_MAP.step1.steps[0].target);
  await autoFillFields(page, FORM_FIELDS_MAP.step1);
  page.goto("/app/efc/dependency");
};

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT || "5000", () => {
  console.log(`Running on PORT ${PORT}`);
});

calculateEFC();
