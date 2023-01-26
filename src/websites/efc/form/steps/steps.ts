import { Page } from 'puppeteer';
export type StepKey = 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6';

export class Steps extends Map<StepKey, string> {
  private navLink: string;
  private urlMap;
  private _activeStep: StepKey;
  private _isLast: boolean;
  private _pathName: string;

  constructor(private page: Page) {
    super();
    this.navLink = 'a.nav-link';
    this.urlMap = {
      step1: '/app/efc/start',
      step2: '/app/efc/dependency',
      step3: '/app/efc/household-information',
      step4: '/app/efc/parent-income',
      step5: '/app/efc/parent-assets',
      step6: '/app/efc/student-finances',
    };
    this.initialize();
  }

  public get activeStep() {
    return this._activeStep;
  }

  public get isLast() {
    return this._isLast;
  }

  public get pathName() {
    return this._pathName;
  }

  public async navigate(step: number): Promise<void> {
    await this.page.waitForNetworkIdle();
    await this.page.waitForSelector(this.navLink);
    const maxStep = 6;
    const stepIndex = this.minMax(step - 1, 0, maxStep);
    const steps = await this.page.$$(this.navLink);
    const targetStep = steps[stepIndex];
    await targetStep.click();
    await this.page.waitForNavigation({ timeout: 5000 });
    await this.syncSteps();
  }

  public async syncSteps(): Promise<void> {
    await this.page.waitForNetworkIdle();
    this._activeStep = await this.getActiveStep();
    this._isLast = await this.isLastStep();
    this._pathName = await this.getPathName();
  }

  private minMax(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max);
  }

  private async getActiveStep(): Promise<StepKey> {
    // await this.page.waitForNetworkIdle();
    await this.page.waitForSelector('a.nav-link');
    const steps = [...this.keys()];
    const pathname = await this.getPathName();
    const activeStep = steps.find((s) => this.get(s) === pathname) as StepKey;
    return activeStep;
  }

  private async isLastStep(): Promise<boolean> {
    // await this.page.waitForNetworkIdle();
    await this.page.waitForSelector(this.navLink);
    return await this.page.$$eval(this.navLink, (links) => {
      const isLastIndex = links.length - 1;
      const activeLink = links.filter((link) =>
        link.classList.contains('active')
      )[0] as HTMLAnchorElement;

      return links.indexOf(activeLink) === isLastIndex;
    });
  }

  private async getPathName(): Promise<string> {
    // await this.page.waitForNetworkIdle();
    return await this.page.evaluate(() => window.location.pathname);
  }

  private initialize(): void {
    const steps = Object.keys(this.urlMap) as ReadonlyArray<StepKey>;
    for (const step of steps) {
      this.set(step, this.urlMap[step]);
    }
  }
}
