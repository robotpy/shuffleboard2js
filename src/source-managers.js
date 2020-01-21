import { sourcesChanged } from './redux/actions';
import { forEach, camelCase } from 'lodash';
import { 
  has as hasProvider, 
  hasType as hasProviderType,
  add as addProvider 
} from './source-providers'
import store from './redux/store';
import { initSources, removeSources } from './redux/actions';

let managers = {};

export const has = (providerName) => {
  return providerName in managers;
};

export const get = (providerName) => {
  return managers[providerName];
};

export const add = (providerType, providerName, settings) => {
  providerName = providerName || providerType;
  if (
    has(providerName) 
    || hasProvider(providerName) 
    || !hasProviderType(providerType)
  ) {
    return;
  }
  managers[providerName] = new SourceManager(providerType, providerName, settings);
  store.dispatch(initSources(providerName));
};

export const remove = (providerName) => {
  if (!has(providerName)) {
    return;
  }
  const manager = get(providerName);
  manager.disconnect();
  store.dispatch(removeSources(providerName));
  delete managers[providerName];
};

export const normalizeKey = (key) => {
  return key
    .split('/')
    .map(keyPart => camelCase(keyPart))
    .join('/');
};

class SourceManager {

  constructor(providerType, providerName, settings) {
    this.providerName = providerName;
    this.provider = addProvider(
      providerType, providerName, settings
    );
    this.sourceUpdates = {};

    this.provider.updateFromProvider(this.updateSource.bind(this));

    this.interval = setInterval(this._sendUpdates.bind(this), 100);
  }

  disconnect() {
    clearTimeout(this.interval);
  }

  updateSource(key, {value, type, name }) {
    if (this.sourceUpdates[key] === undefined) {
      this.sourceUpdates[key] = {
        first: { value, type, name }
      };
    }
    else {
      this.sourceUpdates[key].last = {
        value, type, name
      };
    }
  }

  getSource(key = '') {
    let sourcesRoot = dashboard.store.getState().sources[this.providerName];

    if (typeof sourcesRoot === 'undefined') {
      return null;
    }

    const keyParts = normalizeKey(key).split('/');
  
    let sources = sourcesRoot.__sources__;
  
    for (let index in keyParts) {
      const keyPart = keyParts[index];
  
      if (keyParts.length - 1 === parseInt(index)) {
        return (keyPart in sources) ? sources[keyPart] : null;
      }
  
      if (keyPart in sources) {
        sources = sources[keyPart].__sources__;
      } else {
        return null;
      }
    }
  
    return null;
  }

  _sendUpdates() {

    if (Object.keys(this.sourceUpdates).length === 0) {
      return;
    }
    // send first updates then last
    const firstUpdates = {};
    const lastUpdates = {};
    forEach(this.sourceUpdates, (values, key) => {
      firstUpdates[key] = values.first;
      if ('last' in values)
        lastUpdates[key] = values.last;
    });
    store.dispatch(sourcesChanged(this.providerName, firstUpdates));
    if (Object.keys(lastUpdates).length > 0) {
      store.dispatch(sourcesChanged(this.providerName, lastUpdates));
    }
  
    this.sourceUpdates = {};
  }
}