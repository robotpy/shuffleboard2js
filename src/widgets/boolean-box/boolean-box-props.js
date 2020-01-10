import { LitElement, html } from 'lit-element';
import { includeStyles } from '../../assets/js/render-utils';

class BooleanBoxProps extends LitElement {

  onColorWhenTrueChange(ev) {
    const color = ev.target.value;
    this.widgetProps.colorWhenTrue = color;
  }

  onColorWhenFalseChange(ev) {
    const color = ev.target.value;
    this.widgetProps.colorWhenFalse = color;
  }

  render() {
    console.log('PROPS:', this.widgetProps);
    return html`
      ${includeStyles()}
      <form>     
        <div class="form-group row">
          <label for="colorWhenTrue" class="col-sm-4 col-form-label text-right">Color when true</label>
          <div class="col-sm-8">
            <input 
              type="color" 
              class="form-control" 
              id="colorWhenTrue" 
              value="${this.widgetProps.colorWhenTrue}"
              @change="${this.onColorWhenTrueChange}">
          </div>
        </div>
        <div class="form-group row">
          <label for="colorWhenFalse" class="col-sm-4 col-form-label text-right">Color when false</label>
          <div class="col-sm-8">
            <input 
              type="color" 
              class="form-control" 
              id="colorWhenFalse" 
              value="${this.widgetProps.colorWhenFalse}"
              @change="${this.onColorWhenFalseChange}">
          </div>
        </div>
      </form>
    `;
  }
}

customElements.define('boolean-box-props', BooleanBoxProps);
