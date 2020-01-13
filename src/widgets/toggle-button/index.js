const { LitElement, html, css } = dashboard.lit;

class ToggleButton extends LitElement {

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
    if (this.ntRoot) {
      this.value = this.table;
    }
  }

  onClick() {
    if (typeof this.table === 'boolean') {
      NetworkTables.putValue(this.ntRoot, !this.value);
    }
    else {
      this.value = !this.value;
    }
  };

  render() {
    return html`   
      <vaadin-button 
        theme="${this.theme} ${this.value ? 'primary' : ''}"
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
  acceptedTypes: ['boolean'],
  image: require('./toggle-button.png')
});