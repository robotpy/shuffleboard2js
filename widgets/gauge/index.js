const { LitElement, html, css } = dashboard.lit;
const Gauge = require('svg-gauge');

class GaugeWidget extends LitElement {

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

  static get properties() {
    return {
      min: { type: Number },
      max: { type: Number }
    }
  }

  constructor() {
    super();
    this.min = 0;
    this.max = 100;
    this.gauge = null;
  }

  set min(value) {
    const oldValue = this._min;
    this._min = value;
    this.requestUpdate('min', oldValue);
  }

  get min() {
    return Math.min(this._min, this._max);
  }

  set max(value) {
    const oldValue = this._max;
    this._max = value;
    this.requestUpdate('max', oldValue);
  }

  get max() {
    return Math.max(this._min, this._max);
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
      min: this.min,
      max: this.max,
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
    if (changedProperties.has('min') || changedProperties.has('max')) {
      this.gaugeInit();
    }

    if (this.gauge && typeof this.table === 'number') {
      this.gauge.setValue(this.table);
    }
  }

  render() {
    return html`
      <div class="gauge-container-container">
        <div id="gauge" class="gauge-container"></div>
      </div>
    `;
  }
}


dashboard.registerWidget('gauge-widget', {
  class: GaugeWidget,
  label: 'Gauge',
  category: 'Basic',
  acceptedTypes: ['number'],
  image: require('./gauge.png')
});