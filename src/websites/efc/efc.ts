import type { Page } from 'puppeteer';
import { Browser } from '../../browser/Browser.js';
import { Logger } from '../../browser/Logger.js';
import { STEP_URLPATH_REVERSE_MAP, Steps } from './form/steps/steps.js';
import {
  InputTypes,
  IStepQuestion,
  StepURLPathMapKey,
} from './form/steps/types.js';

const COLLEGEBOARD_EFC_URL = 'https://npc.collegeboard.org/app/efc/start';
const logger = new Logger();
const stepData = new Steps();
function parseId(id: string) {
  const parsedId = id.replace(/(?<!^)\./g, '\\.');
  return `#${parsedId}`;
}

async function autoFillFields(page: Page, questions: IStepQuestion[]) {
  for (const question of questions) {
    const input = question.input;
    await page.waitForNetworkIdle();
    if (input.id) {
      await page.waitForSelector(Steps.parseId(input.id));
    }
    try {
      switch (input.type) {
        case InputTypes.text:
          const inputTextId = parseId(input.id);
          await page.type(inputTextId, 'Insert Dynamic value');
          break;
        case InputTypes.select:
          const selectId = parseId(input.id);
          await page.select(selectId, input.options[3].value);
          break;
        case InputTypes.radio:
          const radioId = parseId(input.options[1].id as string);
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

async function navigateStepWizard(
  page: Page,
  step = 1,
  callback?: (step: number) => void
) {
  const wizardStep = Math.max(step - 1, 0);
  const linkClassName = 'a.nav-link';
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

// async function getTotalSteps(page: Page) {
//   await page.waitForSelector('a.nav-link');

//   const stepCount = await page.$$eval('a.nav-link', (links) => links.length);
//   return stepCount;
// }

async function getCurrentStep(page: Page) {
  await page.waitForNetworkIdle();
  await page.waitForSelector('a.nav-link');
  const activeStepPath = await page.$eval(
    'a.nav-link.active',
    (link) => link.pathname
  );

  return STEP_URLPATH_REVERSE_MAP[activeStepPath][0] as StepURLPathMapKey;
}

async function getCurrentQuestions(page: Page) {
  await page.waitForNetworkIdle();
  await page.waitForSelector('app-question');
  const questions = await page.$$eval('app-question', (questions) => {
    return questions.flatMap((q) => {
      const selector = q.querySelector('select')?.id;
      const text = q.querySelector('input[type="text"]')?.id;
      const radio = q.querySelector('input[type="radio"]')?.id;
      return [selector, text, radio].filter(Boolean) as string[];
    });
  });

  return questions;
}

export async function calculateEFC() {
  const browser = new Browser('College Board EFC Calculator');
  await browser.start();

  const page = await browser.newPage(COLLEGEBOARD_EFC_URL);

  for (let i = 1; i <= stepData.size; i++) {
    let currentStep = await getCurrentStep(page);
    let currentQuestions = await getCurrentQuestions(page);
    console.log('currentstep:', currentStep, currentQuestions);
    const currentStepData = stepData.get(currentStep);

    if (currentStepData) {
      autoFillFields(page, currentStepData.filterQuestions(currentQuestions));
      const isLastStep = await checkLastStep(page);
      if (!isLastStep) {
        console.log(
          'not last step -- current step',
          currentStep,
          'next step + 1'
        );
        await page.waitForTimeout(3000);
        await navigateStepWizard(page, i + 1);
      } else {
        console.error('last step!');
        break;
      }
    }
  }

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
