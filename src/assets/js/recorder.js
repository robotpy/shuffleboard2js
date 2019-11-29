import axios from 'axios';
import Player from './player';
import * as actions from './actions';

export default class Recorder {

  constructor(store) {
    this.store = store;
    this.prevReplayState = this.replayState;
    this.recording = this.createNewRecording();
    this.player = null;

    dashboard.events.on('loadReplay', () => {
      let state = this.store.getState();
      this.player = new Player(this.store, state.replay.recording);
    });

    setInterval(() => {
      let state = this.store.getState();

      if (this.player) {
        this.player.goToTime(state.replay.recordingTime);
      }
    }, 100);

    this.store.subscribe(() => {

      let state = this.store.getState();

      if (this.replayState !== this.prevReplayState) {
        
        // If we just started recording create a new recording
        if (this.isRecording) {
          this.recording = this.createNewRecording();
        }

        // If we just stopped recording save the replay
        if (this.wasRecording) {
          this.saveRecording();
        }

        // If we just stopped replaying reinit networktables
        if ((this.wasReplaying || this.wasReplayingPaused) && this.isRecording) {
          this.prevReplayState = this.replayState;
          NetworkTables.getKeys().forEach(ntKey => {
            let ntValue = NetworkTables.getValue(ntKey);
            this.store.dispatch(actions.ntValueChanged(ntKey, ntValue));
          });
        }
      }

      this.prevReplayState = this.replayState;
    });
  }

  createNewRecording() {
    const state = this.store.getState();

    return {
      start: Date.now(),
      networktablesInit: state.networktables.rawValues,
      updates: []
    }
  }

  recordAction(action) {

    if (!this.isRecording) {
      return;
    }

    const time = (Date.now() - this.recording.start) / 1000;
    this.recording.updates.push({
      time,
      valueChanges: action.payload.valueChanges
    });
  }

  async saveRecording() {
    try {
      let l = window.location;
      let port = process.env.socket_port || l.port;
      let url = "http://" + l.hostname + ":" + port + "/api/recording/save";
      const response = await axios.post(url, this.recording);
      return response;
    }
    catch(e) {
      console.error('error', e);
      return [];
    }
  }

  async getRecordings() {
    try {
      let l = window.location;
      let port = process.env.socket_port || l.port;
      let url = "http://" + l.hostname + ":" + port + "/api/recordings";
      const response = await axios.get(url);
      return response.data;
    }
    catch(e) {
      console.error('error', e);
      return {};
    }
  }

  async getRecordings() {
    try {
      let l = window.location;
      let port = process.env.socket_port || l.port;
      let url = "http://" + l.hostname + ":" + port + "/api/recordings";
      const response = await axios.get(url);
      return response.data;
    }
    catch(e) {
      console.error('error', e);
      return [];
    }
  }

  async getRecording(file) {
    try {
      let l = window.location;
      let port = process.env.socket_port || l.port;
      let url = "http://" + l.hostname + ":" + port + "/user/recordings/" + file;
      const response = await axios.get(url);
      return response.data;
    }
    catch(e) {
      console.error('error', e);
      return [];
    }
  }

  get replayState() {
    const state = this.store.getState();
    return state.replay.state;
  }

  get wasRecording() {
    return this.prevReplayState === 'RECORDING';
  }

  get wasRecordingStopped() {
    return this.prevReplayState === 'RECORDING_STOPPED';
  }

  get wasReplaying() {
    return this.prevReplayState === 'REPLAYING';
  }

  get wasReplayingPaused() {
    return this.prevReplayState === 'REPLAYING_PAUSED';
  }

  get isRecording() {
    return this.replayState === 'RECORDING';
  }

  get isRecordingStopped() {
    return this.replayState === 'RECORDING_STOPPED';
  }

  get isReplaying() {
    return this.replayState === 'REPLAYING';
  }

  get isReplayingPaused() {
    return this.replayState === 'REPLAYING_PAUSED';
  }
}