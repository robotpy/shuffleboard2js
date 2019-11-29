import { LitElement, html, css } from 'lit-element';

class DashboardModal extends LitElement {

  static get properties() { 
    return {
      title: { type: String }
    }
  }

  constructor() {
    super();
    this.title = '';
    this.$modal = null;
  }

  static get styles() {
    return css`
      .modal-dialog {
        z-index: 1000000;
      }
    `;
  }

  open() {
    this.$modal.modal('show');
  }

  close() {
    this.$modal.modal('hide');
  }

  isOpen() {}

  onShow(callback) {
    this.$modal.on('show.bs.modal', callback);
  }

  onShown(callback) {
    this.$modal.on('shown.bs.modal', callback);
  }

  onHide(callback) {
    this.$modal.on('hide.bs.modal', callback);
  }

  onHidden(callback) {
    this.$modal.on('hidden.bs.modal', callback);
  }

  firstUpdated() {
    this.$modal = $(this.shadowRoot.getElementById('dashboard-modal'));
    this.$modal.modal({
      keyboard: false,
      show: false,
    });


    this.$modal.on('show.bs.modal', () => {
      $(this).children().appendTo(this.shadowRoot.getElementById('slot'));
    });
  }

  render() {
    return html`
      ${includeStyles()}
      <div id="dashboard-modal" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${this.title}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <slot id="slot"></slot>
          </div>
        </div>
      </div>
    `;
  }

}

customElements.define('dashboard-modal', DashboardModal);