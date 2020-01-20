import { LitElement, html, css } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html'

import { 
  get as getProvider, 
  getNames as getProviderNames 
} from '../source-providers';
import { isNull } from 'lodash';

class SourceProviderSettings extends LitElement {

  static get properties() {
    return {
      selectedTab: { type: Number }
    };
  }

  constructor() {
    super();
    this.selectedTab = 0;
  }

  static get styles() {
    return css`

      :host {
        display: flex;
        max-width: 600px;
        padding-bottom: 15px;
        padding-top: 15px;
      }

      vaadin-tabs {
        margin-right: 10px;
        max-height: 300px;
      }

      vaadin-tabs::part(tabs) {
        margin: 0;
      }

      vaadin-tab {
        padding: 0;
        text-align: right;
        display: block;
        
        height: 30px;
        min-height: 30px;
      }

      .settings {
        margin-left: 10px;
      }
    `;
  }

  onTabSelection(ev) {
    this.selectedTab = ev.detail.value;
  }

  firstUpdated() {
    let observer = new MutationObserver(mutations => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList') {
          for (let node of mutation.addedNodes) {
            if ('hasAttribute' in node && node.hasAttribute('provider-name')) {
              const provider = getProvider(node.getAttribute('provider-name'));
              node.settings = { ...provider.settings };
              node.addEventListener('settings-change', (ev) => {
                provider.onSettingsChange(ev.detail.settings);
              });
            }
          }
        }
      }
    });
    observer.observe(this.shadowRoot.querySelector('.settings'), {
      childList: true
    });
  }

  render() {
    return html`
      <vaadin-tabs orientation="vertical" theme="minimal small" @selected-changed="${this.onTabSelection}">
        ${getProviderNames().map(name => {
          const provider = getProvider(name);
          const { settingsElementName } = provider;

          if (!isNull(settingsElementName)) {
            return html`
              <vaadin-tab>${name}</vaadin-tab>
            `;
          } else {
            html``;
          }
        })}
      </vaadin-tabs>
      <div class="settings">
        ${getProviderNames().map((name, index) => {
          const provider = getProvider(name);
          const { settingsElementName } = provider;

          if (this.selectedTab === index && !isNull(settingsElementName)) {
            return unsafeHTML(`
              <${settingsElementName} 
                provider-name="${name}"
              ></${settingsElementName}>
            `);
          } else {
            html``;
          }
        })}
      </div>
    `;
  }
}

customElements.define('source-provider-settings', SourceProviderSettings);