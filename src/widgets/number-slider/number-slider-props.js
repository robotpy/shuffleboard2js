const { LitElement, html } = require('lit-element');

module.exports = class NumberSliderProps extends LitElement {

  onMinChange(ev) {
    const min = parseFloat(ev.target.value);
    this.widgetProps.min = min;

    if (min > this.widgetProps.max) {
      this.widgetProps.max = min;
    }
  }

  onMaxChange(ev) {
    const max = parseFloat(ev.target.value);
    this.widgetProps.max = max;

    if (max < this.widgetProps.min) {
      this.widgetProps.min = max;
    }
  }

  onBlockIncrementChange(ev) {
    const value = parseFloat(ev.target.value);
    this.widgetProps.blockIncrement = value;
  }

  render() {
    return html`
      <form>
        <div class="form-group row">
          <label for="min" class="col-sm-4 col-form-label text-right">Min</label>
          <div class="col-sm-8">
            <input 
              type="number" 
              class="form-control" 
              id="min" 
              value="${this.widgetProps.min}"
              @change="${this.onMinChange}">
          </div>
        </div>

        <div class="form-group row">
          <label for="max" class="col-sm-4 col-form-label text-right">Max</label>
          <div class="col-sm-8">
            <input 
              type="number" 
              class="form-control" 
              id="max" 
              value="${this.widgetProps.max}"
              @change="${this.onMaxChange}">
          </div>
        </div>

        <div class="form-group row">
          <label for="blockIncrement" class="col-sm-4 col-form-label text-right">Block incrememnt</label>
          <div class="col-sm-8">
            <input 
              type="number" 
              class="form-control" 
              id="blockIncrement" 
              value="${this.widgetProps.blockIncrement}"
              @change="${this.onBlockIncrementChange}" />
          </div>
        </div>
      </form>
    `;
  }
}
