import path from "path";
import { loadJSONFile, readFileNames } from "../../../../utils.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STEP_URLPATH_MAP = {
  step1: "/app/efc/start",
  step2: "/app/efc/dependency",
  step3: "/app/efc/household-information",
  step4: "/app/efc/parent-income",
  step5: "/app/efc/parent-assets",
  step6: "/app/efc/student-finances",
};

export class Step {
  constructor(step = 1, questions, navURLPath) {
    this.step = step;
    this.urlPath = navURLPath;
    this.questions = questions;
  }

  parseId(id) {
    const regex = new RegExp(/(?<!^)\./, "g");
    const parsedId = id.replace(regex, "\\.");
    return `#${parsedId}`;
  }
}

const getSteps = async () => {
  const data = [];
  const dataDirPath = path.join(__dirname, "/data");
  const files = readFileNames(dataDirPath);
  for (const file of files) {
    const stepNumber = file.split(".")[0];
    const jsonData = loadJSONFile(dataDirPath + `/${file}`);
    const navURLPath = STEP_URLPATH_MAP[stepNumber];
    data.push(new Step(stepNumber, jsonData, navURLPath));
  }
  return data;
};

export const stepData = await getSteps();
