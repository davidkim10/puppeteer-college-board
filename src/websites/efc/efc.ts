import type { Page } from 'puppeteer';
import { Browser } from '../../browser/Browser.js';
import { Logger } from '../../browser/Logger.js';
import { Questions } from './form/questions/Questions.js';
import { StepKey, Steps } from './form/steps/Steps.js';

const COLLEGEBOARD_EFC_URL = 'https://npc.collegeboard.org/app/efc/start';
const logger = new Logger();

// async function getTotalSteps(page: Page) {
//   await page.waitForSelector('a.nav-link');

//   const stepCount = await page.$$eval('a.nav-link', (links) => links.length);
//   return stepCount;
// }

async function handleSelectInput(page: Page, selectId: string, answer: string) {
  const options = await page.$eval(`select#${selectId}`, (select) => {
    return Array.from(select.options).map((option) => ({
      value: option.value,
      innerText: option.innerText,
    }));
  });

  for (const option of options) {
    const isTargetItem = matchString(answer, option.innerText);
    if (isTargetItem) {
      await page.select(`#${selectId}`, option.value);
      break;
    }
  }
}

function matchString(str: string, testString: string) {
  const regPattern = str.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(regPattern, 'gi');
  return regex.test(testString);
}

export async function calculateEFC() {
  const browser = new Browser('College Board EFC Calculator');
  await browser.start();

  const page = await browser.newPage(COLLEGEBOARD_EFC_URL);
  const questions = new Questions(page);
  const steps = new Steps(page);

  for (let wizardStep = 1; wizardStep <= steps.size; wizardStep++) {
    const stepKey = `step${wizardStep}` as StepKey;
    await questions.scrape(stepKey);
    if (wizardStep > 1) {
      logger.log(`WizardStep ${wizardStep}`);
      logger.log(`QUESTION COUNT:${questions.size}`);
      await steps.navigate(wizardStep);
      console.table({
        step: steps.activeStep,
        path: steps.pathName,
        isLast: steps.isLast,
      });
    }
  }

  questions.forEach((q) => console.log(q));

  // for (let i = 1; i <= stepData.size; i++) {
  //   let currentStep = await getCurrentStep(page);
  //   let currentQuestions = await getCurrentQuestions(page);
  //   console.log('currentstep:', currentStep, currentQuestions);
  //   const currentStepData = stepData.get(currentStep);

  //   if (currentStepData) {
  //     autoFillFields(page, currentStepData.filterQuestions(currentQuestions));
  //     const isLastStep = await checkLastStep(page);
  //     if (!isLastStep) {
  //       console.log(
  //         'not last step -- current step',
  //         currentStep,
  //         'next step + 1'
  //       );
  //       await page.waitForTimeout(3000);
  //       await navigateStepWizard(page, i + 1);
  //       if (i === 2) break;
  //     } else {
  //       console.error('last step!');
  //       break;
  //     }
  //   }
  // }

  return;

  // for (let i = 1; i < Object.keys(stepData).length; i++) {
  //   const key = `step${i}`;
  //   const step = stepData[key];
  //   try {
  //     // await page.waitForSelector(step.firstInputId);
  //     // await page.waitForFunction(
  //     //   (i) =>
  //     //     document.querySelectorAll("app-question")[i].children().length > 0,
  //     //   {},
  //     //   i
  //     // );
  //     if (page) {
  //       await page.waitForNetworkIdle();
  //       await autoFillFields(page, step.questions);
  //       await navigateStepWizard(page, i + 1);
  //     }
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // let firstQuestionInput = parseId(stepData.step1.questions[0].input.id);
  // await page.waitForSelector(firstQuestionInput);
  // await autoFillFields(page, EFC_FORM_FIELDS.STEP1);
  // await navigateStepWizard(page, ++currentStep);

  // firstQuestionInput = parseId(EFC_FORM_FIELDS.STEP2.question1.input.id);
  // await page.waitForSelector(firstQuestionInput);
  // await autoFillFields(page, EFC_FORM_FIELDS.STEP2);

  // const page2 = await browser.newPage(
  //   "https://www.google.com",
  //   "EFC Calculator"
  // );
}
