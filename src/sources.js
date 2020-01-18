import store from "./redux/store";
import { sourcesChanged } from './redux/actions';
import { forEach } from 'lodash';

let sourceUpdates = {};

export const updateSource = (key, { value, type, name }) => {
  //const normalizedKey = normalizeKey(key);
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