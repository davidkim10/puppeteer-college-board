import path from 'path';
import { loadJSONFile, readFileNames } from '../../../../utils.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const STEP_URLPATH_MAP = {
    step1: '/app/efc/start',
    step2: '/app/efc/dependency',
    step3: '/app/efc/household-information',
    step4: '/app/efc/parent-income',
    step5: '/app/efc/parent-assets',
    step6: '/app/efc/student-finances',
};
export class Step {
    constructor(step = 1, questions, urlPath) {
        this.step = step;
        this.questions = questions;
        this.urlPath = urlPath;
        this.step = step;
        this.urlPath = urlPath;
        this.questions = Object.values(questions);
    }
    get stepKey() {
        return `step${this.step}`;
    }
    get firstInputId() {
        return this.parseId(this.questions[0].input.id);
    }
    parseId(id) {
        const regex = new RegExp(/(?<!^)\./, 'g');
        const parsedId = id.replace(regex, '\\.');
        return `#${parsedId}`;
    }
}
export const getSteps = async () => {
    const data = {};
    const dataDirPath = path.join(__dirname, '/data');
    const jsonFileRegex = new RegExp(/step\d+\.json/); // step[num*].json
    const files = readFileNames(dataDirPath).filter((f) => jsonFileRegex.test(f));
    for (const file of files) {
        const stepKey = file.split('.')[0];
        const stepNumber = Number(stepKey.split('step')[1]);
        const jsonData = loadJSONFile(dataDirPath + `/${file}`);
        const navURLPath = STEP_URLPATH_MAP[stepKey];
        data[stepKey] = new Step(stepNumber, jsonData, navURLPath);
    }
    return data;
};
export const stepData = await getSteps();
//# sourceMappingURL=steps.js.map