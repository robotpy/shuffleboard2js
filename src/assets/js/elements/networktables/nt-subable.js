import { LitElement, html } from 'lit-element';
import { ntStyles, ntSubtableStyles } from './networktables-styles';
import { range, isPlainObject, isArray, map } from 'lodash';
import fileImage from 'open-iconic/png/file-8x.png';
import { includeStyles } from '../../render-utils';
import { getTypes, getDefaultWidgetConfig } from 'assets/js/networktables';

class NtSubtable extends LitElement {

  static get styles() {
    return [ntStyles, ntSubtableStyles];
  }

  static get properties() {
    return {
      values: { type: Object },
      ntKey: { type: String },
      keyLabel: { type: String },
      level: { type: Number }
    };
  }

  constructor() {
    super();
    this.values = {};
    this.dragImg = document.createElement("img");
    this.dragImg.src = fileImage;
    this.expanded = false;
    this.level = 0;
  }

  getWidgets(x, y) {
    let widgetTabsElement = document.getElementsByTagName('widget-tabs')[0]; 
    let widgetTabs = widgetTabsElement._tag;
    let widgets = widgetTabs.getActiveWidgetTab();
    return widgets.getWidgets(x, y);
  };

  addWidget(x, y, config) {
    let widgetTabsElement = document.getElementsByTagName('widget-tabs')[0]; 
    let widgetTabs = widgetTabsElement._tag;
    let widgets = widgetTabs.getActiveWidgetTab();
    return widgets.addWidget(x, y, config);
  }

  addDragImage(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
    ev.dataTransfer.setDragImage(this.dragImg, 0, 0);
  }

  addNtSource(ev, ntKey) {
    const ntTypes = getTypes(ntKey);
    const ntType = _.first(ntTypes);

    let dragEndPosition = this.getDragEndPosition(ev);

    let widgets = this.getWidgets(dragEndPosition.x, dragEndPosition.y);

    widgets.forEach(widget => {
      
      if (widget.setNtRoot(ntKey)) {
        dashboard.toastr.success(`Successfully added source '${ntKey}'`);
      }
      else {
        const widgetConfig = widget.getConfig();
        dashboard.toastr.error(`Widget of type '${widgetConfig.label}' doesn't accept type 
                                '${ntType}'. Accepted types are '${widgetConfig.acceptedTypes.join(', ')}'`);
      }
    });

    // Send notification if setting widget failed
    if (widgets.length === 0) {

      const widgetConfig = getDefaultWidgetConfig(ntType);

      if (widgetConfig) {
        const widget = this.addWidget(dragEndPosition.x, dragEndPosition.y, {
          type: widgetConfig.type,
          minX: widgetConfig.minX,
          minY: widgetConfig.minY
        });

        widget.setNtRoot(ntKey);
        dashboard.toastr.success(`Successfully added source '${ntKey}' to widget of type '${widgetConfig.label}'.`);
      }
      else {
        dashboard.toastr.error(`Failed to add source '${ntKey}'. No widget that accepts type '${ntType}' could be found.`);
      }
    }
  }

  getDragEndPosition(ev) {

    const scrollLeft = $(window).scrollLeft();
    const scrollTop = $(window).scrollTop();

    return {
      x: ev.screenX - scrollLeft - window.screenX,
      y: ev.screenY - scrollTop - window.screenY
    }
  };

  toggleExpand() {
    this.expanded = !this.expanded;
    this.requestUpdate();
  }

  render() {
    return html`
      ${includeStyles()}
      <div class="wrapper ${this.expanded ? 'expanded' : 'collapsed'}">
        <div 
          class="table-row subtable-header" 
          draggable="true"
          @dragstart="${this.addDragImage}"
          @dragend="${(ev) => this.addNtSource(ev, this.ntKey)}"
        >
          <span class="row-item key">
            ${range(this.level).map(() => html`
              <span class="level-space"></span>
            `)}
            <span class="caret" @click="${this.toggleExpand}">
              <span class="oi oi-caret-right"></span>
              <span class="oi oi-caret-bottom"></span>
            </span>
            ${this.keyLabel}
          </span>
          <span class="row-item value"></span>
        </div>
        ${map(this.values, (value, key) => html`
          

          ${isPlainObject(value) ? html`
            <nt-subtable 
              level="${this.level + 1}"
              ntKey="${this.ntKey + key + '/'}"
              keyLabel="${key}"
              .values="${value}"
            >
            </nt-subtable>
          `: ''}

          ${isArray(value) ? html`
            <div 
              class="table-row" 
              draggable="true"
              @dragstart="${this.addDragImage}"
              @dragend="${(ev) => this.addNtSource(ev, this.ntKey + key.replace('/', ''))}"
            >
              <span class="row-item key">
                ${range(this.level + 1).map(() => html`
                  <span class="level-space"></span>
                `)}
                ${key.replace('/', '')}
              </span>
              <span class="row-item value array">
                [${value.join(', ')}]
              </span>
            </div>
          `: ''}

          ${typeof value !== 'object' ? html`
            <div 
              class="table-row" 
              draggable="true"
              @dragstart="${this.addDragImage}"
              @dragend="${(ev) => this.addNtSource(ev, this.ntKey + key.replace('/', ''))}"
            >
              <span class="row-item key">
                ${range(this.level + 1).map(value => html`
                  <span class="level-space"></span>
                `)}
                ${key.replace('/', '')}
              </span>
              <span class="row-item value">

                ${typeof value === 'boolean' ? html`
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      disabled 
                      type="checkbox" 
                      ?checked="${value}" 
                      value="${this.ntKey + key.replace('/', '')}" 
                      id="${this.ntKey + key.replace('/', '')}"
                    />
                    <label class="form-check-label" for={opts.ntKey + key.replace('/', '')}>
                      ${value.toString()}
                    </label>
                  </div>
                `: ''}
      

                ${typeof value === 'string' ? html`
                  ${value}
                `: ''}

                ${typeof value === 'number' ? html`
                  ${value}
                `: ''}
              </span>
            </div>
          `: ''}
        `)}
      </div>
    `;
  }

}

customElements.define('nt-subtable', NtSubtable);