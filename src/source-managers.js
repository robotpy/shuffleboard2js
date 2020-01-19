import { sourcesChanged } from './redux/actions';
import { forEach, camelCase } from 'lodash';
import { has as hasProvider } from './source-providers'
import store from './redux/store';
import { removeSources } from './redux/actions';

let managers = {};

export const has = (providerName) => {
  return providerName in managers;
};

export const get = (providerName) => {
  return managers[providerName];
};

export const add = (providerName) => {
  if (has(providerName) || !hasProvider(providerName)) {
    return;
  }
  managers[providerName] = new SourceManager(providerName);
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

  constructor(providerName) {
    this.providerName = providerName;
    this.provider = dashboard.sourceProviders.get(providerName);
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
    const sources = dashboard.store.getState().sources[this.providerName];

    if (typeof sources === 'undefined') {
      return null;
    }

    const keyParts = normalizeKey(key).split('/');
  
    let table = sources.__table__;
  
    for (let index in keyParts) {
      const keyPart = keyParts[index];
  
      if (keyParts.length - 1 === parseInt(index)) {
        return (keyPart in table) ? table[keyPart] : null;
      }
  
      if (keyPart in table) {
        table = table[keyPart].__table__;
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