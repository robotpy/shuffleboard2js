import * as actions from './actions';
import _ from 'lodash';

export default class NetworkTablesWrapper {

  constructor(store) {
    this.store = store;
    this.ntUpdates = {};

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
      this.ntUpdates[key] = value;
    }, true);

    // Sending NetworkTable updates too quickly causes the dashboard to freeze.
    // Send them in batches every 100ms
    setInterval(() => {
      // Don't dispatch networktables values if currently replaying
      if (!this.isReplaying && !this.isReplayingPaused) {
        this.store.dispatch(actions.ntValueChanged(this.ntUpdates));
        this.ntUpdates = {};
      }
    }, 100);
  }

  get replayState() {
    const state = this.store.getState();
    return state.replay.state;
  }

  get isReplaying() {
    return this.replayState === 'REPLAYING';
  }

  get isReplayingPaused() {
    return this.replayState === 'REPLAYING_PAUSED';
  }

  get isRecording() {
    return this.replayState === 'RECORDING';
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

export function getDefaultWidgetConfig(ntType) {
  let widgetConfigs = dashboard.store.getState().widgets.registered;

  for (let type in widgetConfigs) {
    const config = widgetConfigs[type];
    if (config.defaultsFor.indexOf(ntType) > -1) {
      return {
        type,
        ...config
      };
    }
  }

  // Otherwise look for any widget that does ntType as an accepted type
  for (let type in widgetConfigs) {
    const config = widgetConfigs[type];
    if (config.acceptedTypes.indexOf(ntType) > -1) {
      return {
        type,
        ...config
      };
    }
  }

  return null;
}

function isCameraSource(key) {

  if (!key.startsWith('/CameraPublisher')) {
    return false;
  }

  // check if it's an array type
  let value = NetworkTables.getValue(key + 'streams', null);

  return _.isArray(value);
}