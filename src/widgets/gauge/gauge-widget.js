const { LitElement, html, css } = dashboard.lit;
const Gauge = require('svg-gauge');

module.exports = class GaugeWidget extends LitElement {

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      .gauge-container-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .gauge-container {
        display: block;
      }
      
      .gauge-container > .gauge > .dial {
        stroke: #ddd;
        stroke-width: 3;
        fill: rgba(0,0,0,0);
      }
      .gauge-container > .gauge > .value {
        stroke: rgb(47, 180, 200);
        stroke-width: 3;
        fill: rgba(0,0,0,0);
      }
      .gauge-container > .gauge > .value-text {
        fill: black;
        font-family: sans-serif;
        font-size: 1em;
      }
    `;
  }

  constructor() {
    super();
    this.gauge = null;
  }

  setSize() {
    const rect = this.getBoundingClientRect();
    const svgWidth = rect.width;
    const svgHeight = rect.height;

    const size = Math.min(svgWidth, svgHeight);
    $(this.shadowRoot.getElementById('gauge')).css('width', size + 'px');
  }

  gaugeInit() {
    const gaugeElement = this.shadowRoot.getElementById('gauge');
    $(gaugeElement).html('');

    this.gauge = Gauge(gaugeElement, {
      min: this.widgetProps.min,
      max: this.widgetProps.max,
      value: 0
    });

    this.setSize();
};

  firstUpdated() {
    this.gaugeInit();

    const resizeObserver = new ResizeObserver(() => {
      this.setSize();
    });
    resizeObserver.observe(this);
  }

  updated(changedProperties) {
    if (changedProperties.has('widgetProps')) {
      this.gaugeInit();
    }

    if (this.gauge && typeof this.table === 'number') {
      this.gauge.setValue(this.table);
    }
  }

  render() {
    return html`
      <div class="gauge-container-container">
        <div id="gauge" class="gauge-container ${this.widgetProps.style}"></div>
      </div>
    `;
  }
}
