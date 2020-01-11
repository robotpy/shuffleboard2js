const { LitElement, html, css } = dashboard.lit;

module.exports =  class BasicSubsystem extends LitElement {

  static get styles() {
    return css`
      :host {
        text-align: left;
        font-weight: normal;
        display: inline-block;
      }

      p {
        margin: 0;
      }

      p:first-child {
        margin-bottom: 5px;
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