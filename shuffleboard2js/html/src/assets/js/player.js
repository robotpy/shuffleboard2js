
import * as actions from './actions';
import _ from 'lodash';

export default class Player {

  constructor(store, recording) {
    this.store = store;
    this.recording = recording;
    this.recordingTime = 0;
    this.lastUpdateIndex = -1;

    if (recording.updates.length > 0) {
      this.recordingLength = Math.max(recording.updates[recording.updates.length - 1].time, .01);
    }
    else {
      this.recordingLength = .01;
    }
  }

  goToTime(time) {

    // Initialize recording
    if (this.recordingTime === 0 && time > 0 || time < this.recordingTime) {
      console.log('init recording');
      this.initializeRecording();
    }

    // If time has advanced forward play every update between the index of
    // the last update and the update which has a greater time than the time
    // we're going to
    if (this.recordingTime < time) {
      for (let i = this.lastUpdateIndex + 1; i < this.recording.updates.length; i++) {
        let update = this.recording.updates[i];

        if (update.time > time) {
          break;
        }
        else {
          this.lastUpdateIndex = i;
          this.update(update.key, update.value);
        }
      }
    }

    // If time has gone back play every update between 0 and the update
    // which has a greater time than the time we're going to
    if (time < this.recordingTime) {

      this.lastUpdateIndex = 0;

      for (let i = 0; i < this.recording.updates.length; i++) {
        let update = this.recording.updates[i];

        if (update.time > time) {
          break;
        }
        else {
          this.lastUpdateIndex = i;
          this.update(update.key, update.value);
        }
      }
    }


    this.recordingTime = time;
  }

  initializeRecording() {
    this.store.dispatch(actions.initNetworktTables());
    _.forEach(this.recording.networktablesInit, (ntValue, ntKey) => {
      this.update(ntKey, ntValue);
    });
  } 

  update(ntKey, ntValue) {
    this.store.dispatch(actions.ntValueChanged(ntKey, ntValue));
  }


}