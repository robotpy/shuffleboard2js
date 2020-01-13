import { LitElement, html, css } from 'lit-element';
import { readFileSync, existsSync, watch } from 'fs';
import { join } from 'path';
import store from '../store';
import { connect } from 'pwa-helpers';
import { dirname } from 'path';
import { without } from 'lodash';
import './no-dashboard';
import './widget-props-modal';
const dialog = require('electron').remote.dialog;
import { getSubtable, getTypes } from 'assets/js/networktables';


class RobotDashboards extends connect(store)(LitElement) {

  static get styles() {
    return css`
      :host {
        position: relative;
      }

      no-dashboard {
        padding-left: 15px;
        padding-right: 15px;
        padding-top: 10px;
        padding-bottom: 10px;
        display: block;
      }

      robot-dashboard {
        display: block;
      }
    `;
  }

  static get properties() { 
    return {
      dashboardConfig: { type: Object },
      selectedWidget: { type: String }
    }
  }

  constructor() {
    super();
    this.dashboardConfig = {};
    this.oldWidgetTypes = [];
    this.dashboardNode = null;
    this.widgets = {};
    this.selectedWidget = null;
    this.pageX = 0;
    this.pageY = 0;
  }

  async openSavedDashboard() {
    const options = {
      title: 'Open Layout',
      defaultPath: dashboard.storage.getDashboardPath(),
      properties: ['openFile'],
      filters: [
        { name: 'Javascript files', extensions: ['js'] }
      ]
    };

    try {
      const { canceled, filePaths } = await dialog.showOpenDialog(options);
      if (!canceled) {
        dashboard.storage.setDashboardPath(filePaths[0]);
        window.location.reload();
      }
    }
    catch(e) {
      dashboard.toastr.error(`Failed to open Dashboard: ${e.message}`);
    }
  }

  getSavedDashboard() {
    try {
      if (dashboard.storage.hasDashboardPath()) {
        const dashboardPath = dashboard.storage.getDashboardPath();

        watch(dirname(dashboardPath), { recursive: true }, function (event, filename) {
          if (filename) {
            window.location.reload();
          }
        });

        //console.log('__dirname', process.cwd())
        watch(join(process.cwd(), './widgets'), { recursive: true }, function (event, filename) {
          window.location.reload();
        });

        window.require(dashboardPath);
        window.require('../widgets');
        this.dashboardConfig = this.getSavedDashboardConfig();
      }
    }
    catch(e) {
      console.error('Error opening dashboard', e.message);
    }
  }

  async getSavedDashboardConfig() {

    const configPath = dashboard.storage.getDashboardConfigPath();

    try {
      if (!existsSync(configPath)) {
        return {};
      }
      const config = JSON.parse(readFileSync(configPath, 'utf8'));
      return config;
    }
    catch(e) {
      dashboard.toastr.error(`Failed to open layout: ${e.message}`);
      return {};
    }
  }

  getWidgetTypes() {
    return Object
      .keys(dashboard.store.getState().widgets.registered)
      .map(widgetType => widgetType.toLowerCase());
  }

  getSelectedWidgetType() {
    if (!this.selectedWidget) {
      return null;
    }

    const widgetNode = this.widgets[this.selectedWidget];
    return widgetNode.nodeName.toLowerCase();
  }

  setupWidget(widgetNode, widgetType) {
    const widgetId = widgetNode.getAttribute('widget-id');
    if (!widgetId) {
      // TODO: Make link that selects element in DOM?
      dashboard.toastr.error(`Widget of type ${widgetType} does not have a 'widget-id' attribute.`);
      return;
    }

    if (widgetId in this.widgets) {
      // TODO: Make link that selects element in DOM?
      dashboard.toastr.error(`Widget of type ${widgetType} with widget-id '${widgetId}' already exists!`);
      return;
    }

    this.widgets[widgetId] = widgetNode;
  }

  firstUpdated() {
    this.getSavedDashboard();

    dashboard.events.on('widgetAdded', node => {
      this.setupWidget(node, node.nodeName.toLowerCase());
    });

    $(window).on('mousemove drag', (ev) => {

      // This happens when user stops dragging mouse
      if (ev.pageX === 0 && ev.pageY === 0) {
        return;
      }

      this.pageX = ev.pageX;
      this.pageY = ev.pageY;

      if (!this.selectedWidget) {
        for (let widget in this.widgets) {
          if (this.isPointInWidget(this.pageX, this.pageY, 0, widget)) {
            this.selectedWidget = widget;
            break;
          }
        }
      }
      else if (!this.isPointInWidget(ev.pageX, ev.pageY) && !this.isContextMenuOpened()) {
        this.selectedWidget = null;
      }
    });

    this.setupContextMenuRenderer();
  }

  setupContextMenuRenderer() {
    const contextMenuNode = this.shadowRoot.getElementById('context-menu');
    contextMenuNode.renderer = (root) => {
      let listBox = root.firstElementChild;
      // Check if there is a list-box generated with the previous renderer call to update its content instead of recreation
      if (listBox) {
        listBox.innerHTML = '';
      } else {
        listBox = window.document.createElement('vaadin-list-box');
        root.appendChild(listBox);
      }

      const item = window.document.createElement('vaadin-item');
      item.textContent = 'Properties';
      item.addEventListener('click', () => {
        this.openPropertiesModal();
      });
      listBox.appendChild(item);
    };
  }

  dashboardExists() {
    return typeof customElements.get('robot-dashboard') !== 'undefined';
  }

