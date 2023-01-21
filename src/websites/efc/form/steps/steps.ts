import path from 'path';
import { loadJSONFile, readFileNames } from '../../../../utils.js';
import { fileURLToPath } from 'url';
import type { IStepQuestion, IStepURLPathMap } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface IStepData {
  [key: string]: Step;
}
export const STEP_URLPATH_MAP: IStepURLPathMap = {
  step1: '/app/efc/start',
  step2: '/app/efc/dependency',
  step3: '/app/efc/household-information',
  step4: '/app/efc/parent-income',
  step5: '/app/efc/parent-assets',
  step6: '/app/efc/student-finances',
};

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

  public get firstInputId() {
    return this.parseId(this.questions[0].input.id);
  }

  public parseId(id = '') {
    if (!id) return;
    const regex = new RegExp(/(?<!^)\./, 'g');
    const parsedId = id.replace(regex, '\\.');
    return `#${parsedId}`;
  }
}

export const getSteps = async () => {
  const data: IStepData = {};
  const dataDirPath = path.join(__dirname, '/data');
  const jsonFileRegex = new RegExp(/step\d+\.json/); // step[num*].json
  const files = readFileNames(dataDirPath).filter((f) => jsonFileRegex.test(f));
  for (const file of files) {
    const stepKey: string = file.split('.')[0];
    const stepNumber = Number(stepKey.split('step')[1]);
    const jsonData = loadJSONFile(dataDirPath + `/${file}`);
    const navURLPath: string = STEP_URLPATH_MAP[stepKey] as string;
    data[stepKey] = new Step(stepNumber, jsonData, navURLPath);
  }
  return data;
};

export const stepData = await getSteps();
