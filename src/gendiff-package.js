import fs from 'fs';
import path from 'path';
import lodash from 'lodash';

const { keys, has, union } = lodash;

const getProcessedFile = (relativeFilePath) => {
  const filePath = path.resolve(process.cwd(), relativeFilePath);
  const file = fs.readFileSync(filePath);
  return JSON.parse(file);
};

const getUnionSortedKeys = (firstFile, secondFile) => {
  const allkeys = union(keys(firstFile), keys(secondFile));
  return allkeys.sort();
};

const genDiff = (firstFilePath, secondFilePath) => {
  const firstFile = getProcessedFile(firstFilePath);
  const secondFile = getProcessedFile(secondFilePath);

  const unionSortedKeys = getUnionSortedKeys(firstFile, secondFile);
  const result = unionSortedKeys.reduce((acc, key) => {
    if (has(firstFile, key) && !has(secondFile, key)) {
      acc.push(` - ${key}: ${firstFile[key]}`);
    } else if (!has(firstFile, key) && has(secondFile, key)) {
      acc.push(` + ${key}: ${secondFile[key]}`);
    } else if (firstFile[key] !== secondFile[key]) {
      acc.push(` - ${key}: ${firstFile[key]}`);
      acc.push(` + ${key}: ${secondFile[key]}`);
    } else if (firstFile[key] === secondFile[key]) {
      acc.push(`   ${key}: ${firstFile[key]}`);
    }
    return acc;
  }, []);
  return `{\n${result.join('\n')}\n}`;
};

export default genDiff;
