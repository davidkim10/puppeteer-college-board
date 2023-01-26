import { ElementHandle } from 'puppeteer';
import { FieldType } from '../steps/types';

export type StepKey = 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6';
export type SelectOptions = {
  element: ElementHandle<HTMLOptionElement>;
  value: string;
}[];
export type RadioOptions = {
  element: ElementHandle<HTMLInputElement>;
  id: string;
  value: string;
}[];

export type QuestionElementHandle =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLElement;

export interface ITextQuestion {
  id: string;
  tagName: string;
}
export interface ISelectQuestion extends ITextQuestion {
  options: SelectOptions;
}

export interface IRadioQuestion extends ITextQuestion {
  options: RadioOptions;
}
export type QuestionFieldTypes =
  | ITextQuestion
  | ISelectQuestion
  | IRadioQuestion;
