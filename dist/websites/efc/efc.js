// import { Page } from 'puppeteer';
import puppeteer from 'puppeteer-core';
import { Browser } from '../../browser/Browser.js';
import { Logger } from '../../browser/Logger.js';
import { stepData } from './form/steps/steps.js';
const logger = new Logger();
const COLLEGEBOARD_EFC_URL = 'https://npc.collegeboard.org/app/efc/start';
const x = puppeteer.Browser;
function parseId(id) {
    const parsedId = id.replace(/(?<!^)\./g, '\\.');
    return `#${parsedId}`;
}
async function autoFillFields(page, _steps) {
    // [{}, {}]
    const steps = Object.values(_steps);
    for (const step of steps) {
        const input = step.input;
        await page.waitForTimeout(2000);
        try {
            switch (input.type) {
                case 'text':
                    const inputTextId = parseId(input.id);
                    await page.type(parseId(inputTextId), 'Insert Dynamic value');
                    break;
                case 'select':
                    const selectId = parseId(input.id);
                    await page.select(selectId, input.options[3].value);
                    break;
                case 'radio':
                    const radioId = parseId(input.options[1].id);
                    await page.click(radioId);
                    break;
            }
        }
        catch (err) {
            logger.error(err);
        }
    }
}
async function navigateStepWizard(page, step = 1, callback) {
    const wizardStep = Math.max(step - 1, 0);
    const linkClassName = 'a.nav-link';
    try {
        await page.waitForSelector(linkClassName);
        await page.$$eval(linkClassName, (links, wizardStep) => links[wizardStep].click(), wizardStep);
        callback && callback(step);
    }
    catch (err) {
        logger.error(err);
    }
}
async function getTotalSteps(page) {
    try {
        await page.waitForSelector('a.nav-link');
        const stepCount = await page.$$eval('a.nav-link', (links) => links.length);
        return stepCount;
    }
    catch (err) {
        logger.error(err);
    }
}
export async function calculateEFC() {
    const browser = new Browser('College Board EFC Calculator');
    await browser.start();
    const page = await browser.newPage(COLLEGEBOARD_EFC_URL, 'EFC Calculator');
    for (let i = 1; i < Object.keys(stepData).length; i++) {
        const key = `step${i}`;
        const step = stepData[key];
        try {
            // await page.waitForSelector(step.firstInputId);
            // await page.waitForFunction(
            //   (i) =>
            //     document.querySelectorAll("app-question")[i].children().length > 0,
            //   {},
            //   i
            // );
            if (page) {
                await page.waitForNetworkIdle();
                await autoFillFields(page, step.questions);
                await navigateStepWizard(page, i + 1);
            }
        }
        catch (err) {
            throw err;
        }
    }
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
//# sourceMappingURL=efc.js.map