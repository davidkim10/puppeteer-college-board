export interface IStepOption {
  value: string;
}

export interface IStepQuestion {
  label: string;
  input: IStepOptionQuestion;
  options?: IStepOption[];
}

export interface IStepOptionQuestion {
  type: string;
  id: string;
  options: IStepOption[];
}

export interface IStepURLPathMap {
  [key: string]: string;
}
