import { ElementHandle } from 'puppeteer';

export enum FieldType {
  text = 'text',
  select = 'select',
  radio = 'radio',
  radioGroup = 'radio-group',
}

export type QuestionElementHandle =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLElement;

export type SelectOptions = {
  element: ElementHandle<HTMLOptionElement>;
  value: string;
};

export type RadioOptions = {
  element: ElementHandle<HTMLInputElement>;
  id: string;
  value: string;
};

export interface ITextQuestion {
  id: string;
  tagName: string;
}
export interface ISelectQuestion extends ITextQuestion {
  options: ReadonlyArray<SelectOptions>;
}

export interface IRadioQuestion extends ITextQuestion {
  options: ReadonlyArray<RadioOptions>;
}
export type QuestionFieldTypes =
  | ITextQuestion
  | ISelectQuestion
  | IRadioQuestion;
