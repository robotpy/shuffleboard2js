import { LitElement, html, css } from 'lit-element';
import { map } from 'lodash';

class LoadRecordingModal extends LitElement {

  static get styles() {
    return css`
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
    `;
  }

  static get properties() { 
    return {
      recordings: { type: Object },
    }
  }

  constructor() {
    super();
    this.recordings = {};
    this.modal = null;
  }

  onToggleCollapse(ev) {
    $(ev.target).parents('.folder').toggleClass('collapsed');
  }

  onFileSelect(ev) {
    $(this.shadowRoot).find('.file').removeClass('selected');
    $(ev.target).addClass('selected');
    const loadButton = this.shadowRoot.getElementById('loadButton');
    $(loadButton).prop('disabled', false);
  }

  async onLoad(ev) {
    let file = $(this.shadowRoot).find('.file.selected').data('file');
    const recording = await dashboard.recorder.getRecording(file);
    this.loadReplay(recording);
    this.modal.close();
  };

  close() {
    this.modal.close();
  }

  firstUpdated() {
    this.modal = $(this).parents('dashboard-modal').get(0);
  }

  render() {
    return html`
      ${includeStyles()}
      <div class="modal-body">
        ${map(this.recordings, (files, folder) => html`
          <div class="folder collapsed">
            <span class="folder-label" @click="${this.onToggleCollapse}">
              <span class="oi oi-caret-right"></span>
              <span class="oi oi-caret-bottom"></span>
              <span class="oi oi-folder"></span>
              ${folder}
            </span>
            ${map(files, file => html`
              <div class="file" data-file="${folder + '/' + file}" @click="${this.onFileSelect}">
                <span class="oi oi-file"></span>
                ${file}
              </div>
            `)}
          </div>
        `)}
      </div>

      <div class="modal-footer">
        <button type="button" id="loadButton" class="btn btn-primary" @click="${this.onLoad}" disabled>
          Load
        </button>
        <button type="button" class="btn btn-secondary" @click="${this.close}">Cancel</button>
      </div>
    `;
  }
}

customElements.define('load-recording-modal', LoadRecordingModal);