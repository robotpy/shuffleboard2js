import { 
  isString, 
  isNumber, 
  isBoolean, 
  isArray, 
  isNull, 
  kebabCase 
} from 'lodash';
import ProviderSettings from './elements/provider-settings';

const providerTypes = {};
const providers = {};


const getSettingsElementName = constructor => {
  const { settingsElement, typeName } = constructor;
  if (isNull(settingsElement) || isNull(typeName)) {
    return null;
  }
  const isProviderSettings = 
    settingsElement.prototype instanceof ProviderSettings;

  if (!isProviderSettings) {
    return null;
  }

  return kebabCase(typeName) + '-settings'; 
};

export class SourceProvider {
  
  static get typeName() {
    return null;
  }

  static get settingsElement() {
    return null;
  }

  static get settingsDefaults() {
		return {};
  }

  get settings() {
    return {};
  }

  get settingsElementName() {
    return getSettingsElementName(this.constructor);
  }

  onSettingsChange(settings) {}

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

export const addType = (constructor) => {

  const { typeName } = constructor;

  if (hasType(typeName)) {
    return;
  }

  if (constructor.prototype instanceof SourceProvider) {
    providerTypes[typeName] = constructor;
    const settingsElementName = getSettingsElementName(constructor);
    if (!isNull(settingsElementName)) {

      const { settingsElement } = constructor;
      const settingsElementProperties = constructor.properties || {};

      Object.defineProperty(settingsElement, 'properties', {
        get() {
          return {
            ...settingsElementProperties,
            settings: {
              type: Object
            }
          }
        }
      });

      customElements.define(
        settingsElementName, 
        constructor.settingsElement
      );
    }
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