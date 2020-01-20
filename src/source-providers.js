import { isString, isNumber, isBoolean, isArray } from 'lodash';

const providerTypes = {};
const providers = {};

export class SourceProvider {
  
  get settingsElement() {
    return 'div';
  }

  updateFromProvider() {}
  updateFromDashboard() {}

  getType(value) {
    if (isString(value)) {
      return 'String';
    } else if (isNumber(value)) {
      return 'Number';
    } else if (isBoolean(value)) {
      return 'Boolean';
    } else if (isArray(value)) {
      return 'Array';
    }
    return null;
  }
}

export const addType = (typeName, constructor) => {

  if (hasType(typeName)) {
    return;
  }

  if (constructor.prototype instanceof SourceProvider) {
    providerTypes[typeName] = constructor;
  }
}

export const hasType = (typeName) => {
  return typeName in providerTypes;
}

export const add = (type, name, settings = {}) => {
  
  if (typeof name !== 'string') {
    name = type;
  }

  if (!hasType(type) || has(name)) {
    return null;
  }

  return providers[name] = new providerTypes[type](settings);
};

export const get = (providerName) => {
  return providers[providerName];
};

export const getNames = () => {
  return Object.keys(providers);
};

export const has = (providerName) => {
  return providerName in providers;
};