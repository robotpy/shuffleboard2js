import { LitElement, html, css } from 'lit-element';
import { readFileSync, existsSync, watch } from 'fs';
import store from '../store';
import { connect } from 'pwa-helpers';
import { dirname } from 'path';
import { without } from 'lodash';
import './no-dashboard';
import './widget-props-modal';
const dialog = require('electron').remote.dialog;
import '@vaadin/vaadin-context-menu';
import '@vaadin/vaadin-list-box';
import '@vaadin/vaadin-item';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-lumo-styles';

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
    this.i = 0;
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

        watch(dirname(dashboardPath), function (event, filename) {
          if (filename) {
            window.location.reload();
          }
        });

        window.require(dashboardPath);
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

    $(widgetNode).on('mouseenter', () => {
      this.selectedWidget = widgetId;
    });
  }

  observeRobotDashboard(dashboardNode) {
    this.dashboardNode = dashboardNode;
    const observer = new MutationObserver(mutationsList => {
      for(let mutation of mutationsList) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeName.toLowerCase() in this.getWidgetTypes()) {
            this.setupWidget(node, node.nodeName.toLowerCase());
          }
        });
      }
    });
    observer.observe(dashboardNode, { childList: true });

    this.setupExistingWidgets();
  }

  firstUpdated() {
    this.getSavedDashboard();

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(mutationsList => {
      for(let mutation of mutationsList) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeName === 'ROBOT-DASHBOARD') {
            this.observeRobotDashboard(node.shadowRoot);
            observer.disconnect();
          }
        });
      }
    });
    const contextMenuNode = this.shadowRoot.getElementById('context-menu')
    observer.observe(contextMenuNode, { childList: true });

    $(window).on('mousemove', (ev) => {
      this.pageX = ev.pageX;
      this.pageY = ev.pageY;
      if (!this.isPointInSelectedWidget(ev.pageX, ev.pageY) && !this.isContextMenuOpened()) {
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
        widgets.forEach(widget => this.setupWidget(widget, widgetType));
      });
      this.oldWidgetTypes = widgetTypes;
    }
  }

  stateChanged() {
    this.setupExistingWidgets();
  }

  isPointInSelectedWidget(x, y) {
    const widgetNode = this.widgets[this.selectedWidget];

    if (!widgetNode) {
      return false;
    }

    const margin = 10;

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
      if (!this.isPointInSelectedWidget(this.pageX, this.pageY)) {
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