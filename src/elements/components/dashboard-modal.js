import { LitElement, html, css } from 'lit-element';
import '@vaadin/vaadin-dialog';

class DashboardModal extends LitElement {

  static get properties() { 
    return {
      title: { type: String }
    }
  }

  constructor() {
    super();
    this.title = '';
    this.modalNode = null;
    this.slotNode = null;
    this.onOpenCallbacks = [];
    this.onCloseCallbacks = [];
  }

  static get styles() {
    return css`
      .modal-dialog {
        z-index: 1000000;
      }
    `;
  }

  open() {
    this.modalNode.opened = true;
  }

  close() {
    this.modalNode.opened = false;
  }

  isOpen() {
    return this.modalNode.opened;
  }

  onShow(callback) {
    this.onOpenCallbacks.push(callback);
  }

  onShown(callback) {
    this.onOpenCallbacks.push(callback);
  }

  onHide(callback) {
    this.onCloseCallbacks.push(callback);
  }

  onHidden(callback) {
    this.onCloseCallbacks.push(callback);
  }

  firstUpdated() {
    this.modalNode = this.shadowRoot.getElementById('dashboard-modal');
    this.slotNode = this.shadowRoot.getElementById('slot');

    this.modalNode.renderer = (root, dialog) => {
      this.slotNode.assignedElements().forEach(element => {
        root.appendChild(element);
      });
    };
  }

  openChanged(ev) {
    const opened = ev.detail.value;
    if (opened) {
      this.onOpenCallbacks.forEach(callback => callback());
    }
    else {
      this.onCloseCallbacks.forEach(callback => callback());
    }
  }

  render() {
    return html`
      <vaadin-dialog id="dashboard-modal" @opened-changed="${this.openChanged}"> 
        <slot id="slot"></slot>
      </vaadin-dialog>
    `;
  }

}

customElements.define('dashboard-modal', DashboardModal);