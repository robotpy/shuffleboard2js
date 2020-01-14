import { LitElement, html, css } from 'lit-element';
import fileImage from 'open-iconic/png/file-8x.png';

class WidgetMenuItem extends LitElement {

  static get styles() {
    return css`
      h5 {
        margin-bottom: 0;
        margin-top: 10px;
      }

      img {
        display: block;
        width: 100%;
        max-width: 250px;
        max-height: 250px;
      }
    `;
  }

  static get properties() { 
    return {
      type: { type: String },
      label: { type: String },
      image: { type: String },
      minx: { type: Number },
      miny: { type: Number }
    }
  }

  constructor() {
    super();
    this.dragImg = document.createElement("img");
    this.dragImg.src = fileImage;
  }

  addWidget(x, y, config) {
    let widgetTabsElement = document.getElementsByTagName('widget-tabs')[0]; 
    let widgetTabs = widgetTabsElement._tag;
    let widgets = widgetTabs.getActiveWidgetTab();
    widgets.addWidget(x, y, config);
  }

  onDragStart(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
    ev.dataTransfer.setDragImage(this.dragImg, 0, 0);
  };

  onDragEnd(ev) {
    this.addWidget(ev.clientX, ev.clientY, {
      type: this.type,
      minX: this.minx,
      minY: this.miny
    });
  };

  render() {
    return html`
      <div @dragstart="${this.onDragStart}" @dragend="${this.onDragEnd}" draggable="true">
        <img src="${this.image || 'unknown'}" draggable="false" />
      </div>
      <h5>${this.label}</h5>
    `;
  }
}

customElements.define('widget-menu-item', WidgetMenuItem);