  setupExistingWidgets() {
    if (this.dashboardNode) {
      const widgetTypes = this.getWidgetTypes();
      const newWidgetTypes = without(widgetTypes, ...this.oldWidgetTypes);
      newWidgetTypes.forEach(widgetType => {
        const widgets = this.dashboardNode.querySelectorAll(widgetType);
        //widgets.forEach(widget => this.setupWidget(widget, widgetType));
      });
      this.oldWidgetTypes = widgetTypes;
    }
  }

  stateChanged() {
    this.setupExistingWidgets();
    for (let widget in this.widgets) {
      this.updateWidgetTable(widget);
    }
  }

  isPointInWidget(x, y, margin = 10, widget = this.selectedWidget) {
    const widgetNode = this.widgets[widget];

    if (!widgetNode) {
      return false;
    }

    const { left, top, right, bottom } = widgetNode.getBoundingClientRect();

    return (
      left - margin <= x &&
      x <= right + margin &&
      top -margin <= y &&
      y <= bottom + margin
    );
  }

  renderSelectedWidgetRect() {
    const widgetNode = this.widgets[this.selectedWidget];
    
    if (!widgetNode) {
      return html``;
    }

    const margin = 10;
    const left = widgetNode.offsetLeft - margin;
    const top = widgetNode.offsetTop - margin;
    const width = widgetNode.offsetWidth + margin * 2;
    const height = widgetNode.offsetHeight + margin * 2;

    return html`
      <style>
        .selected-widget-rect {
          position: absolute;
          left: ${left}px;
          top: ${top}px;
          width: ${width}px;
          height: ${height}px;
          border: 2px dashed cornflowerblue;
          pointer-events: none;
        }
      </style>
      <div class="selected-widget-rect"></div>
    `
  }

  onContextMenu(ev) {
    var event = new Event('dashboardContextMenu');
    event.clientX = ev.clientX;
    event.clientY = ev.clientY;

    const widgetType = this.getSelectedWidgetType();

    if (this.selectedWidget && customElements.get(`${widgetType}-props`)) {
      const contextMenuNode = this.shadowRoot.getElementById('context-menu');
      contextMenuNode.dispatchEvent(event);
    }
  }

  onContextMenuOpenChanged(ev) {
    const opened = ev.detail.value;
    if (!opened) {
      if (!this.isPointInWidget(this.pageX, this.pageY)) {
        this.selectedWidget = null;
      }
    }
  }

  isContextMenuOpened() {
    const contextMenuNode = this.shadowRoot.getElementById('context-menu');
    return contextMenuNode.opened;
  }

  async openPropertiesModal() {
    const widgetNode = this.widgets[this.selectedWidget];
    const widgetType = this.getSelectedWidgetType();
    const propsNodeName = `${widgetType}-props`;
    const propsNode = window.document.createElement(propsNodeName);
    propsNode.widgetProps = widgetNode.widgetProps;

    const propertiesModalNode = window.document.createElement('widget-props-modal');

    propertiesModalNode.appendChild(propsNode)
    this.shadowRoot.appendChild(propertiesModalNode);
    await propertiesModalNode.updateComplete;
    propertiesModalNode.open();
  }

  closePropertiesModal() {
    const propertiesModalNode = this.shadowRoot.getElementById('properties-modal');
    propertiesModalNode.close();
  }

  isAcceptedType(ntTypes, widgetType = this.getSelectedWidgetType()) {
    let widgetConfig = dashboard.store.getState().widgets.registered[widgetType];

    if (!widgetConfig) {
      return false;
    }

    for (let i = 0; i < ntTypes.length; i++) {
      if (widgetConfig.acceptedTypes.indexOf(ntTypes[i]) > -1) {
        return true;
      }
    }

    return false;
  }

  updateWidgetTable(widget) {

    const widgetNode = this.widgets[widget];
    const { ntRoot } = widgetNode;
    const ntTypes = getTypes(ntRoot);
    const widgetType = widgetNode.nodeName.toLowerCase();
    const isAcceptedType = this.isAcceptedType(ntTypes, widgetType);
    
    if (isAcceptedType) {
      const prevTable = widgetNode.table;
      let ntValue = isAcceptedType ? getSubtable(ntRoot) : {};
      widgetNode.table = ntValue;
      widgetNode.requestUpdate('table', prevTable);      
      return true;
    }
  }

  // If ignoreType is true, set even if the type is not one of the accepted types.
  // This is useful for saved widgets that have ntRoots that haven't been set yet.
  setNtRoot(ntRoot, ignoreType = false, widget = this.selectedWidget) {
    let ntTypes = getTypes(ntRoot);
    if (ignoreType || this.isAcceptedType(ntTypes)) {
      const widgetNode = this.widgets[widget];
      const prevNtRoot = widgetNode.ntRoot;
      widgetNode.ntRoot = ntRoot;     
      widgetNode.requestUpdate('ntRoot', prevNtRoot);
      this.updateWidgetTable(widget);
      return true;
    }

    return false;
  }

  render() {
    return html`
      <vaadin-context-menu 
        @contextmenu="${this.onContextMenu}" 
        @opened-changed="${this.onContextMenuOpenChanged}"
        open-on="dashboardContextMenu" 
        id="context-menu"
      >
        ${this.dashboardExists() ? html`
          <robot-dashboard></robot-dashboard>
        ` : html`
          <no-dashboard></no-dashboard>
        `}
        ${this.selectedWidget ? this.renderSelectedWidgetRect() : ''}
      </vaadin-context-menu>
    `;
  }
}

customElements.define('robot-dashboards', RobotDashboards);