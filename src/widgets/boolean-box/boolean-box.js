const { LitElement, html, css } = dashboard.lit;

module.exports = class BooleanBox extends LitElement {

  static get styles() {
    return css`
      :host { 
        display: block; 
        width: 100px;
        height: 100px;
      }

      .background {
        width: 100%;
        height: 100%;
      }
    `;
  }

  updated() {
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
