import { LitElement, html, css } from 'lit-element';
import { map, first } from 'lodash';
import store from '../store';
import { connect } from 'pwa-helpers';
import { getSubtable, getTypes } from '../networktables';
import fileImage from 'open-iconic/png/file-8x.png';

class CameraSources extends connect(store)(LitElement) {

  static get styles() {
    return css`
      p {
        margin-bottom: 0;
        padding: 6px 0;
        padding-left: 12px;
        border-bottom: 1px solid #bbb;
      }

      p:hover {
        background: cornflowerblue;
        cursor: pointer;
      }
    `;
  }

  static get properties() {
    return {
      cameras: { type: Array }
    };
  }

  constructor() {
    super();
    this.cameras = [];
    this.dragImg = document.createElement("img");
    this.dragImg.src = fileImage;
  }

  getWidgets(x, y) {
    let widgets = dashboard.widgetTabs.getActiveWidgetTab();
    return widgets.getWidgets(x, y);
  }

  addWidget(x, y, config) {
    let widgets = dashboard.widgetTabs.getActiveWidgetTab();
    return widgets.addWidget(x, y, config);
  }

  onDragStart(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
    ev.dataTransfer.setDragImage(this.dragImg, 0, 0);
  }

  onDragEnd(ev) {
    const ntKey = $(ev.target).attr('data-nt-key');
    const ntTypes = getTypes(ntKey);
    const ntType = first(ntTypes);

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
  };

  getDragEndPosition(ev) {
    const scrollLeft = $(window).scrollLeft();
    const scrollTop = $(window).scrollTop();

    return {
      x: ev.screenX - scrollLeft - window.screenX,
      y: ev.screenY - scrollTop - window.screenY
    }
  }

  stateChanged(state) {
    const { values } = state.networktables;
    let cameraKeys = Object.keys(values.CameraPublisher || {});
    this.cameras = cameraKeys
      .filter((key) => {
        let subtable = getSubtable(`/CameraPublisher/${key}/`);
        return _.isArray(subtable.streams);
      })
      .map((key) => ({
        ntKey: `/CameraPublisher/${key}/`,
        name: key
      }));
  }

  render() {
    return html`
      ${map(this.cameras, (camera, name) => html`
        <p 
          data-nt-key="${camera.ntKey}" 
          class="camera-source"
          draggable="true"
          @dragstart="${this.onDragStart}"
          @dragend="${this.onDragEnd}"
        >
          ${name}
        </p>
      `)}
    `;
  }
}

customElements.define('camera-sources', CameraSources);