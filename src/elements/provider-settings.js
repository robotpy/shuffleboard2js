import { LitElement } from 'lit-element';

export default class ProviderSettings extends LitElement {

  constructor() {
    super();

    Object.defineProperty(this, 'settings', {
      get() {
        return this._settings;
      },
      set(value) {
        const oldValue = this._settings;
        this._settings = new Proxy(value || {}, {
          get: (settings, key) => {
            return settings[key];
          },
          set: (settings, key, value) => {
            const oldValue = { ...settings };
            settings[key] = value;
            this._dispatchSettingsChange();
            this.requestUpdate('settings', oldValue);    
            return true;
          }
        });
        this.requestUpdate('settings', oldValue);
      }
    });
  }

  _dispatchSettingsChange() {
    const event = new CustomEvent('settings-change', {
      detail: {
        settings: { ...this.settings }
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}
