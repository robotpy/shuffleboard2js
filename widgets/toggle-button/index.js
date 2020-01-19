const { Widget, html, css } = dashboard.lit;

class ToggleButton extends Widget {

  static get styles() {
    return css`
      :host {
        display: inline-block;
        width: 100px;
        height: 50px;
      }

      [part=button] {
        width: 100%;
        height: 100%;
      }
    `;
  }

  static get properties() {
    return {
      value: { type: Boolean },
      theme: { type: String }
    }
  }

  constructor() {
    super();
    this.value = false;
    this.theme = 'contrast';
  }

  updated() {
    if (this.hasSource()) {
      this.value = this.sourceValue;
    }
  }

  onClick() {
    const newValue = this.sourceValue == true ? false : true;
    if (this.sourceType === 'Boolean') {
      this.sourceValue = newValue;
    }
    else {
      this.value = newValue;
    }
  };

  render() {
    return html`   
      <vaadin-button 
        theme="${this.theme} ${this.value == true ? 'primary' : ''}"
        part="button"
        @click="${this.onClick}"
      >
        <slot></slot>
      </vaadin-button>
    `;
  }
}


dashboard.registerWidget('toggle-button', {
  class: ToggleButton,
  label: 'Toggle Button',
  category: 'Basic',
  acceptedTypes: ['Boolean'],
  image: require('./toggle-button.png')
});