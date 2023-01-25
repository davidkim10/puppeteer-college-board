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

export class StepPathMap extends Map<StepURLPathMapKey, string> {
  public stepURLPathMap: IStepURLPathMap;
  constructor() {
    super();
    this.stepURLPathMap = {
      step1: '/app/efc/start',
      step2: '/app/efc/dependency',
      step3: '/app/efc/household-information',
      step4: '/app/efc/parent-income',
      step5: '/app/efc/parent-assets',
      step6: '/app/efc/student-finances',
    };
    this.initialize();
  }

  public get stepURLReversePathMap(): IStepURLReversePathMap {
    return this.reversePathMap(this.stepURLPathMap);
  }

  private reversePathMap(o: IStepURLPathMap): IStepURLReversePathMap {
    return Object.keys(o).reduce(
      // @ts-ignore
      (r, k) => Object.assign(r, { [o[k]]: (r[o[k]] || []).concat(k) }),
      {}
    );
  }

  private initialize() {
    for (const k in this.stepURLPathMap) {
      const key = k as StepURLPathMapKey;
      const value = this.stepURLPathMap[key];
      this.set(key, value);
    }
  }
}

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
      const isRadioType = input.type === InputTypes.radio;
      if (isRadioType) {
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

  public static parseId(id: string, cssHash: boolean = true) {
    const regex = new RegExp(/(?<!^)\./, 'g');
    const parsedId = id.replace(regex, '\\.');
    return cssHash ? `#${parsedId}` : parsedId;
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
