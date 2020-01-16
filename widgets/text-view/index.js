const { LitElement, html, css } = dashboard.lit;

class TextView extends LitElement {

  static get styles() {
    return css`
      :host {
        height: 100%;
        display: block;
        font-size: 18px;
        font-weight: normal;
        color: black;
      }

      input {
        width: 100%;
        border: none;
        outline: none;
        border-bottom: 2px solid lightgray;
        padding-bottom: 5px;
        background: none;
        font: inherit;
        color: inherit;
      }

      input:focus {
        border-bottom: 2px solid lightblue;
      }
    `;
  }
  
  getInputType() {
    return this.isNtType('number') ? 'number' : 'text';
  }

  getInputValue() {
    return this.hasAcceptedNtType() ? this.table.toString() : '';
  }

  onChange(ev) {
    const value = ev.target.value;

    if (this.isNtType('string')) {
        NetworkTables.putValue(this.ntRoot, value);
    }
    else if (this.isNtType('number')) {
        NetworkTables.putValue(this.ntRoot, parseFloat(value));
    }
    else if (this.isNtType('boolean')) {
      if (value === 'true') {
        NetworkTables.putValue(this.ntRoot, true);
      } else if (value === 'false') {
        NetworkTables.putValue(this.ntRoot, false);
      }
    }
  }

  render() {
    return html`   
      <input
        part="input"
        type="${this.getInputType()}"
        @change="${this.onChange}"
        .value="${this.getInputValue()}"
      />
    `;
  }
}

dashboard.registerWidget('text-view', {
  class: TextView,
  label: 'Text View',
  category: 'Basic',
  acceptedTypes: ['boolean', 'number', 'string'],
  image: require('./text-view.png')
});