import path from 'path';
import { loadJSONFile, readFileNames, reverseMap } from '../../../../utils.js';
import { fileURLToPath } from 'url';
import {
  IStepQuestion,
  IStepURLPathMap,
  InputTypes,
  IStepURLReversePathMap,
  StepURLPathMapKey,
} from './types.js';

export const STEP_URLPATH_MAP: IStepURLPathMap = {
  step1: '/app/efc/start',
  step2: '/app/efc/dependency',
  step3: '/app/efc/household-information',
  step4: '/app/efc/parent-income',
  step5: '/app/efc/parent-assets',
  step6: '/app/efc/student-finances',
};

export const STEP_URLPATH_REVERSE_MAP: IStepURLReversePathMap =
  reverseMap(STEP_URLPATH_MAP);

export class Step {
  constructor(
    public step = 1,
    public questions: IStepQuestion[],
    public urlPath: string
  ) {
    this.step = step;
    this.urlPath = urlPath;
    this.questions = Object.values(questions);
  }

  public get stepKey() {
    return `step${this.step}`;
  }

  public filterQuestions(ids: string[]): IStepQuestion[] {
    const questions = this.questions.filter(({ input }) => {
      if (input.type === InputTypes.radio) {
        const optionIds = input.options.map(({ id }) => id);
        return ids.some((id) => optionIds.includes(id));
      }
      return ids.includes(input.id);
    });

    return questions;
  }
}

export class Steps extends Map<StepURLPathMapKey, Step> {
  constructor() {
    super();
    this.getSteps();
  }

  static parseId(id: string) {
    const regex = new RegExp(/(?<!^)\./, 'g');
    const parsedId = id.replace(regex, '\\.');
    return `#${parsedId}`;
  }

  private get dirName() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.join(__dirname, '/data');
  }

  private getStepDataFileNames() {
    const dataDirPath = this.dirName;
    const stepDataFileNameRegex = new RegExp(/step\d+\.json/); // step[num*].json
    const fileNames = readFileNames(dataDirPath);
    return fileNames.filter((file) => stepDataFileNameRegex.test(file));
  }

  private getSteps() {
    const dataDirPath = this.dirName;
    const files = this.getStepDataFileNames();
    for (const file of files) {
      const stepKey = file.split('.')[0] as StepURLPathMapKey;
      const stepNumber = Number(stepKey.split('step')[1]);
      const jsonData = loadJSONFile(dataDirPath + `/${file}`);
      const navURLPath: string = STEP_URLPATH_MAP[stepKey];
      this.set(stepKey, new Step(stepNumber, jsonData, navURLPath));
    }
  }
}
