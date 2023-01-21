import puppeteer from "puppeteer";
import { Logger } from "./Logger.js";
import { PageOptimizer } from "./PageOptimizer.js";
import { config } from "./config.js";
export class Browser {
    constructor(source) {
        this.logger = new Logger();
        this._data = [];
        this.source = source;
        this.browser;
        this.pages = {};
        this.page;
        this.pageCount;
        this.config = config;
    }
    static encode(query) {
        return encodeURIComponent(JSON.stringify(query));
    }
    static isTimeOutError(err) {
        if (err instanceof puppeteer.errors.TimeoutError) {
            return true;
        }
    }
    get data() {
        return this._data;
    }
    _storePageReference(page, pageReference) {
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
    async newPage(pageURL, pageReference) {
        try {
            if (!this.browser) {
                const err = "No browser running. Start your webscraper";
                this.logger.error(err);
                throw new Error(err);
            }
            const page = await this.browser.newPage();
            this._storePageReference(page, pageReference);
            if (this.config.options.headlesss === true) {
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
                        waitUntil: "domcontentloaded",
                    });
                    this.logger.success(msg.success);
                }
                catch (err) {
                    this.logger.error(err);
                }
            }
            return page;
        }
        catch (err) {
            this.logger.error("Browser: There was an issue creating your page");
            this.logger.error(err);
        }
    }
    async start() {
        try {
            this.browser = await puppeteer.launch(this.config.options);
            return this.browser;
        }
        catch (err) {
            this.logger.error(err);
        }
    }
}
//# sourceMappingURL=Browser.js.map
//# sourceMappingURL=Browser.js.map