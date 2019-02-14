
<load-recording-modal>
  <div class="modal-body">
    <div class="folder collapsed" each={files, folder in opts.recordings}>
      <span class="folder-label" onclick={onToggleCollapse}>
        <span class="oi oi-caret-right"></span>
        <span class="oi oi-caret-bottom"></span>

        <span class="oi oi-folder"></span>
        {folder}
      </span>
      <div class="file" each={file in files} data-file={folder + '/' + file} onclick={onFileSelect}>
        <span class="oi oi-file"></span>
        {file}
      </div>
    </div>
  </div>

  <div class="modal-footer">
    <button type="button" ref="loadButton" class="btn btn-primary" onclick={onLoad} disabled>
      Load
    </button>
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
  </div>

  <style>

    .folder {
      margin-bottom: 5px;
    }

    .folder-label {
      cursor: pointer;
    }

    .oi-caret-right, .oi-caret-bottom {
      font-size: 12px;
      margin-right: 10px;
    }

    .oi-caret-right {
      display: none;
    }

    .oi-caret-bottom {
      display: inline-block;
    }

    .collapsed .oi-caret-right {
      display: inline-block;
    }

    .collapsed .oi-caret-bottom {
      display: none;
    }

    .collapsed .file {
      display: none;
    }

    .file {
      padding-left: 60px;
      cursor: pointer;
    }

    .file.selected {
      background: cornflowerblue;
    } 


  </style>

  <script>
    this.onToggleCollapse = (ev) => {
      $(ev.target).parents('.folder').toggleClass('collapsed');
    };

    this.onFileSelect = (ev) => {
      $(this.root).find('.file').removeClass('selected');
      $(ev.target).addClass('selected');
      $(this.refs.loadButton).prop('disabled', false);
    };

    this.onLoad = (ev) => {
      let file = $(this.root).find('.file.selected').data('file');
      dashboard.recorder.getRecording(file)
        .then(recording => {
          this.loadReplay(recording);
          this.opts.modal.close();
        });
    };

    this.mapDispatchToMethods = {
      loadReplay: dashboard.actions.loadReplay,
    };

    this.reduxConnect(null, this.mapDispatchToMethods);

  </script>

</load-recording-modal>