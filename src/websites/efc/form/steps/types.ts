interface IStepOption {
  value: string;
  id?: string;
}

interface IStepInput {
  type: string;
  id: string;
  options: IStepOption[];
}

export interface IStepQuestion {
  label: string;
  input: IStepInput;
}

export interface IStepURLPathMap {
  [key: string]: string;
}
