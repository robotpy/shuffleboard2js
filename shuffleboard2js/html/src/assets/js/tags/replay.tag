
<replay>
  
  <button type="button" 
          class="btn btn-secondary btn-sm" 
          disabled={!opts.recording}
          if={opts.recordingStopped} 
          onclick={startRecording}>
    <span class="oi oi-media-record"></span>
  </button>

  <button type="button" 
          class="btn btn-secondary btn-sm" 
          disabled={!opts.recording}
          if={!opts.recordingStopped} 
          onclick={stopRecording}>
    <span class="oi oi-media-stop"></span>
  </button>

  <div class="btn-group" role="group" aria-label="Basic example">
    <button type="button" class="btn btn-secondary btn-sm" disabled={!opts.replaying} onclick={onSkipBackward}>
      <span class="oi oi-media-skip-backward"></span>
    </button>

    <button type="button" 
            class="btn btn-secondary btn-sm" 
            disabled={!opts.replaying}
            if={opts.replayingPaused}
            onclick={resumeReplay}>
      <span class="oi oi-media-play"></span>
    </button>

    <button type="button" 
            class="btn btn-secondary btn-sm" 
            disabled={!opts.replaying}
            if={!opts.replayingPaused}
            onclick={pauseReplay}>
      <span class="oi oi-media-pause"></span>
    </button>

    <button type="button" class="btn btn-secondary btn-sm" disabled={!opts.replaying} onclick={stopReplay}>
      <span class="oi oi-media-stop"></span>
    </button>

    <button type="button" class="btn btn-secondary btn-sm" disabled={!opts.replaying} onclick={onSkipForward}>
      <span class="oi oi-media-skip-forward"></span>
    </button>
  </div>

  <input type="range" class="video-time" ref="videoTime"
         name="video-time" min="0" max="1" 
         value="0" step=".01" disabled={!opts.replaying} onmousedown={onTimeSliderSelect} onchange={onVideoTimeChange} />

  <div class="form-check loop">
    <input class="form-check-input" 
           type="checkbox" 
           checked={opts.loop} 
           id="defaultCheck1" 
           disabled={!opts.replaying}
           onchange={onLoopChange}>
    <label class="form-check-label" for="defaultCheck1">
      Loop
    </label>
  </div>

  <style>
    .btn {
      height: 30px;
    }

    replay {
      display: flex;
      margin-right: 30px;
      justify-content: flex-end;
    }

    replay > button {
      margin-right: 5px;
    }

    .video-time {
      margin-left: 10px;
    }

    .loop {
      margin-left: 15px;
    }
  </style>

  <script>

    this.isRecording = true;

    this.isPlaying = false;

    dashboard.events.on('loadReplay', () => {
      $(this.refs.videoTime).val(0);
    });


    setInterval(() => {
      const state = dashboard.store.getState();

      if (state.replay.state !== 'REPLAYING') {
        return;
      }

      const recordingLength = state.replay.recordingLength;
      let recordingTime = this.refs.videoTime.value * recordingLength + .1;
      
      if (state.replay.loopRecord && recordingTime > (recordingLength + .05)) {
        recordingTime = 0;
      }

      $(this.refs.videoTime).val(recordingTime / recordingLength);      
      this.goToTime(recordingTime / recordingLength);

    }, 100);

    this.onTimeSliderSelect = (ev) => {
      this.pauseReplay();
    };

    this.onVideoTimeChange = (ev) => {
      this.goToTime(ev.target.value);
    };

    this.onSkipBackward = (ev) => {
      this.pauseReplay();
      const state = dashboard.store.getState();
      const recordingLength = state.replay.recordingLength;
      const recordingTime = Math.max(0, this.refs.videoTime.value * recordingLength - 5);
      $(this.refs.videoTime).val(recordingTime / recordingLength);
      this.goToTime(recordingTime);
    };

    this.onSkipForward = (ev) => {
      this.pauseReplay();
      const state = dashboard.store.getState();
      const recordingLength = state.replay.recordingLength;
      const recordingTime = Math.min(recordingLength, this.refs.videoTime.value * recordingLength  + 5);
      $(this.refs.videoTime).val(recordingTime / recordingLength);
      this.goToTime(recordingTime);
    };

    this.onLoopChange = (ev) => {
      this.setLooping(ev.target.checked);
    };

    this.mapStateToOpts = (state) => {

      return {
        recording: state.replay.state.startsWith('RECORDING'),
        recordingStopped: state.replay.state.endsWith('STOPPED'),
        replaying: state.replay.state.startsWith('REPLAYING'),
        replayingPaused: state.replay.state.endsWith('PAUSED'),
        state: state.replay.state,
        loop: state.replay.loopRecord
      };
    };

    this.mapDispatchToMethods = {
      stopRecording: dashboard.actions.stopRecording,
      startRecording: dashboard.actions.startRecording,
      resumeReplay: dashboard.actions.resumeReplay,
      pauseReplay: dashboard.actions.pauseReplay,
      goToTime: dashboard.actions.goToTime,
      stopReplay: dashboard.actions.stopReplay,
      loadReplay: dashboard.actions.loadReplay,
      setLooping: dashboard.actions.setLooping
    };

    this.reduxConnect(this.mapStateToOpts, this.mapDispatchToMethods);

  </script>
</replay>