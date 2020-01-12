const { LitElement, html, css } = dashboard.lit;


module.exports = class GaugeWidgetProps extends LitElement {

  static get styles() {
    return css`
      vaadin-number-field::part(decrease-button)::before {
        content: '-';
      }
    `;
  }

  onMinChange() {
    const minInput = this.shadowRoot.getElementById('min');
    const min = parseFloat(minInput.value);

    if (isNaN(min)) {
      return;
    }

    this.widgetProps.min = min;

    if (min > this.widgetProps.max) {
      this.widgetProps.max = min;
    }
  }

  onMaxChange() {
    const maxInput = this.shadowRoot.getElementById('max');
    const max = parseFloat(maxInput.value);

    if (isNaN(max)) {
      return;
    }

    this.widgetProps.max = max;

    if (max < this.widgetProps.min) {
      this.widgetProps.min = max;
    }
  };

  render() {
    return html`
      <vaadin-form-layout>
        <vaadin-number-field 
          id="min"
          label="Min" 
          value="${this.widgetProps.min}"
          @change="${this.onMinChange}"
          has-controls
        ></vaadin-number-field>
        <vaadin-number-field
          id="max"
          label="Max" 
          value="${this.widgetProps.max}"
          @change="${this.onMaxChange}"
          has-controls
        ></vaadin-number-field>
      </vaadin-form-layout>
    `;
  }
}
