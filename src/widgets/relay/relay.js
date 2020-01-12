const { LitElement, html, css } = dashboard.lit;

module.exports = class RelayWidget extends LitElement {

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

  constructor() {
    super();
    this.buttons = ['Off', 'On', 'Forward', 'Reverse'];
  }

  setValue(value) {
    if ('Value' in this.table) {
      NetworkTables.putValue(this.ntRoot + 'Value', value);
    }
  }

  render() {
    const { Value } = this.table;
    return html`   
      ${this.buttons.map(button => html`
        <vaadin-button 
          theme="contrast ${Value === button ? 'primary' : ''}" 
          @click="${() => this.setValue(button)}"
        >
          ${button}
        </vaadin-button>
      `)}
    `;
  }
}
