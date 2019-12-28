import { LitElement, html, css } from 'lit-element';
import { includeStyles } from '../../assets/js/render-utils';

class BasicSubsystem extends LitElement {

  static get styles() {
    return css`
      .subsystem-container {
        padding: 10px;
      }

      p {
        margin-bottom: 10px;
        text-align: left;
        font-weight: normal;
      }
    `;
  }

  render() {
    return html`
      ${includeStyles()}
      <div class="subsystem-container">
        <p>Default command: ${this.table['.default'] || 'None'}</p>
        <p>Current command: ${this.table['.command'] || 'None'}</p>
      </div>
    `;
  }
}

customElements.define('basic-subsystem', BasicSubsystem);
