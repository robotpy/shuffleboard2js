import * as actions from './actions';
import _ from 'lodash';

export default class NetworkTablesWrapper {

  constructor(store) {
    this.store = store;

    // sets a function that will be called when the websocket connects/disconnects
    NetworkTables.addWsConnectionListener((connected) => {
      this.store.dispatch(actions.ntRobotConnectionChanged(connected));
    }, true);
    
    // sets a function that will be called when the robot connects/disconnects
    NetworkTables.addRobotConnectionListener((connected) => {
      this.store.dispatch(actions.ntWsConnectionChanged(connected));
    }, true);
    
    // sets a function that will be called when any NetworkTables key/value changes
    NetworkTables.addGlobalListener((key, value, isNew) => {
      this.store.dispatch(actions.ntValueChanged(key, value));
    }, true);
  }
} 


export function getSubtable(root) {
  let rawValues = dashboard.store.getState().networktables.rawValues;

  let ntKeys = Object.keys(rawValues).filter(key => {
    return key.startsWith(root);
  });

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

export function getType(key) {

  // Check if value has a primitive or array type
  let value = NetworkTables.getValue(key, null);

  if (_.isArray(value)) {
    return 'array';
  }
  else if (!_.isNull(value)) {
    return typeof value;
  }

  // If it doesn't end with a / then it's not a subtable and it doesn't have a .type
  if (!key.endsWith('/')) {
    return null;
  }

  // Check if value has .type
  let type = NetworkTables.getValue(key + '.type');

  if (type) {
    return type;
  }

  // If there are any keys that start with the passed in key then it's a subtable
  let allKeys = NetworkTables.getKeys();

  for (let i = 0; i < allKeys.length; i++) {
    if (allKeys[i].startsWith(key)) {
      return 'Subtable';
    }
  }

  // Nothing in subtable, so return null
  return null;
}