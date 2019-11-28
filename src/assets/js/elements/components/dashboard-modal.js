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
  }

  static get styles() {
    return css`
      .modal-dialog {
        z-index: 1000000;
      }
    `;
  }

  open() {
    const $modal = $(this.shadowRoot.getElementById('modal'));
    $modal.modal('show');
  }

  close() {
    const $modal = $(this.shadowRoot.getElementById('modal'));
    $modal.modal('hide');
  }

  isOpen() {}

  onShow(callback) {
    const $modal = $(this.shadowRoot.getElementById('modal'));
    $modal.on('show.bs.modal', callback);
  }

  onShown(callback) {
    const $modal = $(this.shadowRoot.getElementById('modal'));
    $modal.on('shown.bs.modal', callback);
  }

  onHide(callback) {
    const $modal = $(this.shadowRoot.getElementById('modal'));
    $modal.on('hide.bs.modal', callback);
  }

  onHidden(callback) {
    const $modal = $(this.shadowRoot.getElementById('modal'));
    $modal.on('hidden.bs.modal', callback);
  }

  firstUpdated() {
    const $modal = $(this.shadowRoot.getElementById('modal'));
    $($modal).modal({
      keyboard: false,
      show: false,
      backdrop: false
    });
  }

  render() {
    return html`
      ${includeStyles()}
      <div id="modal" class="modal" tabindex="-1" role="dialog">
        <div class="modal-backdrop show"></div>
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${this.title}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

}

customElements.define('dashboard-modal', DashboardModal);