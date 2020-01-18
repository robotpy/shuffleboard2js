import store from "./redux/store";
import { sourcesChanged } from './redux/actions';
import { forEach, camelCase } from 'lodash';

let sourceUpdates = {};

export const updateSource = (key, { value, type, name }) => {

  if (sourceUpdates[key] === undefined) {
    sourceUpdates[key] = {
      first: { value, type, name }
    };
  }
  else {
    sourceUpdates[key].last = {
      value, type, name
    };
  }
}

export const normalizeKey = (key) => {
  return key
    .split('/')
    .map(keyPart => camelCase(keyPart))
    .join('/');
};

export const getSource = (key = '') => {
  const { sources } = dashboard.store.getState();
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
};


// Sending NetworkTable updates too quickly causes the dashboard to freeze.
// Send them in batches every 100ms
setInterval(() => {
  if (Object.keys(sourceUpdates).length === 0) {
    return;
  }
  // send first updates then last
  const firstUpdates = {};
  const lastUpdates = {};
  forEach(sourceUpdates, (values, key) => {
    firstUpdates[key] = values.first;
    if ('last' in values)
      lastUpdates[key] = values.last;
  });
  store.dispatch(sourcesChanged(firstUpdates));
  if (Object.keys(lastUpdates).length > 0) {
    store.dispatch(sourcesChanged(lastUpdates));
  }

  sourceUpdates = {};
}, 100);