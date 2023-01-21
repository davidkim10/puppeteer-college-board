import fs, { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadJSONFile = (filePath: fs.PathOrFileDescriptor) => {
  const file = readFileSync(filePath, { encoding: 'utf-8' });
  const data = JSON.parse(file);
  return data;
};

export const readFileNames = (directory: fs.PathLike) => {
  // const dir = path.join(directory);
  const files = fs.readdirSync(directory);
  return files;
};
