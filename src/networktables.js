import * as actions from './redux/actions';
import _ from 'lodash';

export default class NetworkTablesWrapper {

  constructor(store) {
    this.store = store;
    this.ntUpdates = {};

    // sets a function that will be called when the robot connects/disconnects
    NetworkTables.addRobotConnectionListener((connected) => {
      this.store.dispatch(actions.ntRobotConnectionChanged(connected));
    }, true);

    // sets a function that will be called when any NetworkTables key/value changes
    NetworkTables.addGlobalListener((key, value, isNew) => {
      if (this.ntUpdates[key] === undefined) {
        this.ntUpdates[key] = {
          first: value
        };
      }
      else {
        this.ntUpdates[key].last = value;
      }
    }, true);

    // Sending NetworkTable updates too quickly causes the dashboard to freeze.
    // Send them in batches every 100ms
    setInterval(() => {
      if (Object.keys(this.ntUpdates).length === 0) {
        return;
      }
      // send first updates then last
      const firstUpdates = {};
      const lastUpdates = {};
      _.forEach(this.ntUpdates, (values, key) => {
        firstUpdates[key] = values.first;
        if ('last' in values)
          lastUpdates[key] = values.last;
      });
      this.store.dispatch(actions.ntValueChanged(firstUpdates));
      if (Object.keys(lastUpdates).length > 0)
        this.store.dispatch(actions.ntValueChanged(lastUpdates));

      this.ntUpdates = {};
    }, 100);
  }
} 

export function getSubtable(root) {
  let rawValues = dashboard.store.getState().networktables.rawValues;

  let ntKeys = Object.keys(rawValues).filter(key => {
    if (key === root) {
      return true;
    }
    else if (root.endsWith('/')) {
      return key.startsWith(root);
    }
    else {
      return false;
    }
  });

  if (ntKeys.length === 0) {
    return null;
  }

  if (ntKeys.length === 1) {
    return rawValues[ntKeys];
  }
  else {
    let value = _.pick(rawValues, ntKeys);
    return _.mapKeys(value, (value, key) => {
      return key.substring(root.length);
    });
  }
}

export function getTypes(key) {

  if (!key) {
    return [];
  }

  // Check if this is a camera source
  if (isCameraSource(key)) {
    return ['Camera', 'Subtable'];
  }

  // Check if value has a primitive or array type
  let value = NetworkTables.getValue(key, null);

  if (_.isArray(value)) {
    return ['array'];
  }
  else if (!_.isNull(value)) {
    return [typeof value];
  }

  // If it doesn't end with a / then it's not a subtable and it doesn't have a .type
  if (!key.endsWith('/')) {
    return null;
  }

  // Check if value has .type
  let type = NetworkTables.getValue(key + '.type');

  if (type) {
    return [type, 'Subtable'];
  }

  // If there are any keys that start with the passed in key then it's a subtable
  let allKeys = NetworkTables.getKeys();

  for (let i = 0; i < allKeys.length; i++) {
    if (allKeys[i].startsWith(key)) {
      return ['Subtable'];
    }
  }

  // Nothing in subtable, so return empty array of types
  return [];
}

function isCameraSource(key) {

  if (!key.startsWith('/CameraPublisher')) {
    return false;
  }

  // check if it's an array type
  let value = NetworkTables.getValue(key + 'streams', null);

  return _.isArray(value);
}