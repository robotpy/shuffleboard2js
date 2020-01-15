import { LitElement, html, css } from 'lit-element';
import './side-panel';
import './networktables-settings-modal';
import './robot-dashboards';
import { writeFileSync } from 'fs';

class DashboardApp extends LitElement {

  static get styles() {
    return css`

      :host {
        display: block;
      }

      vaadin-split-layout {
        height: 100%;
        width: 100%;
      }

      side-panel {
        width: 25%;
        display: block;
        overflow: auto;
        height: 100vh;
      }
    `;
  }

  constructor() {
    super();
  }

  firstUpdated() {
    const dashboardsNode = this.shadowRoot.querySelector('robot-dashboards');
    const ntModalNode = this.shadowRoot.querySelector('networktables-settings-modal');

    dashboard.events.on('fileMenuSave', () => {
      dashboardsNode.saveDashboardConfig();
    });

    dashboard.events.on('fileMenuLoad', () => {
      dashboardsNode.openSavedDashboard();
    });

    dashboard.events.on('fileMenuNtSettings', () => {
      const robotIp = dashboard.storage.getRobotIp();
      ntModalNode.robotIp = robotIp;
      ntModalNode.open();
    });
  }

  onNtSourceDrag() {
    const dashboardsNode = this.shadowRoot.querySelector('robot-dashboards');
    dashboardsNode.sourceBeingAdded = true;
  }

  onNtSourceAdd(ev) {
    const { ntKey, ntType } = ev.detail;
    const dashboardsNode = this.shadowRoot.querySelector('robot-dashboards');
    const success = dashboardsNode.setNtRoot(ntKey);

    if (success) {
      dashboard.toastr.success(`Successfully added source '${ntKey}'`);
    }
    else if (dashboardsNode.selectedWidget) {
      const widgetType = dashboardsNode.getSelectedWidgetType();
      const widgetConfig = dashboard.store.getState().widgets.registered[widgetType];
      dashboard.toastr.error(`
        Widget of type '${widgetConfig.label}' doesn't accept type 
        '${ntType}'. Accepted types are '${widgetConfig.acceptedTypes.join(', ')}'`);
    }
    else {
      dashboard.toastr.error(`Failed to add source '${ntKey}'. No widget at that position can be found.`);
    }

    dashboardsNode.sourceBeingAdded = false;
  }

  render() {
    return html`
      <networktables-settings-modal></networktables-settings-modal>
      <vaadin-split-layout>
        <side-panel 
          @ntSourceAdd="${this.onNtSourceAdd}"
          @ntSourceDrag="${this.onNtSourceDrag}"
        ></side-panel>
        <robot-dashboards></robot-dashboards>
      </vaadin-split-layout>
    `;
  }
}

customElements.define('dashboard-app', DashboardApp);