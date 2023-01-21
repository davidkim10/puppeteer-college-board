import fs from "fs";
import path from "path";
import EFC_FORM_FIELDS from "./websites/efc/form/index.js";
import { newStep1 } from "./websites/efc/form/index.js";

console.log(newStep1.questions);
const questions = Object.values(EFC_FORM_FIELDS);

// for (let [i, q] of questions.entries()) {
//   const file = `step${i + 1}.json`;
//   const data = JSON.stringify(q);
//   fs.writeFile(`./websites/efc/form/steps/data/${file}`, data, (err) => {
//     if (err) throw err;
//     else console.log("created");
//   });
// }

// console.log(fs);
