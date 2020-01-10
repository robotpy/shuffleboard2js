const { LitElement, html } = dashboard.lit;

module.exports = class BooleanBoxProps extends LitElement {

  onColorWhenTrueChange(ev) {
    const color = ev.target.value;
    this.widgetProps.colorWhenTrue = color;
  }

  onColorWhenFalseChange(ev) {
    const color = ev.target.value;
    this.widgetProps.colorWhenFalse = color;
  }

  render() {
    return html`
      <vaadin-form-layout>
        <vaadin-form-item>
          <label slot="label" for="colorWhenTrue">Color when true</label>
          <input 
              type="color" 
              id="colorWhenTrue" 
              class="full-width"
              value="${this.widgetProps.colorWhenTrue}"
              @change="${this.onColorWhenTrueChange}"
          />
        </vaadin-form-item>
        <vaadin-form-item>
        <label slot="label" for="colorWhenFalse">Color when false</label>
          <input 
              type="color" 
              id="colorWhenFalse" 
              class="full-width"
              value="${this.widgetProps.colorWhenFalse}"
              @change="${this.onColorWhenFalseChange}"
          />
        </vaadin-form-item>
      </vaadin-form-layout>
    `;
  }
}
