import puppeteer from 'puppeteer';
import type { Browser as PuppeteerBrowser, Page } from 'puppeteer';
import { Logger } from './Logger.js';
import { PageOptimizer } from './PageOptimizer.js';
import { config, IConfig } from './config.js';

interface IPageReference {
  id: number;
  ref: string | number;
  page: Page;
  source: string;
}

export class Browser {
  public browser: PuppeteerBrowser | undefined;
  public logger: Logger;
  public pageCount: number;
  public pages: { [key: string]: IPageReference };
  public page: Page | undefined;
  private config: IConfig;
  private _data: string[];

  constructor(public source: string) {
    this.source = source;
    this.logger = new Logger();
    this.browser;
    this.pages = {};
    this.page;
    this.pageCount = 0;
    this.config = config;
    this._data = [];
  }
  static encode(query: string) {
    return encodeURIComponent(JSON.stringify(query));
  }

  get data() {
    return this._data;
  }
  _storePageReference(page: Page, pageReference: string) {
    this.pageCount = ++this.pageCount || 1;
    const ref = pageReference || this.pageCount;
    const key = `page${this.pageCount}`;
    const value = {
      id: this.pageCount,
      ref,
      page,
      source: this.source,
    };
    this.pages[key] = value;
  }
  async newPage(pageURL: string, pageReference: string) {
    try {
      if (!this.browser) {
        const err = 'No browser running. Start your webscraper';
        this.logger.error(err);
        throw new Error(err);
      }
      const page = await this.browser.newPage();
      this._storePageReference(page, pageReference);
      if (this.config.browser.headless === true) {
        await PageOptimizer.optimizePageLoad(page);
      }
      if (pageURL) {
        const targetURL = pageURL.substring(0, 32);
        const msg = {
          init: `Attempting to connect to ${targetURL}...`,
          success: `Page loaded: ${targetURL} `,
        };
        this.logger.log(msg.init);
        try {
          await page.goto(pageURL, {
            timeout: 10000,
            waitUntil: 'domcontentloaded',
          });
          this.logger.success(msg.success);
        } catch (err) {
          this.logger.error(err);
        }
      }
      return page;
    } catch (err) {
      this.logger.error('Browser: There was an issue creating your page');
      this.logger.error(err);
    }
  }
  async start() {
    try {
      this.browser = await puppeteer.launch(this.config.browser);
      return this.browser;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
//# sourceMappingURL=Browser.js.map
