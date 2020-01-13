const { LitElement, html, css } = dashboard.lit;

class BasicSubsystem extends LitElement {

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

dashboard.registerWidget('basic-subsystem', {
  class: BasicSubsystem,
  label: 'Basic Subsystem',
  category: 'Basic',
  acceptedTypes: ['Subsystem'],
  image: require('./basic-subsystem.png')
});