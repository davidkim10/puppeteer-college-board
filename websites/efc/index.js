import { Browser } from "../../browser/Browser.js";
import { Logger } from "../../browser/Logger.js";
import { stepData } from "./form/steps/steps.js";
import EFC_FORM_FIELDS from "./form/index.js";

const logger = new Logger();
const COLLEGEBOARD_EFC_URL = `https://npc.collegeboard.org/app/efc/start`;

function parseId(id) {
  const parsedId = id.replace(/(?<!^)\./g, "\\.");
  return `#${parsedId}`;
}

async function autoFillFields(page, stepQuestions) {
  const questions = Object.values(stepQuestions);
  for (const question of questions) {
    const input = question.input;
    try {
      switch (input.type) {
        case "text":
          const inputTextId = parseId(input.id);
          await page.type(inputTextId, "Insert Dynamic value");
          break;
        case "select":
          const selectId = parseId(input.id);
          await page.select(selectId, input.options[3].value);
          break;
        case "radio":
          const radioId = parseId(input.options[1].id);
          await page.click(radioId, input.options[1].value);
          break;
      }
    } catch (err) {
      logger.error(err);
    }
  }
}

async function navigateStepWizard(page, step = 1, callback) {
  const wizardStep = Math.max(step - 1, 0);
  const linkClassName = "a.nav-link";
  try {
    await page.waitForSelector(linkClassName);
    await page.$$eval(
      linkClassName,
      (links, wizardStep) => links[wizardStep].click(),
      wizardStep
    );
    callback && callback(step);
  } catch (err) {
    logger.error(err);
  }
}

async function getTotalSteps(page) {
  try {
    await page.waitForSelector("a.nav-link");
    const stepCount = await page.$$eval("a.nav-link", (links) => links.length);
    return stepCount;
  } catch (err) {
    logger.error(err);
  }
}

export async function calculateEFC() {
  console.log(stepData);
  const browser = new Browser("College Board EFC Calculator");
  await browser.start();
  let currentStep = 1;

  const page = await browser.newPage(COLLEGEBOARD_EFC_URL, "EFC Calculator");

  for (let i = 1; i < stepData.length; i++) {
    const stepKey = `step${i}`;
    const step = stepData[i];
    const waitForElement = step.parseId();
  }

  let firstQuestionInput = parseId(stepData[0].questions.question1.input.id);
  await page.waitForSelector(firstQuestionInput);
  await autoFillFields(page, EFC_FORM_FIELDS.STEP1);
  await navigateStepWizard(page, ++currentStep);

  firstQuestionInput = parseId(EFC_FORM_FIELDS.STEP2.question1.input.id);
  await page.waitForSelector(firstQuestionInput);
  await autoFillFields(page, EFC_FORM_FIELDS.STEP2);

  // const page2 = await browser.newPage(
  //   "https://www.google.com",
  //   "EFC Calculator"
  // );
}
