import { LitElement, html, css } from 'lit-element';
import { map } from 'lodash';
import fileImage from 'open-iconic/png/file-8x.png';

class SourceView extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
      }
      
      header {
        border-bottom: 1px solid rgb(187, 187, 187);
        padding: 3px 0;
        display: flex;
        justify-content: space-around;
      }

      header:hover {
        background-color: #6495ed;
      }

      header .key {
        width: 55%;
        display: flex;
        white-space: nowrap;
      }

      header .value {
        width: 38%;
        overflow: auto;
        white-space: nowrap;
        display: inline-block;
      }

      header .key, header .value {
        box-sizing: border-box;
      }

      header .value {
        overflow: auto;
      }

      header .key .caret + label {
        padding-left: 3px;
      }

      header .key label {
        overflow: auto;
        white-space: nowrap;
        text-overflow: clip;
        padding-left: 8px;
      }

      header .key label::-webkit-scrollbar { 
        width: 0 !important;
        height: 0 !important;
      }

      header .value::-webkit-scrollbar { 
        width: 0 !important;
        height: 0 !important;
      }


      header .key {
        padding-left: var(--header-key-padding-left);
      }

      header .caret [icon] {
        cursor: pointer;
        font-size: 12px;
        display: none;
        width: 17px;
      }

      header.expanded .caret [icon$="caret-down"] {
        display: inline-block;
      }

      header.collapsed .caret [icon$="caret-right"] {
        display: inline-block;
      }
    `;
  }

  static get properties() {
    return {
      label: { type: String },
      providerName: { type: String, attribute: 'provider-name' },
      source: { type: Object },
      level: { type: Number }
    };
  }

  constructor() {
    super();
    this.dragImg = document.createElement("img");
    this.dragImg.src = fileImage;
    this.expanded = false;
    this.label = '';
    this.providerName = '';
    this.source = {};
    this.level = 0;
  }

  addDragImage(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
    ev.dataTransfer.setDragImage(this.dragImg, 0, 0);

    const event = new CustomEvent('source-drag', {
      bubbles: true,
      composed: true
    });

    this.dispatchEvent(event);
  }

  addSource() {
    const sourceKey = this.source.__key__;
    const sourceType = this.source.__type__;

    if (typeof sourceKey !== 'string') {
      return;
    }

    const event = new CustomEvent('source-add', {
      bubbles: true,
      composed: true, 
      detail: {
        providerName: this.providerName,
        key: sourceKey,
        type: sourceType
      }
    });

    this.dispatchEvent(event);
  }

  toggleExpand() {
    this.expanded = !this.expanded;
    this.requestUpdate();
  }

  hasSources() {
    const sources = this.source.__sources__;
    return sources && Object.keys(sources).length  > 0;
  }

  hasValue() {
    const value = this.source.__value__;
    return typeof value !== 'undefined';
  }

  firstUpdated() {
    const headerNode = this.shadowRoot.querySelector('header');
    headerNode.style.setProperty(
      '--header-key-padding-left', 
      `${12 * this.level}px`
    );
  }

  renderValue() {
    const type = this.source.__type__;
    const value = this.source.__value__;

    if (type === 'Boolean') {
      return html`
        <input disabled type="checkbox" ?checked="${value}" />
        <label>${value.toString()}</label>
      `;
    } else if (type === 'String') {
      return html`
        "${value}"
      `;
    } else if (type === 'Number') {
      return html`
        ${value}
      `;
    } else if (type === 'Array') {
      return html`
        [${value.join(', ')}]
      `;
    }

    return html``;
  }

  render() {

    return html`
      <div 
        class="source" 
        draggable="true"
        @dragstart="${this.addDragImage}"
        @dragend="${this.addSource}"
      >
        <header class="${this.expanded ? 'expanded' : 'collapsed'}">
          <span class="key">
            ${this.hasSources() ? html`
              <span class="caret" @click="${this.toggleExpand}">
                <iron-icon icon="vaadin:caret-right"></iron-icon>
                <iron-icon icon="vaadin:caret-down"></iron-icon>
              </span>
            `: ''}
            <label>${this.label}</label>
          </span>
          <span class="value">
            ${this.hasValue() ? this.renderValue() : ''}
          </span>
        </header>
        ${this.hasSources() && this.expanded ? html`
          <div class="sources">
            ${map(this.source.__sources__, (source, name) => html`
              <source-view 
                label="${name}" 
                .source="${{...source}}"
                level="${this.level + 1}"
                provider-name="${this.providerName}"
              >
              </source-view>
            `)}
          </div>
        ` : ''}
      </div>
    `;
  }

}

customElements.define('source-view', SourceView);