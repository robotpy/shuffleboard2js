const { LitElement, html, css } = dashboard.lit;

module.exports = class NumberSlider extends LitElement {

  static get properties() {
    return {
      value: { type: Number }
    };
  }

  static get styles() {
    return css`

      :host {
        display: block;
      }

      .slider-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      input {
          width: 85%;
          max-width: calc(100% - 60px);
      }

      table-axis {
          width: calc(85% - 14px);
          max-width: calc(100% - 74px);
          display: block;
      }
    `;
  }

  constructor() {
    super();
    this.value = 0;
  }

  onChange(ev) {
    const value = parseFloat(ev.target.value);
    if (this.ntRoot) {
      NetworkTables.putValue(this.ntRoot, value);
    }
  }

  updated() {
    const $slider = $(this.shadowRoot.getElementById('slider'));
    this.value = this.table || this.value;
    $slider.val(this.value);
  }

  resized() {
    $(this.shadowRoot).find('table-axis').each(function() {
      this.requestUpdate();
    });
  }

  render() {
    return html`
      <div class="slider-container">
        <input 
          id="slider"
          type="range" 
          min="${this.widgetProps.min}"
          max="${this.widgetProps.max}"
          value="${this.value}"
          step="${this.widgetProps.blockIncrement}"
          @change="${this.onChange}"
        />

        <table-axis 
          ticks="5" 
          range="[${this.widgetProps.min}, ${this.widgetProps.max}]"
        ></table-axis>
      </div>
    `;
  }
}
