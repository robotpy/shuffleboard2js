import { LitElement, html, css } from 'lit-element';
import store from '../store';
import { connect } from 'pwa-helpers';
import { includeStyles } from '../render-utils';
import {
  stopRecording,
  startRecording,
  resumeReplay,
  pauseReplay,
  goToTime,
  stopReplay,
  setLooping
} from '../actions';


class AppReplay extends connect(store)(LitElement) {

  static get styles() {
    return css`
      .btn {
        height: 30px;
      }

      .video-time {
        margin-left: 10px;
      }

      .loop {
        margin-left: 15px;
      }
    `;
  }

  static get properties() { 
    return {
      recording: { type: Boolean },
      recordingStopped: { type: Boolean },
      replaying: { type: Boolean },
      replayingPaused: { type: Boolean },
      state: { type: String },
      loop: { type: Boolean }
    };
  }

  onTimeSliderSelect() {
    this.pauseReplay();
  }

  onVideoTimeChange(ev) {
    this.goToTime(ev.target.value);
  }

  onSkipBackward() {
    const videoTime = this.shadowRoot.getElementById('videoTime');
    this.pauseReplay();
    const state = dashboard.store.getState();
    const recordingLength = state.replay.recordingLength;
    const recordingTime = Math.max(0, videoTime.value * recordingLength - 5);
    $(videoTime).val(recordingTime / recordingLength);
    this.goToTime(recordingTime);
  }

  onSkipForward(ev) {
    const videoTime = this.shadowRoot.getElementById('videoTime');
    this.pauseReplay();
    const state = dashboard.store.getState();
    const recordingLength = state.replay.recordingLength;
    const recordingTime = Math.min(recordingLength, videoTime.value * recordingLength  + 5);
    $(videoTime).val(recordingTime / recordingLength);
    this.goToTime(recordingTime);
  }

  onLoopChange(ev) {
    this.setLooping(ev.target.checked);
  }

  stopRecording() {
    store.dispatch(stopRecording());
  }

  startRecording() {
    store.dispatch(startRecording());
  }

  resumeReplay() {
    store.dispatch(resumeReplay());
  }

  pauseReplay() {
    store.dispatch(pauseReplay());
  }

  goToTime(time) {
    store.dispatch(goToTime(time));
  }

  stopReplay() {
    store.dispatch(stopReplay());
  }

  setLooping(flag) {
    store.dispatch(setLooping(flag));
  }

  stateChanged(state) {
    this.recording = state.replay.state.startsWith('RECORDING');
    this.recordingStopped = state.replay.state.endsWith('STOPPED');
    this.replaying = state.replay.state.startsWith('REPLAYING');
    this.replayingPaused = state.replay.state.endsWith('PAUSED');
    this.state = state.replay.state;
    this.loop = state.replay.loopRecord;
  }

  firstUpdated() {
    dashboard.events.on('loadReplay', () => {
      $(this.shadowRoot.getElementById('videoTime')).val(0);
    });

    setInterval(() => {
      const state = dashboard.store.getState();
      const videoTime = this.shadowRoot.getElementById('videoTime');

      if (state.replay.state !== 'REPLAYING') {
        return;
      }

      const recordingLength = state.replay.recordingLength;
      let recordingTime = videoTime.value * recordingLength + .1;
      
      if (state.replay.loopRecord && recordingTime > (recordingLength + .05)) {
        recordingTime = 0;
      }

      $(videoTime).val(recordingTime / recordingLength);      
      this.goToTime(recordingTime / recordingLength);
    }, 100);
  }

  render() {
    return html`
      ${includeStyles()}
      ${this.recordingStopped ? html`
        <button 
          type="button" 
          class="btn btn-secondary btn-sm" 
          ?disabled="${!this.recording}"
          @click="${this.startRecording}"
          style="margin-right: 5px"
        >
          <span class="oi oi-media-record"></span>
        </button>
      ` : html`
        <button 
          type="button" 
          class="btn btn-secondary btn-sm" 
          ?disabled="${!this.recording}"
          @click="${this.stopRecording}"
          style="margin-right: 5px"
        >
          <span class="oi oi-media-stop"></span>
        </button>
      `}
    
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-secondary btn-sm" ?disabled="${!this.replaying}" @click="${this.onSkipBackward}">
          <span class="oi oi-media-skip-backward"></span>
        </button>

        ${this.replayingPaused ? html`
          <button 
            type="button" 
            class="btn btn-secondary btn-sm" 
            ?disabled="${!this.replaying}"
            @click="${this.resumeReplay}"
          >
            <span class="oi oi-media-play"></span>
          </button>
        ` : html`

        `}

        ${!this.replayingPaused && html`
          <button 
            type="button" 
            class="btn btn-secondary btn-sm" 
            ?disabled="${!this.replaying}"
            @click="${this.pauseReplay}"
          >
            <span class="oi oi-media-pause"></span>
          </button>
        `}
        
        <button type="button" class="btn btn-secondary btn-sm" ?disabled="${!this.replaying}" @click="${this.stopReplay}">
          <span class="oi oi-media-stop"></span>
        </button>

        <button type="button" class="btn btn-secondary btn-sm" ?disabled="${!this.replaying}" @click="${this.onSkipForward}">
          <span class="oi oi-media-skip-forward"></span>
        </button>
      </div>

      <input 
        type="range" 
        class="video-time" 
        id="videoTime"
        name="video-time" 
        min="0" 
        max="1" 
        value="0" 
        step=".01" 
        ?disabled="${!this.replaying}" 
        @mousedown="${this.onTimeSliderSelect}" 
        @change="${this.onVideoTimeChange}" 
      />

      <div class="form-check loop">
        <input 
          class="form-check-input" 
          type="checkbox" 
          ?checked="${this.loop}"
          id="defaultCheck1" 
          ?disabled="${!this.replaying}"
          @change="${this.onLoopChange}"
        />
        <label class="form-check-label" for="defaultCheck1">
          Loop
        </label>
      </div>
    `;
  }
}

customElements.define('app-replay', AppReplay);