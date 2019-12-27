import { LitElement, html, css } from 'lit-element';

class BooleanBox extends LitElement {

  static get styles() {
    return css`
      .background {
        width: 100%;
        height: 100%;
      }
    `;
  }

  updated(a) {
    let background = 'black';

    if (this.table === true) {
        background = this.widgetProps.colorWhenTrue;
    }
    else if (this.table === false) {
        background = this.widgetProps.colorWhenFalse;
    }

    $(this.shadowRoot.getElementById('background')).css('background', background);
  }

  render() {
    return html`
      <div id="background" class="background"></div>
    `;
  }
}

customElements.define('boolean-box', BooleanBox);
