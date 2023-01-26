import e from 'express';
import { ElementHandle, Page } from 'puppeteer';
import { FieldType } from '../steps/types.js';
import {
  QuestionFieldTypes,
  QuestionElementHandle,
  StepKey,
  RadioOptions,
} from './types.js';

export type QuestionsData = ReadonlyArray<Question>;
class Question {
  constructor(
    public element: ElementHandle<QuestionElementHandle>,
    public label: string,
    public type: FieldType,
    public field: QuestionFieldTypes
  ) {}
}

export class Questions extends Map<StepKey, QuestionsData> {
  private containerEl: string;
  constructor(private page: Page) {
    super();
    this.page = page;
    this.containerEl = 'app-question';
  }

  private async getTagName(element: ElementHandle): Promise<string> {
    // alternative
    // let tagName = await element.getProperty('tagName')
    // tagName = await tagName.jsonValue()
    return await this.page.evaluate((el) => el.tagName, element);
  }

  private async getFieldType(element: ElementHandle): Promise<FieldType> {
    const tagName = await this.getTagName(element);
    switch (tagName) {
      case 'SELECT':
        return FieldType.select;
      case 'MAT-RADIO-GROUP':
        return FieldType.radioGroup;
      default:
        return FieldType.text;
    }
  }

  private async getSelectOptions(select: ElementHandle<HTMLSelectElement>) {
    const options = [];
    const selectOptions = await select.$$('option');
    for (const option of selectOptions) {
      const valueHandle = await option.getProperty('value');
      const value = await valueHandle.jsonValue();
      options.push({ element: option, value });
    }
    return options;
  }

  private async getRadioOptions(radioGroup: ElementHandle<HTMLElement>) {
    const options: RadioOptions = [];
    const radioInputs = await radioGroup.$$('input[type="radio"]');
    for (const radio of radioInputs) {
      const attributes = await this.page.evaluate(
        ({ id, value }) => ({ id, value }),
        radio
      );
      options.push({ element: radio, ...attributes });
    }
    return options;
  }

  private async getField(
    element: ElementHandle<any>
  ): Promise<QuestionFieldTypes> {
    const id: string = await this.page.evaluate((el) => el.id, element);
    const fieldType = await this.getFieldType(element);
    const tagName: string = await this.getTagName(element);
    let field: any = { id, tagName };

    switch (fieldType) {
      case FieldType.radioGroup:
        const radioOptions = await this.getRadioOptions(element);
        field.options = radioOptions;
        break;

      case FieldType.select:
        const selectOptions = await this.getSelectOptions(element);
        field = { id, tagName, options: selectOptions };
        break;
    }
    return field as QuestionFieldTypes;
  }

  public async getCurrentQuestions() {
    await this.page.waitForNetworkIdle();
    await this.page.waitForSelector(this.containerEl);
    await this.page.waitForTimeout(1000);
    const questions: Question[] = [];
    const containers = await this.page.$$(this.containerEl);

    for (const container of containers) {
      const label = await container.$eval('label', (label) => label.innerText);
      const select = await container.$('select');
      const text = await container.$('input[type="text"]');
      const radioGroup = await container.$('mat-radio-group');
      const elementHandler = [
        select as ElementHandle<HTMLSelectElement>,
        text as ElementHandle<HTMLInputElement>,
        radioGroup as ElementHandle<HTMLElement>,
      ].filter(Boolean)[0];
      const field = await this.getField(elementHandler);
      const type = await this.getFieldType(elementHandler);

      questions.push(new Question(elementHandler, label, type, field));
    }
    // console.log(questions);
    return questions;
  }

  public async sync(key: StepKey): Promise<void> {
    const questions = await this.getCurrentQuestions();
    this.set(key, questions);
  }
}
