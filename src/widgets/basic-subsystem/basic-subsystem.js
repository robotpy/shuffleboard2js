const { LitElement, html, css } = dashboard.lit;

export default class BasicSubsystem extends LitElement {

  static get styles() {
    return css`
      :host {
        text-align: left;
        font-weight: normal;
        display: inline-block;
      }

      p {
        margin: 5px 0;
      }
    `;
  }

  render() {
    return html`
      <p>Default command: ${this.table['.default'] || 'None'}</p>
      <p>Current command: ${this.table['.command'] || 'None'}</p>
    `;
  }
}