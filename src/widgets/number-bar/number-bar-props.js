import { LitElement, html, css } from 'lit-element';
import { includeStyles } from '../../assets/js/render-utils';

class NumberBarProps extends LitElement {

  static get styles() {
    return css`
      .form-check {
        padding-top: 6px;
      }
    `;
  }

  onShowTextChange(ev) {
    this.widgetProps.showText = ev.target.checked;
  };

  onNumTickMarksChange(ev) {
    const value = ev.target.value;

    if (value >= 0) {
      this.widgetProps.numTickMarks = value;
    }
  }

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
  };

  onCenterChange(ev) {
    const center = parseFloat(ev.target.value);
    this.widgetProps.center = center;
  }

  render() {
    return html`
      ${includeStyles()}
      <form>
        <div class="form-group row">
          <label for="min" class="col-sm-4 col-form-label text-right">Min</label>
          <div class="col-sm-8">
            <input 
              type="number" 
              class="form-control" 
              id="min" 
              value="${this.widgetProps.min}"
              @change="${this.onMinChange}"
            />
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
              @change="${this.onMaxChange}"
            />
          </div>
        </div>

        <div class="form-group row">
          <label for="center" class="col-sm-4 col-form-label text-right">Center</label>
          <div class="col-sm-8">
            <input 
              type="number" 
              class="form-control" 
              id="center" 
              value="${this.widgetProps.center}"
              @change="${this.onCenterChange}"
            />
          </div>
        </div>

        <div class="form-group row">
          <label for="numTickMarks" class="col-sm-4 col-form-label text-right">Num tick marks</label>
          <div class="col-sm-8">
            <input 
              type="number" 
              class="form-control" 
              id="numTickMarks" 
              value="${this.widgetProps.numTickMarks}"
              @change="${this.onNumTickMarksChange}"
            />
          </div>
        </div>

        <div class="form-group row">
          <label for="showText" class="col-sm-4 col-form-label text-right">Show text</label>
          <div class="col-sm-1">
            <div class="form-check">
              <input 
                class="form-check-input position-static" 
                type="checkbox" 
                id="showText" 
                ?checked="${this.widgetProps.showText}"
                @change="${this.onShowTextChange}"
              />
            </div>
          </div>
        </div>

      </form>
    `;
  }
}

customElements.define('number-bar-props', NumberBarProps);
