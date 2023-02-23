import type { Page } from 'puppeteer';
import { Browser } from '../../browser/Browser.js';
import { Questions, Question } from './form/questions/Questions.js';
import { FieldType, ISelectQuestion } from './form/questions/types.js';
import { StepKey, Steps } from './form/steps/Steps.js';

const COLLEGEBOARD_EFC_URL = 'https://npc.collegeboard.org/app/efc/start';

// async function getTotalSteps(page: Page) {
//   await page.waitForSelector('a.nav-link');

//   const stepCount = await page.$$eval('a.nav-link', (links) => links.length);
//   return stepCount;
// }

// async function handleSelectInput(page: Page, selectId: string, answer: string) {
//   const options = await page.$eval(`select#${selectId}`, (select) => {
//     return Array.from(select.options).map((option) => ({
//       value: option.value,
//       innerText: option.innerText,
//     }));
//   });

//   for (const option of options) {
//     const isTargetItem = matchString(answer, option.innerText);
//     if (isTargetItem) {
//       await page.select(`#${selectId}`, option.value);
//       break;
//     }
//   }
// }

// function matchString(str: string, testString: string) {
//   const regPattern = str.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
//   const regex = new RegExp(regPattern, 'gi');
//   return regex.test(testString);
// }

export async function testInput(
  questions: ReadonlyArray<Question>,
  page: Page
) {
  for (const q of questions) {
    if (q.type === FieldType.select) {
      if ('options' in q.field) {
        console.log('select', q.label);
        await q.element.select(q.field.options[1].value);
      }
    }
    if (q.type === FieldType.text) {
      await q.element.type('123');
      await page.waitForNetworkIdle();
    }
    if (q.type === FieldType.radioGroup) {
      if ('options' in q.field) {
        await q.field.options[1].element.click();
      }
    }
  }
}

export async function calculateEFC() {
  const browser = new Browser('College Board EFC Calculator');
  await browser.start();

  const page = await browser.newPage(COLLEGEBOARD_EFC_URL);
  const questions = new Questions(page);
  const steps = new Steps(page);

  for (const step of [...steps.keys()]) {
    await page.waitForNetworkIdle();
    const navStep: number = Number(step.split('step')[1]);
    // await steps.navigate(navStep);
    console.table({
      step: steps.activeStep,
      path: steps.pathName,
      isLast: steps.isLast,
      navStep,
      loopStep: step,
    });
    if (navStep > 1) {
      await steps.nextStep();
    }

    await questions.scrape(step);
    const currQuestions = questions.get(step) as ReadonlyArray<Question>;
    // currQuestions.forEach((q) => console.log(q));
    await testInput(currQuestions, page);

    if (steps.isLast) break;

    // await page.waitForNavigation();

    // console.log('loop should jump to next');
  }
  questions.forEach((q) => console.log(q));
  // console.log('step1 questions', questions.get('step1'));
  // console.log('step2 questions', questions.get('step2'));
  // console.log('step3 questions', questions.get('step3'));

  return;
}
