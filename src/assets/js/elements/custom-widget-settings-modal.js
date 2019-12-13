import { LitElement, html, css } from 'lit-element';
import { includeStyles } from '../render-utils';
import './components/dashboard-modal';
const dialog = require('electron').remote.dialog;

class CustomWidgetSettingsModal extends LitElement {

  static get properties() {
    return {
      widgetFolder: { type: String }
    }
  }

  constructor() {
    super();
    this.widgetFolder = '';
  }

  static get styles() {
    return css`
      form .form-group label {
        padding-right: 0;
      }
    `;
  }

  async onChangeWidgetFolder() {

    const options = {
      title: 'Select Widget Folder',
      defaultPath: dashboard.storage.getDefaultWidgetFolder(),
      properties: ['openDirectory']
    };

    try {
      const { canceled, filePaths } = await dialog.showOpenDialog(options);
      if (!canceled) {
        dashboard.storage.setDefaultWidgetFolder(filePaths[0]);
        dashboard.toastr.success(`Widget folder changed to ${filePaths[0]}`); 
        window.location.reload();
      }
    }
    catch(e) {
      dashboard.toastr.error(`Failed to change widget folder: ${e.message}`);
    }
  }

  open() {
    const modal = this.shadowRoot.getElementById('modal');
    modal.open();
  }

  close() {
    const modal = this.shadowRoot.getElementById('modal');
    modal.close();
  }

  render() {
    return html`
      ${includeStyles()}
      <dashboard-modal id="modal" title="Custom Widget Settings">
        <div class="modal-body">
          <form>
            <div class="form-group row">
              <label for="widget-folder" class="col-sm-3 col-form-label">Widget Folder</label>
              <div class="col-sm-9">
                <input 
                  type="text" 
                  class="form-control" 
                  id="widget-folder" 
                  value="${this.widgetFolder}"
                  disabled>
              </div>
            </div>
          </form>
          <div class="alert alert-warning" role="alert">
            Changing the custom widget folder will refresh the page. Please save any changes you
            want to keep before you do this!
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="${this.onChangeWidgetFolder}">Change</button>
          <button type="button" class="btn btn-secondary" @click="${this.close}">Cancel</button>
        </div>
      </dashboard-modal>
    `;
  }
}

customElements.define('custom-widget-settings-modal', CustomWidgetSettingsModal);