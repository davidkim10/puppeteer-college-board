import puppeteer from 'puppeteer';
import type { Browser as PuppeteerBrowser, Page } from 'puppeteer';
import { Logger } from './Logger.js';
import { PageOptimizer } from './PageOptimizer.js';
import { config, IConfig } from './config.js';

// interface IPageReference {
//   id: number;
//   ref: string | number;
//   page: Page;
//   source: string;
// }

export class Browser {
  public browser: PuppeteerBrowser | undefined;
  public logger: Logger;
  public page: Page;
  private config: IConfig;

  constructor(public source: string) {
    this.source = source;
    this.logger = new Logger();
    this.browser;
    this.page;
    this.config = config;
  }
  static encode(query: string) {
    return encodeURIComponent(JSON.stringify(query));
  }

  async newPage(pageURL = ''): Promise<Page> {
    const isHeadless = this.config.browser.headless;
    if (!this.browser) {
      const err = 'No browser running. Start your webscraper';
      this.logger.error(err);
      throw new Error(err);
    }
    try {
      this.page = await this.browser.newPage();
      const shortenedURL = pageURL.substring(0, 32);
      const messageStart = `Attempting to connect to ${shortenedURL}...`;
      const messageSuccess = `Page loaded: ${shortenedURL} `;

      this.logger.log(messageStart);
      await this.page.goto(pageURL, { waitUntil: 'domcontentloaded' });
      if (isHeadless) await PageOptimizer.optimizePageLoad(this.page);
      this.logger.success(messageSuccess);
    } catch (err) {
      this.logger.error('Browser: There was an issue creating your page');
      this.logger.error(err);
      throw err;
    }
    return this.page;
  }
  async start() {
    try {
      this.browser = await puppeteer.launch(this.config.browser);
      return this.browser;
    } catch (err) {
      this.logger.error(err);
    }
  }

  close() {
    this.browser?.close().catch((err) => this.logger.error(err));
  }
}
