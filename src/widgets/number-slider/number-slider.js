import { LitElement, html, css } from 'lit-element';
import { includeStyles } from '../../assets/js/render-utils';

class NumberSlider extends LitElement {

  static get styles() {
    return css`
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
    this.lastTableValue = null;
    this.differentValueCount = 0;

    this.isDragging = false;
  }

onChange(ev) {
  this.value = parseFloat(ev.target.value);
  if (this.ntRoot) {
    this.lastTableValue = this.value;
    NetworkTables.putValue(this.ntRoot, this.value);
  }
}

onDragStart(ev) {
  this.isDragging = true;
}

onDragEnd(ev) {
  this.isDragging = false;
}

  

  updated() {
    const $slider = $(this.shadowRoot.getElementById('slider'));
    if (this.lastTableValue !== this.table) {
      this.value = this.table || this.value;
      $slider.val(this.value);
    }
    this.lastTableValue = this.table;

    // If user is not interacting with the slider but the slider value is consistently
    // different from the table value, change it
    if (typeof this.table === 'number' && this.table !== $slider.val()) {
      this.differentValueCount++;
    }

    if (this.isDragging) {
      this.differentValueCount = 0;
    }

    if (this.differentValueCount > 20) {
      this.value = this.table;
      $slider.val(this.value);
      this.differentValueCount = 0;
    }
  }

  resized() {
    $(this.shadowRoot).find('table-axis').each(function() {
      this.requestUpdate();
    });
  }

  render() {
    return html`
      ${includeStyles()}
      <div class="slider-container">
        <input 
          id="slider"
          type="range" 
          min="${this.widgetProps.min}"
          max="${this.widgetProps.max}"
          value="${this.value}"
          step="${this.widgetProps.blockIncrement}"
          @change="${this.onChange}"
          @mousedown="${this.onDragStart}"
          @mouseup="${this.onDragEnd}"
        />

        <table-axis 
          ticks="5" 
          range="[${this.widgetProps.min}, ${this.widgetProps.max}]"
        ></table-axis>
    </div>
    `;
  }
}

customElements.define('number-slider', NumberSlider);
