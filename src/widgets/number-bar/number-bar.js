import { LitElement, html, css } from 'lit-element';
import { includeStyles } from '../../assets/js/render-utils';
import { isNumber } from 'lodash';

class NumberBar extends LitElement {

  static get properties() {
    return {
      value: { type: Number }
    };
  }

  static get styles() {
    return css`
      .number-bar-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
      }

      .bar {
        position: relative;
        width: calc(100% - 60px);
        height: 20px;
        border-radius: 3px;
        margin: 0 30px;
        background: #DDD;
      }

      .foreground {
        position: absolute;
        top: 0;
        height: 20px;
        background: lightblue;
        border-radius: 3px;
      }

      .text {
        font-size: 15px;
        line-height: 18px;
        position: relative;
        margin-bottom: 0;
      }

      table-axis {
        width: calc(100% - 60px);
        margin: 2px auto 0;
        display: block;
      }
    `;
  }

  constructor() {
    super();
    this.value = 0;
  }

  getForegroundStyle() {
    const min = this.widgetProps.min;
    const max = this.widgetProps.max;
    const center = this.widgetProps.center;
    const val = Math.clamp(this.value, min, max);

    if (max < center) {
      return `
        width: ${Math.abs(val - max) / (max - min) * 100}%;
        left: auto;
        right: 0;
      `;
    }
    else if (min > center) {
      return `
        width: ${Math.abs(val - min) / (max - min) * 100}%;
        left: 0;
        right: auto;
      `;
    }
    else if (val > center) {
      return `
        width: ${Math.abs(val - center) / (max - min) * 100}%;
        left: ${Math.abs(min - center) / (max - min) * 100}%;
        right: auto;
      `;
    }
    else {
      return `
        width: ${Math.abs(val - center) / (max - min) * 100}%;
        left: auto;
        right: ${Math.abs(max - center) / (max - min) * 100}%;
      `;
    }
  };

  updated() {
    const defaultValue = Math.clamp(this.widgetProps.center, this.widgetProps.min, this.widgetProps.max);
    this.value = isNumber(this.table) ? this.table : defaultValue;
  }

  resized() {
    this.shadowRoot.getElementById('axis').requestUpdate();
  }

  render() {
    return html`
      ${includeStyles()}
      <div class="number-bar-container">
        <div class="number-bar">
          <div ref="bar" class="bar">
            <div class="foreground" style="${this.getForegroundStyle()}"></div>
            ${this.widgetProps.showText ? html`
              <p class="text">
                ${this.value}
              </p>
            ` : ''}
          </div>
          <table-axis 
            id="axis"
            ticks="${this.widgetProps.numTickMarks}"
            range="[${this.widgetProps.min}, ${this.widgetProps.max}]"></table-axis>
        </div>
      </div>
    `;
  }
}

customElements.define('number-bar', NumberBar);
