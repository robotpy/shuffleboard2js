import { LitElement, html, css } from 'lit-element';
import { includeStyles } from '../../assets/js/render-utils';

class ComboboxChooser extends LitElement {

  static get styles() {
    return css`
      .chooser-container {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        height: 100%;
      }

      .form-group {
        margin-bottom: 0;
      }

      form {
        margin-bottom: 0;
        max-width: 90%;
        min-width: 100px;
      }
    `;
  }

  constructor() {
    super();
    this.options = [];
    this.selected = '';
  }

  onChange(ev) {
    const value = ev.target.value;
    NetworkTables.putValue(this.ntRoot + 'selected', value);
  }

  updated() {
    this.options = this.table.options || [];
    this.selected = this.table.selected || '';
  }

  render() {
    return html`
      ${includeStyles()}
      <div class="chooser-container">
        <form>
          <div class="form-group">
            <select class="form-control" ref="chooser" @change="${this.onChange}">
              ${this.options.map(option => html`
                <option value="${option}" ?selected="${selected === option}">
                  ${option}
                </option>
              `)}
            </select>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('combobox-chooser', ComboboxChooser);
