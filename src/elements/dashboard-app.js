import { LitElement, html, css } from 'lit-element';
import { isEditModeOn, turnEditModeOn, turnEditModeOff } from '../storage';
import './side-panel';
import './networktables-settings-modal';
import './robot-dashboards';
import '@material/mwc-drawer';

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
        /* width: 25%; */
        width: 350px;
        display: block;
        overflow: auto;
        height: 100vh;
      }
    `;
  }

  static get properties() {
    return {
      showSidePanel: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.showSidePanel = isEditModeOn();
  }

  firstUpdated() {
    const dashboardsNode = this.shadowRoot.querySelector('robot-dashboards');
    const ntModalNode = this.shadowRoot.querySelector('networktables-settings-modal');
    const drawerNode = this.shadowRoot.querySelector('mwc-drawer');

    dashboard.events.on('fileMenuSave', () => {
      dashboardsNode.saveDashboardConfig();
    });

    dashboard.events.on('fileMenuOpen', () => {
      dashboardsNode.openSavedDashboard();
    });

    dashboard.events.on('fileMenuNtSettings', () => {
      const robotIp = dashboard.storage.getRobotIp();
      ntModalNode.robotIp = robotIp;
      ntModalNode.open();
    });

    dashboard.events.on('fileMenuEditMode', editModeOn => {
      this.showSidePanel = editModeOn;
      if (editModeOn) {
        turnEditModeOn();
      } else {
        turnEditModeOff();
      }
    });

    let observer = new MutationObserver(mutations => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList') {
          for (let node of mutation.addedNodes) {
            if (node.nodeName === 'ASIDE') {
              const drawerTitle = node.querySelector('.mdc-drawer__title');
              const drawerSubtitle = node.querySelector('.mdc-drawer__subtitle');
              node.style.position = 'fixed';
              node.style.width = '300px';
              drawerTitle.remove();
              drawerSubtitle.remove();
              observer.disconnect();
            } else if(node.className === 'mdc-drawer-app-content') {
              const styleNode = document.createElement("style");
              styleNode.appendChild(document.createTextNode(`
                .mdc-drawer.mdc-drawer--open:not(.mdc-drawer--closing) + .mdc-drawer-app-content {
                  margin-left: 300px !important;
                }
              `));
              node.appendChild(styleNode);
            }
          }
        }
      }
    });
    
    observer.observe(drawerNode.shadowRoot, {
      childList: true
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

  onTabSelection(ev) {
    const sidePanelNode = this.shadowRoot.querySelector('side-panel');
    sidePanelNode.selectedTab = ev.detail.value;
  }

  render() {
    return html`
      <networktables-settings-modal></networktables-settings-modal>
      <mwc-drawer hasHeader type="dismissible" ?open="${this.showSidePanel}">
        <span slot="header">
          <vaadin-tabs @selected-changed="${this.onTabSelection}">
            <vaadin-tab>Sources</vaadin-tab>
            <vaadin-tab>Widgets</vaadin-tab>
          </vaadin-tabs>
        </span>
        <side-panel style="width: 350px"
          @ntSourceAdd="${this.onNtSourceAdd}"
          @ntSourceDrag="${this.onNtSourceDrag}"
        ></side-panel>
        <div slot="appContent">
          <robot-dashboards></robot-dashboards>
        </div>
      </mwc-drawer>
    `;
  }
}

customElements.define('dashboard-app', DashboardApp);