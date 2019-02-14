import axios from 'axios';

export default class Recorder {

  constructor(store) {
    this.store = store;
    this.prevReplayState = this.replayState;
    this.recording = this.createNewRecording();

    this.store.subscribe(() => {
      if (this.replayState !== this.prevReplayState) {
        
        // If we just started recording create a new recording
        if (this.isRecording) {
          this.recording = this.createNewRecording();
        }

        // If we just stopped recording save the replay
        if (this.replayState === 'RECORDING_STOPPED') {
          this.saveRecording();
        }

        this.prevReplayState = this.replayState;
      }
    });
  }

  createNewRecording() {
    const state = this.store.getState();

    return {
      start: Date.now(),
      networktablesStart: {
        values: state.networktables.values,
        rawValues: state.networktables.rawValues,
      },
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
      key: action.payload.key,
      value: action.payload.value
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

  get isRecording() {
    return this.replayState === 'RECORDING';
  }
}