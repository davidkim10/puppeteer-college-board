import type { Page } from 'puppeteer';
import { Browser } from '../../browser/Browser.js';
import { Logger } from '../../browser/Logger.js';
import { Questions } from './form/questions/Questions.js';
import { Steps, StepPathMap } from './form/steps/steps.js';
import {
  FieldType,
  IStepQuestion,
  StepURLPathMapKey,
} from './form/steps/types.js';

const COLLEGEBOARD_EFC_URL = 'https://npc.collegeboard.org/app/efc/start';
const logger = new Logger();
const stepData = new Steps();
const stepPathMap = new StepPathMap();

async function autoFillFields(page: Page, questions: IStepQuestion[]) {
  for (const question of questions) {
    try {
      const input = question.input;
      await page.waitForNetworkIdle();
      if (input.id) await page.waitForSelector(Steps.parseId(input.id));
      switch (input.type) {
        case FieldType.text:
          const inputTextId = Steps.parseId(input.id);
          await page.type(inputTextId, 'Insert Dynamic value');
          break;
        case FieldType.select:
          const selectId = Steps.parseId(input.id);
          await handleSelectInput(
            page,
            Steps.parseId(input.id, false),
            'Counselor'
          );
          // await page.select(selectId, input.options[3].value);
          break;
        case FieldType.radio:
          const radioId = Steps.parseId(input.options[1].id as string);
          await page.waitForSelector(radioId);
          await page.click(radioId);
          break;
      }
    } catch (err) {
      logger.error(err);
    }
  }
}

async function checkLastStep(page: Page) {
  const linkClassName = 'a.nav-link';
  await page.waitForNetworkIdle();
  await page.waitForSelector(linkClassName);
  return await page.$$eval(linkClassName, (links) => {
    const activeLink = links.filter((link) =>
      link.classList.contains('active')
    )[0];
    const isLastStep = links.indexOf(activeLink) === links.length - 1;
    return isLastStep ? true : false;
  });
}

async function navigateStepWizard(page: Page, step = 1) {
  const wizardStep = Math.max(step - 1, 0);
  const linkClassName = 'a.nav-link';
  try {
    await page.waitForSelector(linkClassName);
    await page.$$eval(
      linkClassName,
      (links, wizardStep) => links[wizardStep].click(),
      wizardStep
    );
  } catch (err) {
    logger.error(err);
  }
}

async function getCurrentStep(page: Page) {
  await page.waitForNetworkIdle();
  await page.waitForSelector('a.nav-link');
  const reverseMap = stepPathMap.stepURLReversePathMap;
  const activeStepPath = await page.$eval(
    'a.nav-link.active',
    (link) => link.pathname
  );
  return reverseMap[activeStepPath][0] as StepURLPathMapKey;
}

// async function getTotalSteps(page: Page) {
//   await page.waitForSelector('a.nav-link');

//   const stepCount = await page.$$eval('a.nav-link', (links) => links.length);
//   return stepCount;
// }

async function getCurrentQuestions(page: Page) {
  const containerElement = 'app-question';
  await page.waitForNetworkIdle();
  await page.waitForSelector(containerElement);
  await page.waitForTimeout(1000);
  const questions = await page.$$eval(containerElement, (questions) => {
    return questions.flatMap((q) => {
      const select = q.querySelector('select')?.id;
      const text = q.querySelector('input[type="text"]')?.id;
      const radio = q.querySelector('input[type="radio"]')?.id;
      return [select, text, radio].filter(Boolean) as string[];
    });
  });

  return questions;
}

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
  await questions.sync('step1');
  await navigateStepWizard(page, 2);
  await questions.sync('step2');
  // questions.forEach((q) => console.log(q));

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
