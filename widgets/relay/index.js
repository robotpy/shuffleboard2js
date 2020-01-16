const { LitElement, html, css } = dashboard.lit;

class RelayWidget extends LitElement {

  static get styles() {
    return css`
      :host {
        display: inline-block;
        font-size: 15px;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      vaadin-button {
        border-radius: 0;
        margin: 0;
        flex: 1;
        font-size: inherit;
      }
    `;
  }

  static get properties() {
    return {
      value: { type: String, attribute: false }
    };
  }

  constructor() {
    super();
    this.buttons = ['Off', 'On', 'Forward', 'Reverse'];
    this.value = 'Off';
  }

  setValue(value) {
    if (this.isNtType('Relay')) {
      NetworkTables.putValue(this.ntRoot + 'Value', value);
    }
    else {
      this.value = value;
    }
  }

  updated() {
    if (this.isNtType('Relay')) {
      this.value = this.table.Value;
    }
  }

  render() {
    return html`   
      ${this.buttons.map(button => html`
        <vaadin-button 
          theme="contrast ${this.value === button ? 'primary' : ''}" 
          @click="${() => this.setValue(button)}"
        >
          ${button}
        </vaadin-button>
      `)}
    `;
  }
}

dashboard.registerWidget('relay-widget', {
  class: RelayWidget,
  label: 'Relay',
  category: 'Basic',
  acceptedTypes: ['Relay'],
  image: require('./relay.png')
});