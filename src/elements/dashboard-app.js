import { LitElement, html, css } from 'lit-element';
import { isEditModeOn, turnEditModeOn, turnEditModeOff } from '../storage';
import './side-panel';
import './robot-dashboards';
import './source-provider-settings-modal';
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
        width: 400px;
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
    const sourceProviderSettingsModalNode = this.shadowRoot.querySelector('source-provider-settings-modal');
    const drawerNode = this.shadowRoot.querySelector('mwc-drawer');

    
    dashboard.events.on('fileMenuSave', () => {
      dashboardsNode.saveDashboardConfig();
    });

    dashboard.events.on('fileMenuOpen', () => {
      dashboardsNode.openSavedDashboard();
    });

    dashboard.events.on('fileMenuSourceProviderSettings', () => {
      sourceProviderSettingsModalNode.open();
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
              node.style.width = '400px';
              drawerTitle.remove();
              drawerSubtitle.remove();
              observer.disconnect();
            } else if(node.className === 'mdc-drawer-app-content') {
              const styleNode = document.createElement("style");
              styleNode.appendChild(document.createTextNode(`
                .mdc-drawer.mdc-drawer--open:not(.mdc-drawer--closing) + .mdc-drawer-app-content {
                  margin-left: 400px !important;
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

  onSourceDrag() {
    const dashboardsNode = this.shadowRoot.querySelector('robot-dashboards');
    dashboardsNode.sourceBeingAdded = true;
  }

  onSourceAdd(ev) {
    const dashboardsNode = this.shadowRoot.querySelector('robot-dashboards');
    dashboardsNode.setSourceKey(ev.detail.providerName, ev.detail.key);
    dashboardsNode.sourceBeingAdded = false;
  }

  onTabSelection(ev) {
    const sidePanelNode = this.shadowRoot.querySelector('side-panel');
    sidePanelNode.selectedTab = ev.detail.value;
  }

  render() {
    return html`
      <source-provider-settings-modal></source-provider-settings-modal>
      <mwc-drawer hasHeader type="dismissible" ?open="${this.showSidePanel}">
        <span slot="header">
          <vaadin-tabs @selected-changed="${this.onTabSelection}">
            <vaadin-tab>Sources</vaadin-tab>
            <vaadin-tab>Widgets</vaadin-tab>
          </vaadin-tabs>
        </span>
        <side-panel
          @source-drag="${this.onSourceDrag}"
          @source-add="${this.onSourceAdd}"
        ></side-panel>
        <div slot="appContent">
          <robot-dashboards></robot-dashboards>
        </div>
      </mwc-drawer>
    `;
  }
}

customElements.define('dashboard-app', DashboardApp);