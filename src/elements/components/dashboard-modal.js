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

      // remove previous header and footer
      const prevHeaderNode = root.querySelector('.modal-header');
      if (prevHeaderNode) {
        prevHeaderNode.remove();
      }

      const prevFooterNode = root.querySelector('.modal-footer');
      if (prevFooterNode) {
        prevFooterNode.remove();
      }
      
      // Add header
      const headerNode = document.createElement("header");
      headerNode.classList = "modal-header";
      headerNode.style.display = 'flex';
      headerNode.style.justifyContent = 'space-between';
      headerNode.style.alignItems = 'center';
      headerNode.style.borderBottom = '1px solid #eee';
      headerNode.innerHTML = `
        <h4 style="margin: 0">${this.title}</h4>
        <vaadin-button style="align-self: start;" theme="icon large tertiary" aria-label="Close modal">
          <iron-icon icon="lumo:cross" slot="prefix"></iron-icon>
        </vaadin-button>  
      `;
      const headerCloseButtonNode = headerNode.querySelector('vaadin-button');
      headerCloseButtonNode.addEventListener('click', () => {
        this.close();
      });
      root.prepend(headerNode);

      this.slotNode.assignedElements().forEach(element => {
        root.append(element);
      });

      // Add footer
      const footerNode = document.createElement("footer");
      footerNode.classList = "modal-footer";
      footerNode.style.display = 'flex';
      footerNode.style.justifyContent = 'flex-end';
      footerNode.style.borderTop = '1px solid #eee';
      footerNode.style.paddingTop = '10px';
      footerNode.innerHTML = `
        <vaadin-button aria-label="Close modal">
          Close
        </vaadin-button>  
      `;
      const footerCloseButtonNode = footerNode.querySelector('vaadin-button');
      footerCloseButtonNode.addEventListener('click', () => {
        this.close();
      });
      root.append(footerNode);
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

        <header style="display: flex; justify-content: space-between; align-items: center;">
          <h4>Properties</h4>
          <vaadin-button style="align-self: start;" theme="icon large tertiary" aria-label="Close modal">
            <iron-icon icon="lumo:cross" slot="prefix"></iron-icon>
          </vaadin-button>  
        </header>
        <slot id="slot"></slot>
      </vaadin-dialog>
    `;
  }

}

customElements.define('dashboard-modal', DashboardModal);