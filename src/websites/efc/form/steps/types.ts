export enum FieldType {
  text = 'text',
  select = 'select',
  radio = 'radio',
  radioGroup = 'radio-group',
}
interface IStepOption {
  value: string;
  id?: string;
}

interface IStepInput {
  type: FieldType;
  id: string;
  options: IStepOption[];
}

export interface IStepQuestion {
  label: string;
  input: IStepInput;
}

// export type StepURLPathMapKey = 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6';

export type StepURLPathMapKey = keyof IStepURLPathMap;
export interface IStepURLPathMap {
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step5: string;
  step6: string;
}

export interface IStepURLReversePathMap {
  [key: string]: StepURLPathMapKey;
}
