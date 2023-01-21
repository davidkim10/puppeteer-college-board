import fs, { readFileSync } from "fs";
import path from "path";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadJSONFile = (filePath) => {
  const file = readFileSync(filePath);
  const data = JSON.parse(file);
  return data;
};

export const readFileNames = (directory) => {
  const dir = path.join(directory);
  const files = fs.readdirSync(dir);
  return files;
};
