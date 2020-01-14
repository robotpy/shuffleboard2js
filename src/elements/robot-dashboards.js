import { LitElement, html, css } from 'lit-element';
import { readFileSync, existsSync, watch } from 'fs';
import { join } from 'path';
import { dirname } from 'path';
import './no-dashboard';
import './widget-props-modal';
const dialog = require('electron').remote.dialog;

class RobotDashboards extends LitElement {

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

      .selected-widget-rect {
        display: none;
      }

      .selected-widget-rect.show {
        display: block;
        position: absolute;
        left: var(--selected-widget-rect-left);
        top: var(--selected-widget-rect-top);;
        width: var(--selected-widget-rect-width);;
        height: var(--selected-widget-rect-height);
        border: 2px dashed cornflowerblue;
        pointer-events: none;
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
    this.sourceBeingAdded = false;
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

        watch(join(process.cwd(), './widgets'), { recursive: true }, function (event, filename) {
          window.location.reload();
        });

        window.require(dashboardPath);
        this.dashboardConfig = this.getSavedDashboardConfig();
      }
    }
    catch(e) {
      console.error('Error opening dashboard', e.message);
    }
    window.require('../widgets');
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
            this.setSelectedWidgetRect();
            break;
          }
        }
      }
      else if (!this.isPointInWidget(ev.pageX, ev.pageY)) {
        this.selectedWidget = null;
      }
    });
  }

  dashboardExists() {
    return typeof customElements.get('robot-dashboard') !== 'undefined';
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

  setSelectedWidgetRect() {
    const widgetNode = this.widgets[this.selectedWidget];
    
    if (!widgetNode) {
      return;
    }

    const margin = 10;
    const rectNode = this.shadowRoot.querySelector('.selected-widget-rect');

    rectNode.style.setProperty(
      '--selected-widget-rect-left', 
      `${widgetNode.offsetLeft - margin}px`
    );

    rectNode.style.setProperty(
      '--selected-widget-rect-top', 
      `${widgetNode.offsetTop - margin}px`
    );

    rectNode.style.setProperty(
      '--selected-widget-rect-width', 
      `${widgetNode.offsetWidth + margin * 2}px`
    );

    rectNode.style.setProperty(
      '--selected-widget-rect-height', 
      `${widgetNode.offsetHeight + margin * 2}px`
    );
  }

  setNtRoot(ntRoot) {
    const widgetNode = this.widgets[this.selectedWidget];

    if (!widgetNode) {
      return false;
    }

    try {
      widgetNode.ntRoot = ntRoot;
    } catch(e) {
      return false;
    }

    return true;
  }

  render() {
    return html`
      ${this.dashboardExists() ? html`
        <robot-dashboard></robot-dashboard>
      ` : html`
        <no-dashboard></no-dashboard>
      `}
      <div 
        class="selected-widget-rect ${this.selectedWidget && this.sourceBeingAdded ? 'show' : ''}"
      >
      </div>
    `;
  }
}

customElements.define('robot-dashboards', RobotDashboards);