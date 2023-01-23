import { Logger } from './Logger.js';
import { Page } from 'puppeteer';
const logger = new Logger();

export class PageOptimizer {
  static async optimizePageLoad(page: Page) {
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      switch (resourceType) {
        case 'image':
        case 'font':
        case 'stylesheet':
          req.abort();
          break;
        default:
          req.continue();
      }
    });
  }

  static async waitTillHTMLRendered(
    page: Page,
    timeout = 30000,
    verbose: boolean
  ) {
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;

    while (checkCounts++ <= maxChecks) {
      let html = await page.content();
      let currentHTMLSize = html.length;
      let bodyHTMLSize = await page.evaluate(
        () => document.body.innerHTML.length
      );

      if (verbose) {
        const logMessage = `
          <> prev_size_check: ${lastHTMLSize} 
          <> curr_html_size: ${currentHTMLSize}
          <> body_html_size: ${bodyHTMLSize}
        `;
        console.log(logMessage);
      }

      if (lastHTMLSize && currentHTMLSize == lastHTMLSize) {
        countStableSizeIterations++;
      } else {
        countStableSizeIterations = 0;
      }

      if (countStableSizeIterations >= minStableSizeIterations) {
        verbose && logger.success('Page has loaded successfully.');
        break;
      }

      lastHTMLSize = currentHTMLSize ?? 0;
      // deprecated fn
      // return await page.waitForTimeout(checkDurationMsecs);
      return new Promise((r) => setTimeout(r, checkDurationMsecs));
    }
  }
}
