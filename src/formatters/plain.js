import _ from 'lodash';

const getPathToProperty = (name, path) => {
  const currentPath = _.cloneDeep(path);
  currentPath.push(name);
  const pathToProperty = `'${currentPath.join('.')}'`;

  return pathToProperty;
};

const getStartOfSentence = (name, path, type) => {
  const pathProperty = getPathToProperty(name, path);
  return `property ${pathProperty} was ${type}`;
};

const getPrintedValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (_.isString(value)) {
    return `'${value}'`;
  }
  return value;
};

const getFormattedUnchangedProperty = () => [];

const getFormattedAddedProperty = (node, path) => {
  const { name, value, type } = node;

  const startOfSentence = getStartOfSentence(name, path, type);

  const printedValue = getPrintedValue(value);
  return `${startOfSentence} with value: ${printedValue}`;
};

const getFormattedRemovedPRoperty = (node, path) => {
  const { name, type } = node;

  const startOfSentence = getStartOfSentence(name, path, type);
  return startOfSentence;
};

const getFormattedUpdatedProperty = (node, path) => {
  const {
    name,
    valueBefore,
    valueAfter,
    type,
  } = node;

  const startOfSentence = getStartOfSentence(name, path, type);

  const printedValueBefore = getPrintedValue(valueBefore);
  const printedValueAfter = getPrintedValue(valueAfter);

  return `${startOfSentence}. From ${printedValueBefore} to ${printedValueAfter}`;
};

const getFormattedNestedProperty = (node, path, iter) => {
  const { name, children } = node;

  const currentPath = _.cloneDeep(path);
  currentPath.push(name);
  const nested = iter(children, currentPath);

  return nested;
};

const mapTypeToPropertyFormatter = {
  unchanged: getFormattedUnchangedProperty,
  added: getFormattedAddedProperty,
  removed: getFormattedRemovedPRoperty,
  updated: getFormattedUpdatedProperty,
  nested: getFormattedNestedProperty,
};

const getPlainOutput = (diffInfo) => {
  const iter = (nodes, path = []) => {
    const valueProperties = nodes.flatMap((node) => {
      const { type } = node;

      const getFormattedProperty = mapTypeToPropertyFormatter[type];

      return getFormattedProperty(node, path, iter);
    });
    return valueProperties.join('\n');
  };
  return iter(diffInfo);
};

export default getPlainOutput;
